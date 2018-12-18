import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import axios from 'src/config/axios'
import dateDiff from 'src/helpers/dateDiff'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import NotificationComp from 'src/components/Notification'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { Notification, TeamMap, ModulesMap } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  notifications: {
    isLoading: boolean
    notifications: Notification[]
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
    details: Notification | null
  } = {
    showDetails: false,
    details: null,
  }

  private showDetails = (details: Notification) => {
    this.setState({ showDetails: true, details })
  }

  private closeDetails = () => {
    this.setState({ showDetails: false, details: null })
  }

  private markAsRead = (id: number) => {
    axios.put(`notifications/${id}`, {unread: false})
      .then((res) => {
        console.log(res.data)
      })
      .catch(e => {
        console.error(e.message)
      })
  }

  private notificationDetails = (details: Notification) => {
    const modulesMap = this.props.modules.modulesMap
    const mod = details.module ? modulesMap.get(details.module) : undefined

    let body
    if (details.module) {
      body = (
        <Link to={`modules/${mod ? mod.id : undefined }`}>
          <h2 className="details__title">
            {mod ? mod.title : 'Unknow module'}
          </h2>
        </Link>
      )
    }

    return (
      <div className="details">
        {body}
      </div>
    )
  }

  public render() {
    const { showDetails, details } = this.state
    const isLoading = this.props.notifications.isLoading
    const notifications = [...this.props.notifications.notifications].reverse()
    const teamMap = this.props.team.teamMap
    let detailsWho = details ? teamMap.get(details.who) : undefined

    return (
      <div className="container container--splitted">
        {
          !isLoading ?
            <React.Fragment>
              <Section>
                <Header i18nKey="Notifications.title" />
                <div className="section__content">
                  {
                    notifications.length > 0 ?
                      <ul className="notificationsList">
                        {
                          notifications.map((noti: Notification) => {
                            return (
                              <li key={noti.id} className="notificationsList__item">
                                <span onClick={() => this.showDetails(noti)}>
                                  <NotificationComp 
                                    notification={noti}
                                    disableLink={true}
                                    avatarSize="medium" />
                                </span>
                                <Button clickHandler={() => this.markAsRead(noti.id)}>
                                  Mark as read
                                </Button>
                              </li>
                            )
                          })
                        }
                      </ul>
                    :
                      <Trans i18nKey="NotificationsCentre.noNotiFound" />
                  }
                </div>
              </Section>
              <Section>
                {
                  showDetails ?
                    <React.Fragment>
                      <Header title={detailsWho && detailsWho.name ? detailsWho.name : 'Unknow user'}>
                        <span className="date">
                          { details ? dateDiff(details.timestamp) : null }
                        </span>
                        <Button size="small" clickHandler={this.closeDetails}>
                          <Icon name="close" />
                        </Button>
                      </Header>
                      <div className="section__content">
                        { details ? this.notificationDetails(details) : null }
                      </div>
                    </React.Fragment>
                  : null
                }
              </Section>
            </React.Fragment>
          : <Spinner />
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(NotificationsCentre)
