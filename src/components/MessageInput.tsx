import * as React from 'react'
import InputTrigger, { MetaInfo } from 'react-input-trigger'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'

import UserInfo from 'src/components/UserInfo'
import Button from 'src/components/ui/Button'

import store from 'src/store'
import { State } from 'src/store/reducers'
import { TeamMap, User, Message } from 'src/store/types'
import { addAlert } from 'src/store/actions/Alerts'
import { addMessage } from 'src/store/actions/Conversations'

type Props = {
  convId: string
  user: {
    user: User
  }
  team: {
    teamMap: TeamMap
  }
  addMessage: (convId: string, msg: Message) => void
}

const mapStateToProps = ({ user, team }: State) => {
  return {
    user,
    team,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addMessage: (id: string, msg: Message) => dispatch(addMessage(id, msg))
  }
}

class MessageInput extends React.Component<Props> {
  
  state: {
    users: User[]
    showUsersList: boolean
    usernameText: string
    currSelection: number
    startPosition: number
    textareaValue: string
  } = {
    users: [],
    showUsersList: false,
    usernameText: '',
    currSelection: 0,
    startPosition: 0,
    textareaValue: '',
  }

  private showUsersList = (metaInfo: MetaInfo) => {
    if (!this.state.showUsersList) {
      this.setState({
        showUsersList: true,
        startPosition: metaInfo.cursor.selectionStart,
        usernameText: '',
      })
    }
  }

  private hideUsersList = () => {
    if (this.state.showUsersList) {
      this.setState({ showUsersList: false })
      this.resetValues()
    }
  }

  private resetValues = () => {
    this.setState({
      usernameText: '',
      currSelection: 0,
      startPosition: 0,
    })
  }

  private selectUserToMention = (index?: number) => {
    const { currSelection, users, startPosition, textareaValue, usernameText } = this.state

    const user = users[index ? index : currSelection]
    const username = user.name ? user.name : undefined

    if (!username) {
      store.dispatch(addAlert('error', `Something went wrong while selecting user.`))
      return
    }
    
    const newText =
      textareaValue.slice(0, startPosition) +
      username +
      textareaValue.slice(startPosition + usernameText.length, textareaValue.length)      

    this.hideUsersList()
    this.setState({ textareaValue: newText })
    
    this.endHandler()
  }

  private handleInput = (metaInfo: MetaInfo) => {
    const t = metaInfo.text ? metaInfo.text.split(' ')[0] : metaInfo.text
    this.setState({ usernameText: t })
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { which } = e;
    const { showUsersList, currSelection, users } = this.state
    
    if (which === 40 ) { // down arrow
      e.preventDefault()
      
      this.setState({
        currSelection: (currSelection + 1) % users.length,
      })
    } else if (which === 38 && currSelection > 0) { // up arrow
      e.preventDefault()
      
      this.setState({
        currSelection: currSelection - 1,
      })
    }

    if (which === 13 && !e.shiftKey) { // enter
      e.preventDefault()

      if (!showUsersList) {
        this.sendMessage()
        return
      }

      this.selectUserToMention()
    }
  }

  private handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    
    this.setState({
      textareaValue: value,   
    })
  }

  // This endHandler is replaced with endHandler triggered by InputTrigger component
  private endHandler = () => {}

  private listOfUsers = () => {
    let { users, usernameText, currSelection } = this.state

    const reg = new RegExp(`^${usernameText}`, "i")

    users = users.filter(user => {
      if (reg.test(user.name)) {
        return user
      }
      return null
    })

    if (users.length) {
      return (
        <ul className="usersList">
          {
            users.map((user, i) => {
              return (
                <li
                  key={user.id}
                  className={`usersList__item ${i === currSelection ? 'selected' : null}`}
                  onClick={() => this.selectUserToMention(i)}
                >
                  <UserInfo user={user}/>
                </li>
              )
            })
          }
        </ul>
      )
    } else {
      return null
    }
  }

  private sendMessage = () => {
    if (this.state.textareaValue.length === 0) return
    const msg = {
      user: this.props.user.user,
      message: this.state.textareaValue,
      timestamp: new Date().toISOString()
    }
    this.props.addMessage(this.props.convId, msg)
    this.setState({ textareaValue: '' })
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.team.teamMap.size !== this.props.team.teamMap.size) {
      let users: User[] = []
      this.props.team.teamMap.forEach(user => {
        users.push(user)
      })
      this.setState({ users })
    }
  }

  componentDidMount = () => {
    let users: User[] = []
    this.props.team.teamMap.forEach(user => {
      users.push(user)
    })
    this.setState({ users })
  }

  public render() {
    return (
      <div
        className="msgInput"
        onKeyDown={this.handleKeyDown}
      >
        {
          this.state.showUsersList ?
            this.listOfUsers()
          : null
        }
        <InputTrigger
          trigger={{
            keyCode: 50,
            shiftKey: true,
          }}
          onStart={(metaInfo) => { this.showUsersList(metaInfo) }}
          onCancel={() => { this.hideUsersList() }}
          onType={(metaInfo) => { this.handleInput(metaInfo) }}
          endTrigger={(endHandler) => { this.endHandler = endHandler }}
        >
          <textarea
            className="msgInput__text"
            placeholder="Type your message..."
            onChange={this.handleTextareaInput}
            value={this.state.textareaValue}
          ></textarea>
        </InputTrigger>
        <Button
          clickHandler={() => this.sendMessage()}
        >
          <Trans i18nKey="Buttons.send"/>
        </Button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)
