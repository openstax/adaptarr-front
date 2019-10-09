import * as React from 'react'

import { User } from 'src/api'

import { decodeHtmlEntity } from 'src/helpers'

import Avatar from 'src/components/ui/Avatar'

type UserInfoProps = {
  user: User
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="usersList__info">
      <span className="usersList__avatar">
        <Avatar size="small" disableLink={true} user={user} />
      </span>
      <h2 className="userList__name">
        {decodeHtmlEntity(user.name)}
      </h2>

    </div>
  )
}

export default UserInfo
