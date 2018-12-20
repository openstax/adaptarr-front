import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink, Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Trans } from 'react-i18next'

import Header from './Header'
import NotificationComp from './Notification'
import Spinner from './Spinner'
import AdminUI from './AdminUI'
import Button from './ui/Button'
import Icon from './ui/Icon'

import { IsLoading, Notification } from 'src/store/types'
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
            <li className="nav__link" title="Dashboard">
              <NavLink exact to="/" activeClassName="active">
                <span className="nav__content">
                  <Icon name="dashboard" />
                  <span className="nav__text">
                    <Trans i18nKey="Navigation.dashboardLink"/>
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title="Notifications">
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
            <li className="nav__link" title="Books">
              <NavLink 
                to="/books"
                activeClassName="active"
                isActive={(match, location) => isActive(location, ['books', 'modules'])}
              >
                <span className="nav__content">
                  <Icon name="book" />
                  <span className="nav__text">
                    <Trans i18nKey="Navigation.booksLink"/>
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title="Resources">
              <NavLink to="/resources" activeClassName="active">
                <span className="nav__content">
                  <Icon name="info" />
                  <span className="nav__text">
                    <Trans i18nKey="Navigation.resourcesLink"/>
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title="Settings">
              <NavLink to="/settings" activeClassName="active">
                <span className="nav__content">
                  <Icon name="cog" />
                  <span className="nav__text">
                    <Trans i18nKey="Navigation.settingsLink"/>
                  </span>
                </span>
              </NavLink>
            </li>
            <AdminUI>
              <li className="nav__link" title="Invitations">
                <NavLink to="/invitations" activeClassName="active">
                  <span className="nav__content">
                    <Icon name="users" />
                    <span className="nav__text">
                      <Trans i18nKey="Navigation.invitationsLink"/>
                    </span>
                  </span>
                </NavLink>
              </li>
            </AdminUI>
          </ul>
        </nav>
      </aside>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Navigation))
