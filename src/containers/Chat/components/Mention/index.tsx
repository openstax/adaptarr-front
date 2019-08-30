import * as React from 'react'
import { connect } from 'react-redux'

import User from 'src/api/user'
import { State } from 'src/store/reducers'

import { leb128 } from '../Message'

import './index.css'

type Props = {
  userId?: number
  data?: Uint8Array
  teamMap: Map<number, User>
}

const mapStateToProps = ({ team: { teamMap } }: State) => {
  return {
    teamMap,
  }
}

class Mention extends React.Component<Props> {
  public render() {
    if (!this.props.userId && !this.props.data) {
      console.error('Mention component require userId or data prop.')
      return 'Unknown user'
    }

    const userId = this.props.userId ? this.props.userId : leb128(this.props.data!)[0]
    const user = this.props.teamMap.get(userId)
    const href = `/users/${userId}`

    return <a className="mention" href={href} target="_blank">
      @{user ? user.name : 'Unknown user'}
    </a>
  }
}

export default connect(mapStateToProps)(Mention)
