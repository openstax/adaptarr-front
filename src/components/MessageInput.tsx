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

type LocalState = {
  users: User[]
  filteredUsers: User[]
  selectedUser: User | undefined
  showUsersList: boolean
  usernameText: string
  currSelection: number
  startPosition: number
  textareaValue: string
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
  
  state: LocalState = {
    users: [],
    filteredUsers: [],
    selectedUser: undefined,
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
        selectedUser: this.state.users[0],
        filteredUsers: [...this.state.users],
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
      selectedUser: undefined,
      startPosition: 0,
    })
  }

  private selectUserToMention = (user?: User) => {
    const { selectedUser, startPosition, textareaValue, usernameText } = this.state

    const usr = user ? user : (selectedUser ? selectedUser : undefined)

    if (!usr) {
      store.dispatch(addAlert('error', `Something went wrong while selecting user.`))
      return
    }
    
    const newText =
      textareaValue.slice(0, startPosition) +
      usr.name +
      textareaValue.slice(startPosition + usernameText.length, textareaValue.length)      

    this.hideUsersList()
    this.setState({ textareaValue: newText })
    
    this.endHandler()
  }

  private handleInput = (metaInfo: MetaInfo) => {
    const t = metaInfo.text ? metaInfo.text.split(' ')[0] : ''
    const selectedUser = this.state.selectedUser
    let filteredUsers = this.state.users
    
    // selUsr is always first user so before filtering results he is always inside
    let isSelUsrInFiltRes = true
    if (t.length) {
      isSelUsrInFiltRes = false
      const reg = new RegExp(`^${t}`, "i")
      filteredUsers = filteredUsers.filter(user => {
        if (reg.test(user.name)) {
          if (selectedUser && selectedUser.id === user.id) {
            isSelUsrInFiltRes = true
          }
          return user
        }
        return null
      })
    }

    let newState: {
      usernameText: string
      filteredUsers: User[]
      selectedUser?: User
    } = {
      usernameText: t ? t : '',
      filteredUsers,
    }

    console.log('isSelUsrInFiltRes:', isSelUsrInFiltRes, 'selectedUser:', selectedUser)

    if (!isSelUsrInFiltRes) {
      newState.selectedUser = filteredUsers[0]
    }

    this.setState({ ...newState })
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { which } = e;
    let { showUsersList, selectedUser, filteredUsers } = this.state

    if (which === 13 && !e.shiftKey) { // enter
      e.preventDefault()

      if (!showUsersList) {
        this.sendMessage()
        return
      }

      this.selectUserToMention()
    }

    if (!selectedUser || filteredUsers.length <= 1) return

    let idxOfSelUsr = 0
    filteredUsers.some((usr, i) => {
      if (usr.id === (selectedUser as User).id) {
        idxOfSelUsr = i
        return true
      }
      return false
    })

    if (which === 40) { // down arrow
      e.preventDefault()

      const newSelUser = filteredUsers[idxOfSelUsr + 1]
      if (newSelUser) {
        this.setState({ selectedUser: newSelUser })
      }

    } else if (which === 38) { // up arrow
      e.preventDefault()

      const newSelUser = filteredUsers[idxOfSelUsr - 1]
      if (newSelUser) {
        this.setState({ selectedUser: newSelUser })
      }
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
    let { filteredUsers, selectedUser } = this.state

    if (filteredUsers.length) {
      return (
        <ul className="usersList">
          {
            filteredUsers.map(user => {
              return (
                <li
                  key={user.id}
                  className={`usersList__item ${selectedUser && user.id === selectedUser.id ? 'selected' : null}`}
                  onClick={() => this.selectUserToMention(user)}
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
    let text = this.state.textareaValue

    this.props.team.teamMap.forEach(usr => {
      const reg = new RegExp('^@'+usr.name, 'g')
      if (reg.test(text)) {
        text = text.replace(reg, `[MENTION ${usr.name} ${usr.id}]`)
      }
    })

    const msg = {
      user: this.props.user.user,
      message: text,
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
      this.setState({ users, filteredUsers: [...users] })
    }
  }

  componentDidMount = () => {
    let users: User[] = []
    this.props.team.teamMap.forEach(user => {
      users.push(user)
    })
    this.setState({ users, filteredUsers: [...users] })
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
