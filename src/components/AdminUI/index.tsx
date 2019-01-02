import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'

import { IsLoading, User } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  user: {
    isLoading: IsLoading
    user: User
  }
}

const mapStateToProps = ({ user }: State) => {
  return {
    user,
  }
}

class AdminUI extends React.Component<Props> {

  public render() {
    const { user } = this.props.user

    // TODO: search for isAdmin property
    if (!user.name) return null

    return (
      <div className="adminui">
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(AdminUI)
