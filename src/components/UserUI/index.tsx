import * as React from 'react'
import { connect } from 'react-redux'

import { User } from 'src/api'
import { State } from 'src/store/reducers'

interface UserUIProps {
  userId: number | undefined | null
  user: {
    user: User
  }
  children: React.ReactNode
}

const mapStateToProps = ({ user }: State) => ({
  user,
})

const UserUI = ({ userId, user: { user }, children }: UserUIProps) => {
  if (!userId || user.id !== userId) return null

  return (
    <div className="userui">
      {children}
    </div>
  )
}

export default connect(mapStateToProps)(UserUI)
