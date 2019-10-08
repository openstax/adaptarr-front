import * as React from 'react'
import { connect } from 'react-redux'

import User from 'src/api/user'
import Team, { TeamPermission } from 'src/api/team'

import { IsLoading } from 'src/store/types'
import { State } from 'src/store/reducers'

import { useIsInSuperMode } from 'src/hooks'

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

const LimitedUI = (props: Props & { children: React.ReactNode }) => {
  const [userHasPermissions, setUserHasPermissions] = React.useState(false)
  const isInSuperMode = useIsInSuperMode(props.user.user)

  /**
   * Check whether user has proper permissions.
   */
  const checkUserPermissions = () => {
    const { user: { user }, permissions, onePermissionFrom, onlySuper, team } = props

    if (onlySuper) {
      setUserHasPermissions(isInSuperMode)
      return
    }

    if (!permissions && !onePermissionFrom) {
      throw new Error('LimitedUI component require permissions or onePermissionFrom prop.')
    }

    if (isInSuperMode) {
      setUserHasPermissions(isInSuperMode)
      return
    }

    if (team) {
      const teamId = typeof team === 'number' ? team : team.id
      setUserHasPermissions(user.hasPermissionsInTeam(
          (permissions || onePermissionFrom) as TeamPermission | TeamPermission[],
          teamId
        )
      )
      return
    }

    if (permissions) {
      if (typeof permissions === 'string') {
        setUserHasPermissions(user.allPermissions.has(permissions))
      } else {
        setUserHasPermissions(permissions.every(p => user.allPermissions.has(p)))
      }
      return
    } else if (onePermissionFrom) {
      setUserHasPermissions(onePermissionFrom.some(p => user.allPermissions.has(p)))
      return
    }

    setUserHasPermissions(false)
    return
  }

  React.useEffect(() => {
    checkUserPermissions()
  })

  if (!userHasPermissions) return null

  return (
    <div className="limitedui">
      {props.children}
    </div>
  )
}

export default connect(mapStateToProps)(LimitedUI)
