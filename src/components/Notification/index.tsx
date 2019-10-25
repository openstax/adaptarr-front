import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Localized } from 'fluent-react/compat'

import { Notification, User } from 'src/api'

import { ModulesMap, NotificationStatus, UsersMap } from 'src/store/types'
import { changeNotificationStatus } from 'src/store/actions/notifications'
import { State } from 'src/store/reducers'

import { decodeHtmlEntity } from 'src/helpers'

import DateDiff from 'src/components/DateDiff'
import Avatar from 'src/components/ui/Avatar'

import './index.css'

interface NotificationCompProps {
  users: UsersMap
  modules: ModulesMap
  notification: Notification
  avatarSize?: 'small' | 'medium' | 'big'
  disableLink?: boolean
  changeNotificationStatus: (noti: Notification, status: NotificationStatus) => any
}

const mapStateToProps = ({ user: { users }, modules: { modulesMap } }: State) => ({
  users,
  modules: modulesMap,
})

const mapDispatchToProps = (dispatch: any) => ({
  // eslint-disable-next-line arrow-body-style
  changeNotificationStatus: (noti: Notification, status: NotificationStatus) => {
    return dispatch(changeNotificationStatus(noti, status))
  },
})

class NotificationComp extends React.Component<NotificationCompProps> {
  private onNotificationClick = () => {
    // TODO: Fire this action only on unread notifications
    this.props.changeNotificationStatus(this.props.notification, 'read')
  }

  public render() {
    const { users, modules } = this.props
    const noti = this.props.notification
    const who: User | undefined = users.get(noti.who!)
    const author: string | undefined = noti.author ? users.get(noti.author!)!.name : undefined
    const mod = noti.module ? modules.get(noti.module) : undefined
    const linkToNotification = '/modules/' + noti.module
    const avatarSize = this.props.avatarSize ? this.props.avatarSize : 'small'

    const body = (
      <div className="notification" onClick={this.onNotificationClick}>
        <span className="notification__content">
          <span className="notification__who">
            <Avatar disableLink={true} size={avatarSize} user={who} />
          </span>
          <span className="notification__text">
            <Localized
              id="notification"
              $kind={noti.kind.replace('-', '_')}
              actor={<strong/>}
              $actor={who ? decodeHtmlEntity(who.name) : null}
              $module={mod && mod.title}
              $author={author}
            >
              <div className="notification__action" />
            </Localized>
            {
              // noti.message ?
              // <span className="notification__message">
              // {trimMessage(noti.message)}
              // </span>
              // : null
            }
            <span className="notification__date">
              <DateDiff dateString={noti.timestamp} />
            </span>
          </span>
        </span>
      </div>
    )

    return this.props.disableLink ?
      body
      :
      <Link to={linkToNotification} className="notification__link">
        {body}
      </Link>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationComp)
