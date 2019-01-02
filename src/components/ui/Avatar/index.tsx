import './index.css'

import * as React from 'react'
import Tooltip from 'react-tooltip-lite'
import { Link } from 'react-router-dom'

import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'

import * as types from 'src/store/types'

type Props = {
  user: types.User | undefined
  disableLink?: boolean
  status?: 'unread' | 'online'
  size?: 'small' | 'medium' | 'big'
}

const avatar = (props: Props) => {
  const { user, disableLink, status, size } = props

  let mainClasses = ['avatar']
  let statusClasses = ['avatar__status']
  if (size) mainClasses.push(`avatar--${size}`)
  if (status) statusClasses.join(`avatar__status--${status}`)

  const title = user && user.name ? decodeHtmlEntity(user.name) : 'Unknow user'
  const linkToProfile = user ? '/users/' + user.id : '/settings'

  let avatarSrc = user && user.avatarSmall ? user.avatarSmall : '/images/unknow-user.png'
  if (size && size !== 'small' && user && user.avatar) {
    avatarSrc = user.avatar
  }

  const body = (
    <Tooltip content={title}>
      <div className="avatar__image">
        <span className={statusClasses.join(' ')}></span>
        <img src={avatarSrc} alt={title}/>
      </div>
    </Tooltip>
  )

  if (disableLink) {
    return (
      <div className={mainClasses.join(' ')}>
        {body}
      </div>
    )
  }

  return (
    <Link to={linkToProfile} className={mainClasses.join(' ')}>
      {body}
    </Link>
  )
}

export default avatar
