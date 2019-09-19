import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { User, Team, TeamMember } from 'src/api'

import { State } from 'src/store/reducers'

import UserInfo from 'src/components/UserInfo'
import Spinner from 'src/components/Spinner'
import Input from 'src/components/ui/Input'

import './index.css'

export type UsersListProps = {
  team: Team | Team[]
  users: Map<number, User>
  isSearchable?: boolean
  allowedRoles?: number[]
  onUserClick: (user: User) => void
}

export type MembersMap = Map<number, { team: Team, members: TeamMember[] }>

export type UsersListState = {
  isLoading: boolean
  filterInput: string
  membersMap: MembersMap
}

const mapStateToProps = ({ user: { users } }: State) => {
  return {
    users,
  }
}

class UsersList extends React.Component<UsersListProps> {
  state: UsersListState = {
    isLoading: true,
    filterInput: '',
    membersMap: new Map(),
  }

  private handleFilterInput = (val: string) => {
    if (val !== this.state.filterInput) {
      this.setState({ filterInput: val })
    }
  }

  private fetchMembers = async () => {
    this.setState({ isLoading: true })

    const { team, allowedRoles = [], users } = this.props
    const { filterInput } = this.state
    const filterReg = new RegExp('^' + filterInput, 'i')

    let membersMap: MembersMap = new Map()
    const teams = Array.isArray(team) ? team : [team]

    for (const t of teams) {
      const members = (await t.members()).filter(member => {
        const user = users.get(member.user)!
        if (filterInput && !filterReg.test(user.name)) return false
        if (allowedRoles.length) {
          if (!member.role) return false
          if (!allowedRoles.includes(member.role.id)) return false
        }
        return true
      })

      membersMap.set(t.id, { team: t, members })
    }

    this.setState({ isLoading: false, membersMap })
  }

  componentDidUpdate(prevProps: UsersListProps) {
    if (!compareTeams(prevProps.team, this.props.team)) {
      this.fetchMembers()
    }
  }

  componentDidMount() {
    this.fetchMembers()
  }

  public render() {
    const { isLoading, membersMap } = this.state
    const { users, isSearchable } = this.props

    if (isLoading) return <Spinner />

    return (
      <div className="usersList">
        {
          isSearchable ?
            <Input
              l10nId="user-profile-team-list-search"
              onChange={this.handleFilterInput}
            />
          : null
        }
        {
          Array.from(membersMap.values()).map(({ team, members }) => {
            return (
              <div key={team.id} className="usersList__team">
                <span className="usersList__team-name">
                  <Localized id="user-profile-team-list-team" $team={team.name}>
                    Team: ...
                  </Localized>
                </span>
                <ul className="usersList__list">
                  {
                    members.length ?
                      members.map(member => {
                        const user = users.get(member.user)!
                        return (
                          <li
                            key={team.id + member.user}
                            className="usersList__item"
                            onClick={() => this.props.onUserClick(user)}
                          >
                            <UserInfo user={user} />
                          </li>
                        )
                      })
                    :
                      <li className="usersList__item--no-results">
                        <Localized id="user-profile-team-list-no-results">
                          There are no users with specified criteria.
                        </Localized>
                      </li>
                  }
                </ul>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(UsersList)

function compareTeams(team1: Team | Team[], team2: Team | Team[]) {
  team1 = Array.isArray(team1) ? team1 : [team1]
  team2 = Array.isArray(team2) ? team2 : [team2]
  if (team1.length !== team2.length) return false
  return team1.every((val, i) => val.id === team2[i].id)
}
