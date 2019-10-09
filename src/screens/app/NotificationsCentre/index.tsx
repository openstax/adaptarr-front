import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Notification } from 'src/api'

import { State } from 'src/store/reducers'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import NotificationComp from 'src/components/Notification'

import './index.css'

type Props = {
  notifications: {
    isLoading: boolean
    unreadNotifications: Notification[]
  }
}

const mapStateToProps = ({ notifications }: State) => {
  return {
    notifications,
  }
}

class NotificationsCentre extends React.Component<Props> {
  public render() {
    const isLoading = this.props.notifications.isLoading
    const unreadNotifications = [...this.props.notifications.unreadNotifications].reverse()

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
                        unreadNotifications.map(noti => {
                          return (
                            <li
                              key={noti.id}
                              className="notificationsList__item"
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
