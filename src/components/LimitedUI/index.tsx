import * as React from 'react'
import { connect } from 'react-redux'

import User, { SystemPermission } from 'src/api/user'
import { TeamPermission } from 'src/api/team'

import { IsLoading } from 'src/store/types'
import { State } from 'src/store/reducers'

import './index.css'

type Props = {
  user: {
    isLoading: IsLoading
    user: User
  }
  // User has to have one or more permissions to see hidden UI
  permissions?: SystemPermission | TeamPermission | (SystemPermission | TeamPermission)[]
}

const mapStateToProps = ({ user }: State) => {
  return {
    user,
  }
}

class LimitedUI extends React.Component<Props> {

  public render() {
    const { user: { user }, permissions = [] } = this.props

    // Render component only if user have proper permissions
    if (typeof permissions === 'string') {
      if (!user.allPermissions.has(permissions)) {
        return null
      }
    } else {
      let noAccess = permissions.some(p => {
        if (!user.allPermissions.has(p)) {
          return true
        }
        return false
      })
      if (noAccess) return null
    }

    return (
      <div className="limitedui">
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(LimitedUI)
