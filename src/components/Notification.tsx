import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Avatar from './ui/Avatar'

import { Notification, TeamMap, ModulesMap, ModuleShortInfo, User } from '../store/types'
import { State } from '../store/reducers'

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

const notificationAction = (noti: Notification, mod: ModuleShortInfo | undefined) => {
  if (noti.kind === 'comment') {
    return `commented at ${ mod ? mod.title : 'Undefined module' }`
  } else if (noti.kind === 'assigned') {
    return `assigned you to ${ mod ? mod.title : 'Undefined module' }`
  } else if (noti.kind === 'mention') { 
    return `mentioned you in a conversation`
  }

  return 'Unknow action'
}

class NotificationComp extends React.Component<Props> {

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
                {notificationAction(noti, mod)}
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
