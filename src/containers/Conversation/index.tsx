import * as React from 'react'
import { connect } from 'react-redux'

import dateDiff from 'src/helpers/dateDiff'

import Avatar from 'src/components/ui/Avatar'
import MessageInput from 'src/components/MessageInput'

import * as types from 'src/store/types'
import { fetchConversation } from 'src/store/actions/Conversations'
import { State } from 'src/store/reducers'

type Props = {
  id: string
  user: {
    user: types.User
  }
  team: {
    teamMap: types.TeamMap
  }
  conversation: types.Conversation
  fetchConversation: (id: string) => void
}

const mapStateToProps = ({ user, team, conversation }: State) => {
  return {
    user,
    team,
    conversation,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchConversation: (id: string) => dispatch(fetchConversation(id))
  }
}

class Conversation extends React.Component<Props> {

  private listOfMessages = (messages: types.Message[]) => {
    const me = this.props.user.user

    return messages.map((msg, i) => {
      return (
        <div
          key={msg.timestamp + i}
          className={`conv__message conv__message--${msg.user.id === me.id ? 'me' : 'other'}`}
        >
          <div className="conv__content">
            {
              msg.user.id !== me.id ?
                <div className="conv__avatar">
                  <Avatar size="small" user={msg.user}/>
                </div>
              : null
            }
            <div
              className="conv__text"
              dangerouslySetInnerHTML={{__html: this.parseMessageText(msg.message)}}
            ></div>
            <div className="conv__date">
              {dateDiff(msg.timestamp)}
            </div>
          </div>
        </div>
      )
    })
  }

  private parseMessageText = (msg: string): string => {
    msg = msg.replace(/<(?:[^.]|\s)*?>/g, "")
    this.props.team.teamMap.forEach(usr => {
      const reg = new RegExp("@"+usr.name, "g")
      msg = msg.replace(reg, `<a class="mention" href="/users/${usr.id}" target="_blank">@${usr.name}</a>`)
    })
    return msg
  }

  private scrollMessages = () => {
    const msgs = this.msgsRef.current
    if (msgs) {
      msgs.scrollBy(0, msgs.scrollHeight - msgs.offsetHeight)
    }
  }

  componentDidUpdate = (prevProps: Props) => {
    if (this.props.id && prevProps.id !== this.props.id) {
      this.props.fetchConversation(this.props.id)
    }
    if (prevProps.conversation !== this.props.conversation) {
      this.scrollMessages()
    }
  }

  componentDidMount = () => {
    if (this.props.id) {
      this.props.fetchConversation(this.props.id)
    }
  }

  msgsRef: React.RefObject<HTMLDivElement> = React.createRef()

  public render() {
    const { messages } = this.props.conversation

    return (
      <div className="conv">
        <div
          ref={this.msgsRef}
          className="conv__messages"
        >
          {
            messages.length ?
              this.listOfMessages(messages)
            : null
          }
        </div>
        <div className="conv__input">
          <MessageInput convId={this.props.id}/>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
