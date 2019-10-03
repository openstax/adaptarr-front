import * as React from 'react'
import { connect } from 'react-redux'

import User from 'src/api/user'
import Team, { TeamPermission } from 'src/api/team'

import { IsLoading } from 'src/store/types'
import { State } from 'src/store/reducers'

import './index.css'

// permissions or onePermissionFrom is required if onlyUser is not set to true
type Props = {
  user: {
    isLoading: IsLoading
    user: User
  }
  // User has to have one or more permissions to see hidden UI.
  permissions?: TeamPermission | TeamPermission[]
  // User has to have one permission from given array.
  onePermissionFrom?: TeamPermission[]
  // Only users with isInSuperMode: true can see this component
  onlySuper?: boolean
  // If specified then user has to have permissions in this team.
  team?: Team | number
}

const mapStateToProps = ({ user }: State) => {
  return {
    user,
  }
}

class LimitedUI extends React.Component<Props> {
  state = {
    userHasPermissions: false,
  }

  /**
   * Render component only if user have proper permissions or if it is super user.
   */
  private userHasPermissions = (): boolean => {
    const { user: { user }, permissions, onePermissionFrom, onlySuper, team } = this.props

    if (onlySuper) {
      if (user.isInSuperMode) return true
      return false
    }

    if (!permissions && !onePermissionFrom) {
      throw new Error('LimitedUI component require permissions or onePermissionFrom prop.')
    }

    if (user.isInSuperMode) return true

    if (team) {
      const teamId = typeof team === 'number' ? team : team.id
      return user.hasPermissionsInTeam(
          (permissions || onePermissionFrom) as TeamPermission | TeamPermission[],
          teamId
        )
    }

    if (permissions) {
      if (typeof permissions === 'string') {
        return user.allPermissions.has(permissions)
      } else {
        return permissions.every(p => user.allPermissions.has(p))
      }
    } else if (onePermissionFrom) {
      return onePermissionFrom.some(p => user.allPermissions.has(p))
    }

    return false
  }

  public render() {
    if (!this.userHasPermissions()) return null

    return (
      <div className="limitedui">
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(LimitedUI)
