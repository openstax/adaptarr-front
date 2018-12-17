import * as React from 'react'
import { connect } from 'react-redux'

import UserInfo from 'src/components/UserInfo'

import { TeamMap, User } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  team: {
    teamMap: TeamMap
  }
  onUserClick: (user: User) =>  any
}

const mapStateToProps = ({ team }: State) => {
  return {
    team,
  }
}

class UsersList extends React.Component<Props> {

  private listOfUsers = (teamMap: TeamMap) => {
    let users: User[] = []

    teamMap.forEach(user => {
      users.push(user)
    })

    return users.map((user: User) => {
      return (
        <li 
          key={user.id} 
          className="usersList__item"
          onClick={() => this.handleUserClick(user)}
        >
          <UserInfo user={user} />
        </li>
      )
    })
  }

  private handleUserClick = (user: User) => {
    this.props.onUserClick(user)
  }

  public render() {
    const { teamMap } = this.props.team

    return (
      <div className="usersList">
        {
          teamMap.size > 0 ?
            <ul className="usersList__list">
              {this.listOfUsers(teamMap)}
            </ul>
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(UsersList)
