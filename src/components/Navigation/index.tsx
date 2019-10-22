import * as React from 'react'
import { connect } from 'react-redux'
import { Link, match, NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { Localized } from 'fluent-react/compat'
import { Location } from 'history'

import { Notification } from 'src/api'

import { ROUTE_TEAMS_PERMISSIONS } from 'src/App'

import NotificationComp from 'src/components/Notification'
import Spinner from 'src/components/Spinner'
import LimitedUI from 'src/components/LimitedUI'
import TeamSwitcher from 'src/components/TeamSwitcher'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Tooltip from 'src/components/ui/Tooltip'

import { IsLoading } from 'src/store/types'
import { State } from 'src/store/reducers'

import './index.css'

interface NavigationProps {
  notifications: {
    isLoading: IsLoading
    unreadNotifications: Notification[]
    error?: string
  }
}

const mapStateToProps = ({ notifications }: State) => ({
  notifications,
})

const isActive = (location: any, pathnames: string[]): boolean => {
  const pathname = location.pathname
  return pathnames.some(el => pathname.match(el))
}

interface NavigationState {
  toggleSidebar: boolean,
}

class Navigation extends React.Component<RouteComponentProps & NavigationProps> {
  state: NavigationState = {
    toggleSidebar: localStorage.getItem('toggleSidebar') === 'true',
  }

  private toggleSidebar = () => {
    const currentVal = this.state.toggleSidebar
    this.setState({ toggleSidebar: !currentVal })
    localStorage.setItem('toggleSidebar', JSON.stringify(!currentVal))
  }

  // eslint-disable-next-line arrow-body-style
  private isActiveBooksOrModules = (_: match, location: Location) => {
    return isActive(location, ['books', 'modules'])
  }

  // eslint-disable-next-line arrow-body-style
  private isActiveUsersOrSettings = (_: match, location: Location) => {
    return isActive(location, ['users', 'settings'])
  }

  public render() {
    const { toggleSidebar } = this.state
    const sidebarClasses = `sidebar ${toggleSidebar ? 'small': null}`
    let { isLoading, unreadNotifications } = this.props.notifications
    unreadNotifications = [...unreadNotifications].reverse()

    return (
      <aside className={sidebarClasses}>
        <div className="menu-toggler">
          <Button
            className="sidebar__toggle"
            clickHandler={this.toggleSidebar}
          >
            <Icon name="menu" />
            <Localized id="navigation-title">
              Menu
            </Localized>
          </Button>
        </div>
        <TeamSwitcher />
        <nav className="nav">
          <ul>
            <li className="nav__link">
              <Tooltip l10nId="navigation-dashboard" direction="right" isDisabled={!toggleSidebar}>
                <NavLink exact to="/" activeClassName="active">
                  <span className="nav__content">
                    <Icon size="medium" name="dashboard" />
                    <span className="nav__text">
                      <Localized id="navigation-dashboard">
                        Dashboard
                      </Localized>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
            </li>
            <li className="nav__link">
              <Tooltip l10nId="navigation-notifications" isDisabled={!toggleSidebar}>
                <NavLink to="/notifications" activeClassName="active">
                  <span className="nav__content">
                    <Icon size="medium" name="bell" />
                    <span className="nav__text">
                      <Localized id="navigation-notifications">
                        Notifications
                      </Localized>
                    </span>
                  </span>
                  {
                    unreadNotifications.length ?
                      <span className="notifications__counter">
                        <span>{unreadNotifications.length}</span>
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
                        <>
                          {
                            unreadNotifications.map((noti: Notification, index: number) => {
                              if (index > 2) return null
                              return <NotificationComp key={noti.kind + index} notification={noti}/>
                            })
                          }
                          <Link to="/notifications" className="nav__link show-more">
                            <Localized id="navigation-notifications-show-all">
                              Show all
                            </Localized>
                          </Link>
                        </>
                        : <Spinner />
                    }
                  </div>
                  : null
              }
            </li>
            <li className="nav__link">
              <Tooltip l10nId="navigation-books" direction="right" isDisabled={!toggleSidebar}>
                <NavLink
                  to="/books"
                  activeClassName="active"
                  isActive={this.isActiveBooksOrModules}
                >
                  <span className="nav__content">
                    <Icon size="medium" name="books" />
                    <span className="nav__text">
                      <Localized id="navigation-books">
                        Books
                      </Localized>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
            </li>
            <li className="nav__link">
              <Tooltip l10nId="navigation-resources" direction="right" isDisabled={!toggleSidebar}>
                <NavLink to="/resources" activeClassName="active">
                  <span className="nav__content">
                    <Icon size="medium" name="resources" />
                    <span className="nav__text">
                      <Localized id="navigation-resources">
                        Resources
                      </Localized>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
            </li>
            <li className="nav__link">
              <Tooltip l10nId="navigation-profile" isDisabled={!toggleSidebar}>
                <NavLink
                  to="/users/me"
                  activeClassName="active"
                  isActive={this.isActiveUsersOrSettings}
                >
                  <span className="nav__content">
                    <Icon size="medium" name="user"/>
                    <span className="nav__text">
                      <Localized id="navigation-profile">
                        Your profile
                      </Localized>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
              <div className="nav__hoverbox">
                <NavLink to="/users/me" activeClassName="active" className="nav__link">
                  <Localized id="navigation-profile">
                    Your profile
                  </Localized>
                </NavLink>
                <NavLink to="/settings" activeClassName="active" className="nav__link">
                  <Localized id="navigation-settings">
                    Settings
                  </Localized>
                </NavLink>
                <a
                  className="nav__link"
                  href="/logout"
                >
                  <Localized id="navigation-logout">
                    Logout
                  </Localized>
                </a>
              </div>
            </li>
            <li className="nav__link">
              <Tooltip l10nId="navigation-helpdesk" isDisabled={!toggleSidebar}>
                <NavLink to="/helpdesk" activeClassName="active">
                  <span className="nav__content">
                    <Icon size="medium" name="help" />
                    <span className="nav__text">
                      <Localized id="navigation-helpdesk">
                        Helpdesk
                      </Localized>
                    </span>
                  </span>
                </NavLink>
              </Tooltip>
            </li>
            <LimitedUI permissions="member:add">
              <li className="nav__link">
                <Tooltip l10nId="navigation-invite" direction="right" isDisabled={!toggleSidebar}>
                  <NavLink to="/invitations" activeClassName="active">
                    <span className="nav__content">
                      <Icon size="medium" name="user-plus" />
                      <span className="nav__text">
                        <Localized id="navigation-invite">
                          Invitations
                        </Localized>
                      </span>
                    </span>
                  </NavLink>
                </Tooltip>
              </li>
            </LimitedUI>
            <LimitedUI onePermissionFrom={ROUTE_TEAMS_PERMISSIONS}>
              <li className="nav__link">
                <Tooltip l10nId="navigation-teams" direction="right" isDisabled={!toggleSidebar}>
                  <NavLink to="/teams" activeClassName="active">
                    <span className="nav__content">
                      <Icon size="medium" name="users" />
                      <span className="nav__text">
                        <Localized id="navigation-teams">
                          Manage teams
                        </Localized>
                      </span>
                    </span>
                  </NavLink>
                </Tooltip>
              </li>
            </LimitedUI>
            <LimitedUI permissions="editing-process:edit">
              <li className="nav__link">
                <Tooltip
                  l10nId="navigation-processes"
                  direction="right"
                  isDisabled={!toggleSidebar}
                >
                  <NavLink to="/processes" activeClassName="active">
                    <span className="nav__content">
                      <Icon size="medium" name="paper-pen" />
                      <span className="nav__text">
                        <Localized id="navigation-processes">
                          Editing processes
                        </Localized>
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
