import * as React from 'react'
import { connect } from 'react-redux'

import { State } from 'src/store/reducers'
import { UsersMap } from 'src/store/types'

import { leb128 } from '../Message'

import './index.css'

interface MentionProps {
  userId?: number
  data?: Uint8Array
  users: UsersMap
}

const mapStateToProps = ({ user: { users } }: State) => ({
  users,
})

class Mention extends React.Component<MentionProps> {
  public render() {
    if (!this.props.userId && !this.props.data) {
      console.error('Mention component require userId or data prop.')
      return 'Unknown user'
    }

    const userId = this.props.userId ? this.props.userId : leb128(this.props.data!)[0]
    const user = this.props.users.get(userId)
    const href = `/users/${userId}`

    return <a className="mention" href={href} target="_blank" rel="noopener noreferrer">
      @{user ? user.name : 'Unknown user'}
    </a>
  }
}

export default connect(mapStateToProps)(Mention)
