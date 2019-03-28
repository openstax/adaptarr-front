import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'

import { User } from 'src/api'
import { IsLoading } from 'src/store/types'
import { State } from 'src/store/reducers'
import { Permission } from 'src/api/role'

type Props = {
  user: {
    isLoading: IsLoading
    user: User
  }
  flag?: Permission | Permission[] // User has to have one or more flags to see hidden UI
}

const mapStateToProps = ({ user }: State) => {
  return {
    user,
  }
}

class LimitedUI extends React.Component<Props> {

  public render() {
    const { user: { user }, flag = [] } = this.props

    // Render component only if user have proper flags
    if (typeof flag === 'string') {
      if (!user.permissions.includes(flag)) {
        return null
      }
    } else {
      let noAccess = flag.some(f => {
        if (!user.permissions.includes(f)) {
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
