import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'

import dateDiff from 'src/helpers/dateDiff'

import Avatar from './ui/Avatar'

import { Notification, TeamMap, ModulesMap, ModuleShortInfo, User } from 'src/store/types'
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
}

const mapStateToProps = ({ team, modules }: State) => {
  return {
    team,
    modules,
  }
}

const trimMessage = (message: string) => {
  const maxLength = 30

  if (message.length <= maxLength) return message

  return message.substring(0, 30) + '...'
}

class NotificationComp extends React.Component<Props> {

  private notificationAction = (noti: Notification, mod: ModuleShortInfo | undefined) => {
    if (noti.kind === 'comment') {
      return (
        <React.Fragment>
          <Trans i18nKey="Notifications.commentedAt" />{ " " }
          {
            mod ? 
              mod.title
            : 
              <Trans i18nKey="Notifications.undefinedModule" />
          }
        </React.Fragment>
      )
    } else if (noti.kind === 'assigned') {
      return (
        <React.Fragment>
          <Trans i18nKey="Notifications.assigned" />{ " " }
          {
            mod ? 
              mod.title
            : 
              <Trans i18nKey="Notifications.undefinedModule" />
          }
        </React.Fragment>
      )
    } else if (noti.kind === 'mention') { 
      return (
        <Trans i18nKey="Notifications.mentioned" />
      )
    }
  
    return <Trans i18nKey="Notifications.unknowAction" />
  }

  public render() {
    const { teamMap } = this.props.team
    const { modulesMap } = this.props.modules
    const noti = this.props.notification
    const who: User | undefined = teamMap.get(noti.who)
    const mod = noti.module ? modulesMap.get(noti.module) : undefined
    let linkToNotification: string
    if (noti.conversation) {
      linkToNotification = '/conversations/' + noti.conversation
    } else {
      linkToNotification = '/modules/' + noti.module
    }
    const avatarSize = this.props.avatarSize ? this.props.avatarSize : 'small'

    const body = (
      <div className="notification">
        <span className="notification__content">
          <span className="notification__who">
            <Avatar disableLink={true} size={avatarSize} user={who} />
          </span>
          <span className="notification__text">
            <div className="notification__action">
              <strong>
                { 
                  who ? who.name + " " : null
                } 
              </strong>
              { this.notificationAction(noti, mod) }
            </div>
            { 
              noti.message ? 
                <span className="notification__message">
                  {trimMessage(noti.message)}
                </span> 
              : null
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

export default connect(mapStateToProps)(NotificationComp)
