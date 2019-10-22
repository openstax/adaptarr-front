import * as React from 'react'
import { connect } from 'react-redux'

import Conversation, { ConversationData, ConversationMessage } from 'src/api/conversation'

import { State } from 'src/store/reducers'

import InputEditor from './components/InputEditor'
import MessagesStream from './components/MessagesStream'

import Spinner from 'src/components/Spinner'

import './index.css'

type Props = {
  conversation: Conversation
  conversations: Map<number, ConversationData>
  messages: Map<number, ConversationMessage[]>
}

const mapStateToProps = ({ conversations: { conversations, messages } }: State) => ({
  conversations,
  messages,
})

class Chat extends React.Component<Props> {
  private focusInput = () => {
    if (this.inputEditor.current) {
      this.inputEditor.current!.focus()
    }
  }

  componentDidMount() {
    this.focusInput()
  }

  inputEditor = React.createRef<InputEditor>()

  public render() {
    const { conversation, conversations, messages } = this.props
    const convData = conversations.get(conversation.id)
    const chatMessages = messages.get(conversation.id) || []

    if (!convData) return <Spinner />

    return (
      <div className="chat">
        <MessagesStream
          conversation={conversation}
          convData={convData}
          messages={chatMessages}
          afterUpdate={this.focusInput}
        />
        <InputEditor
          ref={this.inputEditor}
          socket={conversation}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(Chat)
