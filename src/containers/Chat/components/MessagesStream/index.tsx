import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Conversation, { ConversationMessage, ConversationData } from 'src/api/conversation'

import { UserMessages, DateSeparator, LoadingMessages, HISTORY_LIMIT } from '../Messages'

import store from 'src/store'
import { addMessages, AddMessagesData } from 'src/store/actions/Conversations'

type Props = {
  conversation: Conversation
  convData: ConversationData
  messages: ConversationMessage[]
  afterUpdate: () => void
}

class MessagesStream extends React.Component<Props> {
  state: {
    historyHasEnded: boolean
    loadingMessagesInView: Set<string>
    selectedMsg: number
  } = {
    historyHasEnded: false,
    loadingMessagesInView: new Set(),
    selectedMsg: 0,
  }

  async componentDidMount() {
    const { conversation, convData } = this.props
    const chat = this.chatContainer.current!

    conversation.addEventListener('newmessage', this.handleNewMessage)
    chat.addEventListener('scroll', this.handleScroll)

    const hash = Number(window.location.hash.replace('#', ''))
    if (hash) {
      this.setState({ selectedMsg: hash })
      if (convData.knownMessages.has(hash)) {
        document.getElementById(`msg-${hash}`)!.scrollIntoView()
        chat.scrollBy(0, -(chat.offsetHeight / 2))
      } else {
        try {
          const { before, after } = await conversation.getHistory(hash, HISTORY_LIMIT, HISTORY_LIMIT)
          const ref = after[0]

          if (!before.length && !after.length) {
            throw new Error()
          }

          const data: AddMessagesData = {
            messages: [...before, ...after].reverse(),
            conversationId: conversation.id,
            position: 'start',
            addLoadingMsgBefore: before.length < HISTORY_LIMIT ? false : true,
            addLoadingMsgAfter: after.length < HISTORY_LIMIT ? false : true,
          }

          store.dispatch(
            addMessages(data)
          )

          const refMsg = document.getElementById(`msg-${ref.id}`)
          if (refMsg) {
            refMsg.scrollIntoView()
            chat.scrollBy(0, -(chat.offsetHeight / 2))
          }
        } catch (e) {
          console.error(`Couldn't find ref message with id: ${hash} for conversation with id: ${conversation.id}`)
        }
      }
    }

    this.checkForLoadingMessagesInView()
  }

  componentWillUnmount() {
    this.props.conversation.removeEventListener('newmessage', this.handleNewMessage)
    this.chatContainer.current!.removeEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate() {
    this.props.afterUpdate()
  }

  chatContainer: React.RefObject<HTMLDivElement> = React.createRef()

  public render() {
    const rendered = []

    let i = 0
    for (const msg of this.props.messages) {
      if (msg.kind === 'message:user') {
        rendered.push(<UserMessages key={i} data={msg} selectedMsg={this.state.selectedMsg} />)
      } else if (msg.kind === 'message:separator') {
        rendered.push(<DateSeparator key={i} data={msg} />)
      } else if (msg.kind === 'message:loading') {
        rendered.push(<LoadingMessages
          key={i}
          data={msg}
          isInView={this.state.loadingMessagesInView.has(msg.id)}
          conversation={this.props.conversation}
          chatContainer={this.chatContainer.current!}
        />)
      }
      i++
    }

    return (
      <div className="chat__messages" ref={this.chatContainer}>
        {
          this.state.historyHasEnded ?
            <div className="chat__msg chat__msg--info">
              <Localized id="chat-message-begining">
                This is very beggining of your message history.
              </Localized>
            </div>
          : null
        }
        {rendered}
      </div>
    )
  }

  /**
   * Scroll to the bottom of conversation when new message is received.
   */
  private handleNewMessage = () => {
    const chat = this.chatContainer.current!
    const scrollBy = chat.scrollHeight - chat.clientHeight - chat.scrollTop

    const lastMsg = chat.querySelector<HTMLDivElement>('.chat__msg:last-child .chat__msg-single:last-child')
    const lastMsgHeight = lastMsg ? lastMsg.offsetHeight : 0

    // Scroll only if user didn't scroll to the top manually for value more than 150px.
    if ((scrollBy - lastMsgHeight) < 150) {
      this.chatContainer.current!.scrollBy(0, scrollBy)
    }
  }

  timeout: NodeJS.Timeout | null = null
  private handleScroll = async () => {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      // User stopped scrolling
      this.checkForLoadingMessagesInView()
    }, 200)
  }

  private checkForLoadingMessagesInView = () => {
    const chat = this.chatContainer.current!
    const loadingMessages = chat.querySelectorAll('.chat__msg--loading') as NodeListOf<HTMLDivElement>
    if (loadingMessages.length === 0) return
    let loadingMessagesInView = new Set<string>()
    loadingMessages.forEach(msg => {
      if (this.isElemInChatView(msg)) {
        if (loadingMessagesInView.size === 0) {
          // Load messages only from one LoadingMessages at the time.
          loadingMessagesInView.add(msg.dataset.id!)
        }
      }
    })
    this.setState({ loadingMessagesInView })
  }

  private isElemInChatView = (el: Element) => {
    const chatRect = this.chatContainer.current!.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const top = elRect.top
    const height = elRect.height

    if (top <= chatRect.bottom === false) return false
    // Check if the element is out of view due to a container scrolling
    if ((top + height) <= chatRect.top) return false
    // Check its within the document viewport
    return top <= document.documentElement.clientHeight
  }
}

export default MessagesStream
