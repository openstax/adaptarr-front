import * as React from 'react'
import { connect } from 'react-redux'

import User, { SystemPermission } from 'src/api/user'
import Team, { TeamPermission } from 'src/api/team'

import { IsLoading } from 'src/store/types'
import { State } from 'src/store/reducers'

import './index.css'

type Props = {
  user: {
    isLoading: IsLoading
    user: User
  }
  // User has to have one or more permissions to see hidden UI.
  permissions: SystemPermission | TeamPermission | (SystemPermission | TeamPermission)[]
  // If specified then user has to have permissions in this team.
  team?: Team | number
}

const mapStateToProps = ({ user }: State) => {
  return {
    user,
  }
}

class LimitedUI extends React.Component<Props> {

  public render() {
    const { user: { user }, permissions, team } = this.props

    // Render component only if user have proper permissions
    // or if it is super user.
    if (!user.is_super) {
      if (typeof permissions === 'string') {
        if (team) {
          const usrTeam = user.teams.find(t => t.id === (typeof team === 'number' ? team : team.id))
          if (
            !usrTeam ||
            !usrTeam.role ||
            !usrTeam.role.permissions ||
            !usrTeam.role.permissions.includes(permissions as TeamPermission)
          ) return null
        } else if (!user.allPermissions.has(permissions)) {
          return null
        }
      } else {
        if (team) {
          const usrTeam = user.teams.find(t => t.id === (typeof team === 'number' ? team : team.id))
          if (
            !usrTeam ||
            !usrTeam.role ||
            !usrTeam.role.permissions ||
            !permissions.every(p => usrTeam.role!.permissions!.includes(p as TeamPermission))
          ) return null
        } else {
          let noAccess = permissions.some(p => {
            if (!user.allPermissions.has(p)) {
              return true
            }
            return false
          })
          if (noAccess) return null
        }
      }
    }

    return (
      <div className="limitedui">
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(LimitedUI)
