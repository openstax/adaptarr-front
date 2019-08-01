import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { Link } from 'react-router-dom'

import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'
import * as api from 'src/api'

import DateDiff from 'src/components/DateDiff'
import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import NotificationComp from 'src/components/Notification'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { TeamMap, ModulesMap } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  notifications: {
    isLoading: boolean
    unreadNotifications: api.Notification[]
  }
  team: {
    teamMap: TeamMap
  },
  modules: {
    modulesMap: ModulesMap
  }
}

const mapStateToProps = ({ notifications, team, modules }: State) => {
  return {
    notifications,
    team,
    modules,
  }
}

class NotificationsCentre extends React.Component<Props> {
  state: {
    showDetails: boolean
    details: api.Notification | null
  } = {
    showDetails: false,
    details: null,
  }

  private showDetails = (details: api.Notification) => {
    this.setState({ showDetails: true, details })
  }

  private closeDetails = () => {
    this.setState({ showDetails: false, details: null })
  }

  private notificationDetails = (details: api.Notification) => {
    const modulesMap = this.props.modules.modulesMap
    const teamMap = this.props.team.teamMap
    const mod = details.module ? modulesMap.get(details.module) : undefined
    const who = details.who ? teamMap.get(details.who) : undefined

    return (
      <div className="details">
        <Localized
          id="notification"
          $actor={who && decodeHtmlEntity(who.name)}
          actor={
            <Link to={`/users/${who && who.id}`} />
          }
          $title={mod && mod.title}
          module={
            <Link to={`/modules/${mod && mod.id}`} />
          }
          />
      </div>
    )
  }

  public render() {
    const { showDetails, details } = this.state
    const isLoading = this.props.notifications.isLoading
    const unreadNotifications = [...this.props.notifications.unreadNotifications].reverse()
    const teamMap = this.props.team.teamMap
    let detailsWho = details && details.who ? teamMap.get(details.who) : undefined

    return (
      <div className="container">
        {
          !isLoading ?
            <Section>
              <Header l10nId="notification-centre-view-title" title="Notifications" />
              <div className="section__content">
                {
                  unreadNotifications.length > 0 ?
                    <ul className="notificationsList">
                      {
                        unreadNotifications.map((noti: api.Notification) => {
                          return (
                            <li
                              key={noti.id}
                              className="notificationsList__item"
                              onClick={() => this.showDetails(noti)}
                            >
                              <NotificationComp
                                notification={noti}
                                disableLink={true}
                                avatarSize="medium"
                              />
                            </li>
                          )
                        })
                      }
                    </ul>
                  : <Localized id="notification-centre-empty">
                    No notifications found.
                  </Localized>
                }
              </div>
            </Section>
          : <Spinner />
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(NotificationsCentre)
