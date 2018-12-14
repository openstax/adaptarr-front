import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'

import Avatar from './ui/Avatar'

import { Notification, TeamMap, ModulesMap, ModuleShortInfo, User } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  team: {
    teamMap: TeamMap
  }
  modulesMap: {
    modulesMap: ModulesMap
  }
  notification: Notification
}

const mapStateToProps = ({ team, modulesMap }: State) => {
  return {
    team,
    modulesMap,
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
          <Trans i18nKey="Notifications.commentedAt" />
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
          <Trans i18nKey="Notifications.assigned" />
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
    const { modulesMap } = this.props.modulesMap
    const noti = this.props.notification
    const user: User | undefined = teamMap.get(noti.who)
    const mod = noti.module ? modulesMap.get(noti.module) : undefined
    let linkToNotification: string
    if (noti.conversation) {
      linkToNotification = '/conversations/' + noti.conversation
    } else {
      linkToNotification = '/modules/' + noti.module
    }

    return (
      <Link to={linkToNotification}>
        <div className="notification">
          <span className="notification__content">
            <span className="notification__who">
              <Avatar disableLink={true} size="small" user={user} />
            </span>
            <span className="notification__text">
              <div className="notification__action">
                {this.notificationAction(noti, mod)}
              </div>
              { noti.message ? trimMessage(noti.message) : null }
            </span>
          </span>
        </div>
      </Link>
    )
  }
}

export default connect(mapStateToProps)(NotificationComp)
