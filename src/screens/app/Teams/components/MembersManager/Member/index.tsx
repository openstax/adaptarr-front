import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import { Role, Team, TeamMember, User } from 'src/api'
import { TeamPermission } from 'src/api/team'

import store from 'src/store'
import { UsersMap } from 'src/store/types'
import { addAlert } from 'src/store/actions/alerts'
import { State } from 'src/store/reducers'

import { confirmDialog } from 'src/helpers'

import { useIsInSuperMode } from 'src/hooks'

import LimitedUI from 'src/components/LimitedUI'
import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'
import TeamPermissions, { TEAM_PERMISSIONS } from 'src/components/TeamPermissions'

interface MemberProps {
  member: TeamMember
  team: Team
  user: User
  users: UsersMap
  onMemberRemove: (member: TeamMember) => void
  onMemberRoleChange: (member: TeamMember) => void
  onMemberPermissionsChange: (member: TeamMember) => void
}

const mapStateToProps = ({ user: { user, users } }: State) => ({
  user,
  users,
})

const Member = (props: MemberProps) => {
  const [showPermissions, setShowPermissions] = React.useState(false)
  const isInSuperMode = useIsInSuperMode(props.user)

  const togglePermissions = () => {
    setShowPermissions(!showPermissions)
  }

  const removeMember = async () => {
    const member = props.member

    const res = await confirmDialog({
      title: 'teams-member-remove-confirm-dialog',
      $user: props.users.get(member.user)!.name,
      $team: props.team.name,
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
          props.onMemberRemove(member)
        })
        .catch(() => {
          store.dispatch(addAlert('error', 'teams-member-remove-error'))
        })
    }
  }

  const handleMemberRoleChange = async (
    { value: { member, role } }: { value: { member: TeamMember, role: Role },
    label: string }
  ) => {
    await member.update({ role: role.id })
      .then(m => {
        store.dispatch(addAlert('success', 'teams-member-role-change-success'))
        props.onMemberRoleChange(m)
      })
      .catch(() => {
        store.dispatch(addAlert('error', 'teams-member-role-change-error'))
      })
  }

  const handleMemberPermissionsChange = async (permissions: TeamPermission[]) => {
    await props.member.update({ permissions })
      .then(m => {
        store.dispatch(addAlert('success', 'teams-member-permissions-change-success'))
        props.onMemberPermissionsChange(m)
      })
      .catch(() => {
        store.dispatch(addAlert('error', 'teams-member-permissions-change-error'))
      })
  }

  const { member: m, team, users, user: loggedUser } = props
  const memberUser = users.get(m.user)

  // If other user added member our global state can be out of sync.
  if (!memberUser) return null

  const usrTeam = loggedUser.teams.find(t => t.id === team.id)

  const isUserAbleToChangePermissions = isInSuperMode ||
    loggedUser.hasPermissionsInTeam('member:edit-permissions', team)

  // User can give another user only permissions which he has in a team.
  let disabledPermissions: TeamPermission[] = []
  if (usrTeam && showPermissions) {
    if (isInSuperMode) {
      disabledPermissions = []
    } else {
      disabledPermissions = TEAM_PERMISSIONS.filter(p => !usrTeam.allPermissions.has(p))
    }
  }

  return (
    <li className="teams__member">
      <div
        className={`teams__user ${isUserAbleToChangePermissions ? 'clickable' : ''}`}
        onClick={togglePermissions}
      >
        <Avatar user={memberUser} />
        <div className="teams__user-name">{memberUser.name}</div>
      </div>
      <div className="teams__member-controls">
        <LimitedUI team={team} permissions="member:assign-role">
          <Select
            className="react-select"
            value={m.role ? { value: { member: m, role: m.role }, label: m.role.name } : null}
            options={team.roles.map(r => ({ value: { member: m, role: r }, label: r.name }))}
            onChange={handleMemberRoleChange}
          />
        </LimitedUI>
        <LimitedUI team={team} permissions="member:remove">
          <Button clickHandler={removeMember}>
            <Localized id="teams-member-remove">
              Remove
            </Localized>
          </Button>
        </LimitedUI>
      </div>
      {
        isUserAbleToChangePermissions && showPermissions ?
          <LimitedUI team={team} permissions="member:edit-permissions">
            <div className="teams__member-permissions">
              <TeamPermissions
                selected={m.permissions}
                disabled={disabledPermissions}
                onChange={handleMemberPermissionsChange}
              />
            </div>
          </LimitedUI>
          : null
      }
    </li>
  )
}

export default connect(mapStateToProps)(Member)
