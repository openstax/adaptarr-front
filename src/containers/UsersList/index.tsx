import * as React from 'react'
import { connect } from 'react-redux'

import UserInfo from 'src/components/UserInfo'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { TeamMap, User, ModulesMap, BookPart } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  mod: BookPart | null
  team: {
    teamMap: TeamMap
  }
  modules: {
    modulesMap: ModulesMap
  }
  onUserClick: (user: User, action: 'assign' | 'remove') =>  any
}

const mapStateToProps = ({ team, modules }: State) => {
  return {
    team,
    modules,
  }
}

class UsersList extends React.Component<Props> {

  private listOfUsers = (teamMap: TeamMap) => {
    let users: User[] = []

    teamMap.forEach(user => {
      users.push(user)
    })

    return users.map((user: User) => {
      const modulesMap = this.props.modules.modulesMap
      const modId = this.props.mod ? this.props.mod.id : null
      const mod = modId ? modulesMap.get(modId) : null
      
      return (
        <li 
          key={user.id} 
          className="usersList__item"
        >
          <span onClick={() => this.props.onUserClick(user, 'assign')}>
            <UserInfo user={user} />
          </span>
          {
            mod && mod.assignee === user.id ?
              <Button color="red" clickHandler={() => this.props.onUserClick(user, 'remove')}>
                <Icon name="minus" />
              </Button>
            : null
          }
        </li>
      )
    })
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
