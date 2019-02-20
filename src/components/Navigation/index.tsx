import './index.css'

import * as React from 'react'
import Tooltip from 'react-tooltip-lite'
import { connect } from 'react-redux'
import { NavLink, Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Trans } from 'react-i18next'

import i18n from 'src/i18n'
import { Notification } from 'src/api'

import Header from 'src/components/Header'
import NotificationComp from 'src/components/Notification'
import Spinner from 'src/components/Spinner'
import LimitedUI from 'src/components/LimitedUI'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { IsLoading } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  notifications: {
    isLoading: IsLoading
    unreadNotifications: Notification[]
    error?: string
  }
}

const mapStateToProps = ({ notifications }: State) => {
  return {
    notifications,
  }
}

const isActive = (location: any, pathnames: string[]): boolean => {
  const pathname = location.pathname
  return pathnames.some(el => pathname.match(el))
}

class Navigation extends React.Component<RouteComponentProps & Props> {

  state: {
    toggleSidebar: boolean,
  } = {
    toggleSidebar: false,
  }

  private toggleSidebar = () => {
    const currentVal = this.state.toggleSidebar
    this.setState({toggleSidebar: !currentVal})
    localStorage.setItem('toggleSidebar', JSON.stringify(!currentVal))
  }

  componentDidMount = () => {
    const toggleSidebar = localStorage.getItem('toggleSidebar') 
    if (toggleSidebar) {
      this.setState({ toggleSidebar: JSON.parse(toggleSidebar) })
    }
  }

  public render() {
    const sidebarClasses = `sidebar frame ${this.state.toggleSidebar ? 'small': null}`
    let { isLoading, unreadNotifications } = this.props.notifications
    unreadNotifications = [...unreadNotifications].reverse()
    
    return (
      <aside className={sidebarClasses}>
        <Header i18nKey="Navigation.title">
          <Button 
            className="sidebar__toggle" 
            clickHandler={this.toggleSidebar}>
            <Icon name={'menu'} />
          </Button>
        </Header>
        <nav className="nav">
          <ul>
            <li className="nav__link">
              <Tooltip content={i18n.t("Navigation.dashboardLink")} direction="right">
                <NavLink exact to="/" activeClassName="active">
                  <span className="nav__content">
                    <Icon name="dashboard" />
                    <span className="nav__text">
                      <Trans i18nKey="Navigation.dashboardLink"/>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
            </li>
            <li className="nav__link">
              <Tooltip content={i18n.t("Navigation.notificationsLink")}>
                <NavLink to="/notifications" activeClassName="active">
                  <span className="nav__content">
                    <Icon name="bell" />
                    <span className="nav__text">
                      <Trans i18nKey="Navigation.notificationsLink"/>
                    </span>
                  </span>
                  {
                    unreadNotifications.length ?
                      <span className="notifications__counter">
                        {unreadNotifications.length}
                      </span>
                    : null
                  }
                </NavLink>
              </Tooltip>
              {
                unreadNotifications.length > 0 ?
                  <div className="nav__hoverbox">
                    {
                      !isLoading ?
                        <React.Fragment>
                          {
                            unreadNotifications.map((noti: Notification, index: number) => {
                              if (index > 2) return
                              return (
                                <NotificationComp key={noti.kind + index} notification={noti}/>
                              )
                            })
                          }
                          <Link to="/notifications" className="show-more">
                            <Trans i18nKey="Notifications.showAll"/>
                          </Link>
                        </React.Fragment>
                      : <Spinner />
                    }
                  </div>
                : null
              }
            </li>
            <li className="nav__link">
              <Tooltip content={i18n.t("Navigation.booksLink")} direction="right">
                <NavLink 
                  to="/books"
                  activeClassName="active"
                  isActive={(_, location) => isActive(location, ['books', 'modules'])}
                >
                  <span className="nav__content">
                    <Icon name="book" />
                    <span className="nav__text">
                      <Trans i18nKey="Navigation.booksLink"/>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
            </li>
            <li className="nav__link">
              <Tooltip content={i18n.t("Navigation.resourcesLink")} direction="right">
                <NavLink to="/resources" activeClassName="active">
                  <span className="nav__content">
                    <Icon name="info" />
                    <span className="nav__text">
                      <Trans i18nKey="Navigation.resourcesLink"/>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
            </li>
            <li className="nav__link">
              <Tooltip content={i18n.t("Navigation.yourProfileLink")}>
                <NavLink
                  to="/users/me"
                  activeClassName="active"
                  isActive={(_, location) => isActive(location, ['users', 'settings'])}
                >
                  <span className="nav__content">
                    <Icon name="profile"/>
                    <span className="nav__text">
                      <Trans i18nKey="Navigation.yourProfileLink"/>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
              <div className="nav__hoverbox">
                <NavLink to="/users/me" activeClassName="active" className="nav__link">
                  <Trans i18nKey="Navigation.yourProfileLink"/>
                </NavLink>
                <NavLink to="/settings" activeClassName="active" className="nav__link">
                  <Trans i18nKey="Navigation.settingsLink"/>
                </NavLink>
                <a 
                  className="nav__link"
                  href="/logout"
                >
                  <Trans i18nKey="Navigation.logoutLink"/>
                </a>
              </div>
            </li>
            <LimitedUI>
              <li className="nav__link">
                <Tooltip content={i18n.t("Navigation.invitationsLink")} direction="right">
                  <NavLink to="/invitations" activeClassName="active">
                    <span className="nav__content">
                      <Icon name="users" />
                      <span className="nav__text">
                        <Trans i18nKey="Navigation.invitationsLink"/>
                      </span>
                    </span>
                  </NavLink>
                </Tooltip>
              </li>
            </LimitedUI>
          </ul>
        </nav>
      </aside>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Navigation))
