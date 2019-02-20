import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'

import { User } from 'src/api'
import { IsLoading } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  user: {
    isLoading: IsLoading
    user: User
  }
  flag?: number | number[] // User has to have one or more flags to see hidden UI
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
    if (typeof flag === 'number') {
      if (!user.flags.includes(flag)) {
        return null
      }
    } else {
      let access = true
      flag.forEach(f => {
        if (!user.flags.includes(f)) {
          access = false
        }
      })
      if (!access) return null
    }

    return (
      <div className="limitedui">
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(LimitedUI)
