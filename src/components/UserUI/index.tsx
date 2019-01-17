import * as React from 'react'
import { connect } from 'react-redux'

import { User } from 'src/api'
import { State } from 'src/store/reducers'

type Props = {
  userId: number | undefined | null
  user: {
    user: User
  }
}

const mapStateToProps = ({ user }: State) => {
  return {
    user,
  }
}

class UserUI extends React.Component<Props> {

  public render() {
    const userId = this.props.userId
    const user = this.props.user.user

    if (!userId || user.id !== userId) return null

    return (
      <div className="userui">
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(UserUI)
