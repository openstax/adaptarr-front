import * as React from 'react'
import { connect } from 'react-redux'

import User from 'src/api/user'

import { State } from 'src/store/reducers'

import Avatar from 'src/components/ui/Avatar'

import './index.css'

interface SuggestionsProps {
  users: User[]
  searchQuery: string
  onSelect: (user: User) => void
}

const mapStateToProps = ({ user: { users } }: State) => ({
  users: Array.from(users.values()),
})

const KEYS_TO_HANDLE = ['ArrowUp', 'ArrowDown', 'Tab', 'Enter']

class Suggestions extends React.Component<SuggestionsProps> {
  state: {
    users: User[]
    selectedUser: User | null
  } = {
    users: [],
    selectedUser: null,
  }

  componentDidUpdate = (prevProps: SuggestionsProps) => {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.updateUsers()
    }
  }

  componentDidMount = () => {
    this.updateUsers()
    document.addEventListener('keydown', this.onKeyDown, true)
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.onKeyDown, true)
  }

  public render() {
    const { users, selectedUser } = this.state

    if (!this.props.searchQuery || users.length === 0) return null

    return (
      <ul className="mentions__list">
        {
          users.map(user => (
            <li
              key={user.id}
              className={
                `mentions__item ${selectedUser && selectedUser.id === user.id ? 'selected' : '' }`
              }
              data-id={user.id}
              onClick={this.onUserClick}
            >
              <Avatar
                size="small"
                withName={true}
                user={user}
                disableLink={true}
              />
            </li>
          )
          )
        }
      </ul>
    )
  }

  private updateUsers = () => {
    this.setState({ users: [] })

    if (!this.props.searchQuery) return

    const rgx = RegExp(`^${this.props.searchQuery}`, 'gi')

    // Only return the first 5 results
    const result = this.props.users.filter(u => u.name.match(rgx)).slice(0, 5)

    if (result.length === 0) {
      this.setState({ users: [], selectedUser: null })
    }

    const selectedUser = this.state.selectedUser
    const newSelectedUser: User = selectedUser && result.find(usr => usr.id === selectedUser.id)
      ? selectedUser
      : result[0]

    this.setState({
      users: result,
      selectedUser: newSelectedUser,
    })
  }

  private onUserClick = (ev: React.MouseEvent<HTMLLIElement>) => {
    ev.preventDefault()
    const userId = Number(ev.currentTarget.dataset.id)
    const user = this.state.users.find(usr => usr.id === userId)!

    this.props.onSelect(user)
  }

  private onKeyDown = (ev: KeyboardEvent) => {
    if (!this.props.searchQuery || !KEYS_TO_HANDLE.includes(ev.key)) return

    ev.preventDefault()
    ev.stopPropagation()

    const { users, selectedUser } = this.state
    const selectedUserIndex = selectedUser ? users.findIndex(usr => usr.id === selectedUser.id)! : 0

    if (ev.key === 'ArrowUp') {
      if (selectedUserIndex > 0) {
        this.setState({ selectedUser: users[selectedUserIndex - 1] })
      } else {
        this.setState({ selectedUser: users[users.length-1] })
      }
    } else if (ev.key === 'ArrowDown') {
      if (selectedUserIndex < users.length - 1) {
        this.setState({ selectedUser: users[selectedUserIndex + 1] })
      } else {
        this.setState({ selectedUser: users[0] })
      }
    } else if (ev.key === 'Tab' || ev.key === 'Enter') {
      if (selectedUser) {
        this.props.onSelect(selectedUser)
      }
    }
  }
}

export default connect(mapStateToProps)(Suggestions)
