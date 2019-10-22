import * as React from 'react'
import Tooltip from 'react-tooltip-lite'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as api from 'src/api'

import { UsersMap } from 'src/store/types'
import { State } from 'src/store/reducers'

import { decodeHtmlEntity } from 'src/helpers'

import './index.css'

interface AvatarProps {
  user: api.User | number | undefined
  users: UsersMap
  disableLink?: boolean
  status?: 'unread' | 'online'
  size?: 'small' | 'medium' | 'big'
  withName?: boolean
}

const mapStateToProps = ({ user: { users } }: State) => ({ users })

const Avatar = (props: AvatarProps) => {
  const { user, disableLink, status, size, users, withName } = props

  const userData = user instanceof api.User ? user : user && users.get(user)

  const mainClasses = ['avatar']
  const statusClasses = ['avatar__status']
  if (size) mainClasses.push(`avatar--${size}`)
  if (status) statusClasses.join(`avatar__status--${status}`)

  const title = userData && userData.name ? decodeHtmlEntity(userData.name) : 'Unknow user'
  const linkToProfile = userData ? '/users/' + userData.id : '/settings'

  const avatarSrc = /* user && user.avatarSmall ? user.avatarSmall :*/ '/images/unknown-user.svg'
  // if (size && size !== 'small' && user && user.avatar) {
  // avatarSrc = user.avatar
  // }

  const body = (
    <>
      <Tooltip content={title}>
        <div className="avatar__image">
          <span className={statusClasses.join(' ')} />
          <img src={avatarSrc} alt={title}/>
        </div>
      </Tooltip>
      {
        withName ?
          <span className="avatar__name">{title}</span>
          : null
      }
    </>
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

export default connect(mapStateToProps)(Avatar)
