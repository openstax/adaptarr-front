import * as React from 'react'
import { connect } from 'react-redux'

import sortArrayByName from 'src/helpers/sortArrayByName'

import UserInfo from 'src/components/UserInfo'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

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

  state: {
    filterInput: string
  } = {
    filterInput: '',
  }

  private listOfUsers = (teamMap: TeamMap) => {
    const filterReg = new RegExp('^' + this.state.filterInput, 'i')
    let users: User[] = []

    teamMap.forEach(user => {
      if (this.state.filterInput) {
        if (filterReg.test(user.name)) {
          users.push(user)
        }
      }
    })

    users.sort(sortArrayByName)

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
                onChange={this.handleFilterInput}
                placeholder="Search for user"
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
