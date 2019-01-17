import * as React from 'react'

import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'
import { User } from 'src/api'

import Avatar from 'src/components/ui/Avatar'

type Props = {
  user: User
}

class UserInfo extends React.Component<Props> {

  public render() {
    const { user } = this.props

    return (
      <div className="usersList__info">
        <span className="usersList__avatar">
          <Avatar size="small" disableLink={true} user={user} />
        </span>
        <h2 className="userList__name">{decodeHtmlEntity(user.name)}</h2>
      </div>
    )
  }
}

export default UserInfo
