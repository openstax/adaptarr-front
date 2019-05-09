import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import sortArrayByName from 'src/helpers/sortArrayByName'
import { User } from 'src/api'

import UserInfo from 'src/components/UserInfo'
import Input from 'src/components/ui/Input'

import { TeamMap, ModulesMap } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  allowedRole?: number | null,
  team: {
    teamMap: TeamMap
  }
  modules: {
    modulesMap: ModulesMap
  }
  onUserClick: (user: User) =>  any
}

const mapStateToProps = ({ team, modules }: State) => {
  return {
    team,
    modules,
  }
}

class UsersList extends React.Component<Props> {
  state: {
    filterInput: string
  } = {
    filterInput: '',
  }

  private listOfUsers = (teamMap: TeamMap) => {
    const allowedRole = this.props.allowedRole
    const filterReg = new RegExp('^' + this.state.filterInput, 'i')
    let users: User[] = []

    teamMap.forEach(user => {
      if (this.state.filterInput) {
        if (filterReg.test(user.name)) {
          if (allowedRole) {
            if (user.role && user.role.id === allowedRole) {
              users.push(user)
            }
          } else {
            users.push(user)
          }
        }
      } else {
        if (allowedRole) {
          if (user.role && user.role.id === allowedRole) {
            users.push(user)
          }
        } else {
          users.push(user)
        }
      }
    })

    users.sort(sortArrayByName)

    if (!users.length) {
      return (
        <li className="usersList__item--no-results">
          <Localized id="user-profile-team-list-no-results">
            There are not users with specified criteria.
          </Localized>
        </li>
      )
    }

    return users.map((user: User) => {
      return (
        <li
          key={user.id}
          className="usersList__item"
        >
          <span onClick={() => this.props.onUserClick(user)}>
            <UserInfo user={user} />
          </span>
        </li>
      )
    })
  }

  private handleFilterInput = (val: string) => {
    if (val !== this.state.filterInput) {
      this.setState({ filterInput: val})
    }
  }

  public render() {
    const { teamMap } = this.props.team

    return (
      <div className="usersList">
        {
          teamMap.size > 6 ?
            <div className="usersList">
              <Input
                l10nId="user-profile-team-list-search"
                onChange={this.handleFilterInput}
              />
            </div>
          : null
        }
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
