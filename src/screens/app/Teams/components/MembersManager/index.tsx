import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized, withLocalization, GetString } from 'fluent-react/compat'

import { Team, TeamMember, Role, User } from 'src/api'

import store from 'src/store'
import { UsersMap } from 'src/store/types'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchUsersMap } from 'src/store/actions/User'
import { State } from 'src/store/reducers'

import confirmDialog from 'src/helpers/confirmDialog'

import Spinner from 'src/components/Spinner'
import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'

import './index.css'
import LimitedUI from 'src/components/LimitedUI'

export type MembersManagerProps = {
  team: Team
  users: UsersMap
  getString: GetString
}

const mapStateToProps = ({ user: { users } }: State) => {
  return {
    users,
  }
}

export type MembersManagerState = {
  isLoading: boolean
  members: TeamMember[]
  selectedUser: User | null
  selectedRole: Role | null
}

class MembersManager extends React.Component<MembersManagerProps> {
  state: MembersManagerState = {
    isLoading: true,
    members: [],
    selectedUser: null,
    selectedRole: null,
  }

  private removeMember = async (member: TeamMember) => {
    const res = await confirmDialog({
      title: 'teams-member-remove-confirm-dialog',
      $user: this.props.users.get(member.user)!.name,
      $team: this.props.team.name,
      showCloseButton: false,
      buttons: {
        cancel: 'teams-member-cancel',
        confirm: 'teams-member-remove',
      },
    })
    if (res === 'confirm') {
      member.delete()
        .then(() => {
          store.dispatch(addAlert('success', 'teams-member-remove-success'))
          this.setState({
            members: this.state.members.filter(m => m.user !== member.user)
          })
        })
        .catch(() => {
          store.dispatch(addAlert('error', 'teams-member-remove-error'))
        })
    }
  }

  private handleMemberRoleChange = async ({ value: { member, role } }: { value: { member: TeamMember, role: Role }, label: string }) => {
    await member.update({ role: role.id })
      .then(() => {
        store.dispatch(addAlert('success', 'teams-member-role-change-success'))
      })
      .catch(() => {
        store.dispatch(addAlert('error', 'teams-member-role-change-error'))
      })
    this.setState({ members: await this.props.team.members(false) })
  }

  private handleUserChange = (option: { value: User, label: string } | null) => {
    this.setState({ selectedUser: option ? option.value : option })
  }

  private handleRoleChange = (option: { value: Role, label: string } | null) => {
    this.setState({ selectedRole: option ? option.value : option })
  }

  private addMember = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!this.state.selectedUser) return
    this.props.team.addMember({
      user: this.state.selectedUser.id,
      role: this.state.selectedRole ? this.state.selectedRole.id : undefined,
      permissions: [],
    }).then(() => {
      this.fetchMembers()
      this.setState({ selectedUser: null })
      store.dispatch(fetchUsersMap())
      store.dispatch(addAlert('success', 'teams-member-add-success'))
    }).catch(() => {
      store.dispatch(addAlert('error', 'teams-member-add-error'))
    })
  }

  private fetchMembers = () => {
    this.setState({ isLoading: true }, async () => {
      const members = await this.props.team.members(false)
      this.setState({ members, isLoading: false })
    })
  }

  componentDidUpdate(prevProps: MembersManagerProps) {
    if (prevProps.team.id !== this.props.team.id) {
      this.fetchMembers()
    }
  }

  componentDidMount() {
    this.fetchMembers()
  }

  public render() {
    const { isLoading, members, selectedUser, selectedRole } = this.state

    if (isLoading) return <Spinner />

    const { team, users, getString } = this.props
    const usersToAdd = Array.from(users.values())
      .filter(u => !u.teams.find(t => t.id === team.id))
      .map(user => ({ value: user, label: user.name }))

    return (
      <>
        <LimitedUI team={team} permissions="member:add">
          <form
            className="teams__member-add"
            onSubmit={this.addMember}
          >
            <Select
              className="react-select"
              isClearable={true}
              placeholder={getString('teams-select-user')}
              value={selectedUser ? { value: selectedUser, label: selectedUser.name } : null}
              options={usersToAdd}
              onChange={this.handleUserChange}
            />
            <LimitedUI team={team} permissions="member:assign-role">
              <Select
                className="react-select"
                isClearable={true}
                placeholder={getString('teams-select-role')}
                value={selectedRole ? { value: selectedRole, label: selectedRole.name } : null}
                options={team.roles.map(r => ({ value: r, label: r.name }))}
                onChange={this.handleRoleChange}
              />
            </LimitedUI>
            <Localized id="teams-member-add" attrs={{ value: true }}>
              <input type="submit" value="Invite user" disabled={!selectedUser}/>
            </Localized>
          </form>
        </LimitedUI>
        <ul className="teams__members">
          {
            members.length === 0 ?
              <span className="teams__no-members">
                <Localized id="teams-no-members">
                  This team doesn't have members.
                </Localized>
              </span>
            :
              members.map(m => {
                const user = users.get(m.user)
                if (!user) return null
                return (
                  <li
                    key={m.user}
                    className="teams__member"
                  >
                    <div className="teams__user">
                      <Avatar user={user} />
                      <div className="teams__user-name">{user.name}</div>
                    </div>
                    <div className="teams__member-controls">
                      <LimitedUI team={team} permissions="member:assign-role">
                        <Select
                          className="react-select"
                          value={m.role ? { value: { member: m, role: m.role }, label: m.role.name } : null}
                          options={team.roles.map(r => ({ value: { member: m, role: r }, label: r.name }))}
                          onChange={this.handleMemberRoleChange}
                        />
                      </LimitedUI>
                      <LimitedUI team={team} permissions="member:remove">
                        <Button clickHandler={() => this.removeMember(m)}>
                          <Localized id="teams-member-remove">
                            Remove
                          </Localized>
                        </Button>
                      </LimitedUI>
                    </div>
                  </li>
                )
              })
          }
        </ul>
      </>
    )
  }
}

export default connect(mapStateToProps)(withLocalization(MembersManager))
