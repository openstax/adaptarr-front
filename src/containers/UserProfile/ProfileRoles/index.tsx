import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { User, Role, TeamMember } from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { fetchUser } from 'src/store/actions/user'
import { State } from 'src/store/reducers'
import { TeamsMap } from 'src/store/types'

import { confirmDialog } from 'src/helpers'

import { useIsInSuperMode } from 'src/hooks'

import Button from 'src/components/ui/Button'

export type ProfileRolesProps = {
  user: User
  loggedUser: User
  teams: TeamsMap
}

const mapStateToProps = ({ app: { teams } }: State) => {
  return {
    teams,
  }
}

const ProfileRoles = (props: ProfileRolesProps) => {
  const isInSuperMode = useIsInSuperMode(props.loggedUser)
  const [userTeams, setUserTeams] = React.useState(props.user.teams)

  const handleRoleChange = async ({ value }: { value: Role, label: string }) => {
    const res = await confirmDialog({
      title: 'user-profile-role-change',
      $role: value.name,
      buttons: {
        cancel: 'user-profile-role-button-cancel',
        confirm: 'user-profile-role-button-change',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      changeRole(value.team, value)
    }
  }

  const handleRoleUnassign = async (team: number) => {
    const res = await confirmDialog({
      title: 'user-profile-role-remove',
      buttons: {
        cancel: 'user-profile-role-button-cancel',
        confirm: 'user-profile-role-button-remove',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      changeRole(team, null)
    }
  }

  const changeRole = (team: number, newRole: Role | null) => {
    const member = new TeamMember({ user: props.user.id, permissions: [], role: newRole }, team)
    member.update({ role: newRole ? newRole.id : null })
      .then(() => {
        if (newRole) {
          store.dispatch(addAlert('success', 'user-profile-change-role-success', {
            name: newRole.name
          }))
        } else {
          store.dispatch(addAlert('success', 'user-profile-unassign-role-success'))
        }
        props.user.teams.find(t => t.id === team)!.role = newRole
        setUserTeams([...props.user.teams])
      })
      .catch((e) => {
        if (newRole) {
          store.dispatch(addAlert('error', 'user-profile-change-role-error', {
            details: e.response.data.error
          }))
        } else {
          store.dispatch(addAlert('error', 'user-profile-unassign-role-error', {
            details: e.response.data.error
          }))
        }
      })
  }

  const { loggedUser, teams } = props

  return (
    <div className="profile__roles">
      {
        userTeams.map(team => {
          // We want to check if current (logged) user can change role for user's
          // profile which he is now viewing.
          const currUsrTeam = loggedUser.teams.find(t => t.id === team.id)
          let isEditable = false
          let options: { value: Role, label: string }[] = []

          if (
            isInSuperMode ||
            (
              currUsrTeam &&
              currUsrTeam.allPermissions.has('member:assign-role')
            )
          ) {
            isEditable = true

            if (teams.has(team.id)) {
              options = teams.get(team.id)!.roles.map(role => ({ value: role, label: role.name }))
            }
          }
          return (
            <div key={team.id} className="profile__role">
              <span className="profile__role-name">
                {
                  team.role ?
                    <Localized
                      id="user-profile-role-in-team"
                      $team={team.name}
                      $role={team.role.name}
                    >
                      {`{ $role } in team { $team }`}
                    </Localized>
                  :
                    <Localized
                      id="user-profile-no-role-in-team"
                      $team={team.name}
                    >
                      {`No role in team { $team }`}
                    </Localized>
                }
              </span>
              {
                isEditable ?
                  <>
                    <Select
                      className="react-select"
                      value={team.role ? { value: team.role, label: team.role.name } : null}
                      options={options}
                      formatOptionLabel={option => option.label}
                      onChange={handleRoleChange}
                    />
                    {
                      team.role ?
                        <Button
                          clickHandler={() => handleRoleUnassign(team.id)}
                        >
                          <Localized id="user-profile-section-role-unassign">
                            Unassign user from role
                          </Localized>
                        </Button>
                      : null
                    }
                  </>
                : null
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default connect(mapStateToProps)(ProfileRoles)
