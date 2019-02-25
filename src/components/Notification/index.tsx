import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import i18n from 'src/i18n'
import dateDiff from 'src/helpers/dateDiff'
import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'
import { Notification, User, Module } from 'src/api'

import Avatar from 'src/components/ui/Avatar'

import { TeamMap, ModulesMap, NotificationStatus } from 'src/store/types'
import { changeNotificationStatus, ChangeNotificationStatus } from 'src/store/actions/Notifications'
import { State } from 'src/store/reducers'

type Props = {
  team: {
    teamMap: TeamMap
  }
  modules: {
    modulesMap: ModulesMap
  }
  notification: Notification
  avatarSize?: 'small' | 'medium' | 'big'
  disableLink?: boolean
  changeNotificationStatus: (noti: Notification, status: NotificationStatus) => any
}

const mapStateToProps = ({ team, modules }: State) => {
  return {
    team,
    modules,
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

  private notificationAction = (noti: Notification, mod: Module | undefined) => {
    switch (noti.kind) {
      /*case 'comment':
        return i18n.t("Notifications.commentedAt", {
          title: mod ? mod.title : i18n.t("Notifications.undefinedModule")
        })*/
      case 'assigned':
        return i18n.t("Notifications.assigned", {
          title: mod ? mod.title : i18n.t("Notifications.undefinedModule")
        })
      /*case 'mention':
        return i18n.t("Notifications.mentioned")*/
      default:
        return i18n.t("Notifications.unknowAction")
    }
  }

  private onNotificationClick = () => {
    // TODO: Fire this action only on unread notifications
    this.props.changeNotificationStatus(this.props.notification, 'read')
  }

  public render() {
    const { teamMap } = this.props.team
    const { modulesMap } = this.props.modules
    const noti = this.props.notification
    const who: User | undefined = teamMap.get(noti.who!)
    const mod = noti.module ? modulesMap.get(noti.module) : undefined
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
            <div className="notification__action">
              <strong>
                { 
                  who ? decodeHtmlEntity(who.name) + " " : null
                } 
              </strong>
              { this.notificationAction(noti, mod) }
            </div>
            {
              /*noti.message ?
                <span className="notification__message">
                  {trimMessage(noti.message)}
                </span>
              : null*/
             }
            <span className="notification__date">
              { dateDiff(noti.timestamp) }
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
