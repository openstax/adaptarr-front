import './index.css'

import * as React from 'react'
import Tooltip from 'react-tooltip-lite'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'
import * as api from 'src/api'

import * as types from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  user: api.User | number | undefined
  teamMap: types.TeamMap
  disableLink?: boolean
  status?: 'unread' | 'online'
  size?: 'small' | 'medium' | 'big'
}

const mapStateToProps = ({ team: { teamMap } }: State) => ({ teamMap })

const avatar = (props: Props) => {
  const { user, disableLink, status, size, teamMap } = props

  const userData = user instanceof api.User ? user : user && teamMap.get(user)

  let mainClasses = ['avatar']
  let statusClasses = ['avatar__status']
  if (size) mainClasses.push(`avatar--${size}`)
  if (status) statusClasses.join(`avatar__status--${status}`)

  const title = userData && userData.name ? decodeHtmlEntity(userData.name) : 'Unknow user'
  const linkToProfile = userData ? '/users/' + userData.id : '/settings'

  let avatarSrc = /*user && user.avatarSmall ? user.avatarSmall :*/ '/images/unknow-user.png'
  /*if (size && size !== 'small' && user && user.avatar) {
    avatarSrc = user.avatar
  }*/

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

export default connect(mapStateToProps)(avatar)
