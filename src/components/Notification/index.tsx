import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Localized } from 'fluent-react/compat'

import { Notification, User, Module } from 'src/api'

import { UsersMap, ModulesMap, NotificationStatus } from 'src/store/types'
import { changeNotificationStatus, ChangeNotificationStatus } from 'src/store/actions/notifications'
import { State } from 'src/store/reducers'

import { decodeHtmlEntity } from 'src/helpers'

import DateDiff from 'src/components/DateDiff'
import Avatar from 'src/components/ui/Avatar'

import './index.css'

type Props = {
  users: UsersMap
  modules: ModulesMap
  notification: Notification
  avatarSize?: 'small' | 'medium' | 'big'
  disableLink?: boolean
  changeNotificationStatus: (noti: Notification, status: NotificationStatus) => any
}

const mapStateToProps = ({ user: { users }, modules: { modulesMap } }: State) => {
  return {
    users,
    modules: modulesMap,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeNotificationStatus: (noti: Notification, status: NotificationStatus) => dispatch(changeNotificationStatus(noti, status))
  }
}

const trimMessage = (message: string) => {
  const maxLength = 30

  if (message.length <= maxLength) return message

  return message.substring(0, 30) + '...'
}

class NotificationComp extends React.Component<Props> {
  private onNotificationClick = () => {
    // TODO: Fire this action only on unread notifications
    this.props.changeNotificationStatus(this.props.notification, 'read')
  }

  public render() {
    const { users, modules } = this.props
    const noti = this.props.notification
    const who: User | undefined = users.get(noti.who!)
    const mod = noti.module ? modules.get(noti.module) : undefined
    let linkToNotification: string
    // if (noti.conversation) {
    //   linkToNotification = '/conversations/' + noti.conversation
    // } else {
      linkToNotification = '/modules/' + noti.module
    // }
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
              >
              <div className="notification__action">
              </div>
            </Localized>
            {
              /*noti.message ?
                <span className="notification__message">
                  {trimMessage(noti.message)}
                </span>
              : null*/
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
