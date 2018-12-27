import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import dateDiff from 'src/helpers/dateDiff'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import NotificationComp from 'src/components/Notification'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import Conversation from 'src/containers/Conversation'

import { Notification, TeamMap, ModulesMap } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  notifications: {
    isLoading: boolean
    unreadNotifications: Notification[]
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

  private notificationDetails = (details: Notification) => {
    const modulesMap = this.props.modules.modulesMap
    const teamMap = this.props.team.teamMap
    const mod = details.module ? modulesMap.get(details.module) : undefined
    const who = details.who ? teamMap.get(details.who) : undefined

    let body
    if (details.kind === 'assigned') {
      body = (
        <React.Fragment>
          <Link to={`/users/${who ? who.id : undefined}`}>
            {who ? who.name : 'Unknow user'}
          </Link>{" "}
          <Trans i18nKey="Notifications.assigned"/>{" "}
          <Link to={`/modules/${mod ? mod.id : undefined }`}>
            {mod ? mod.title : 'Unknow module'}
          </Link>
        </React.Fragment>
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
    const unreadNotifications = [...this.props.notifications.unreadNotifications].reverse()
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
                    unreadNotifications.length > 0 ?
                      <ul className="notificationsList">
                        {
                          unreadNotifications.map((noti: Notification) => {
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
                  :
                    <React.Fragment>
                      <Header title="Jason Cook">
                        <span className="date">
                          { new Date().toISOString().split('T')[0] }
                        </span>
                      </Header>
                      <div className="section__content">
                        <Conversation/>
                      </div>
                    </React.Fragment>
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
