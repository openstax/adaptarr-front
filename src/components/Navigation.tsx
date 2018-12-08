import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'

import Header from './Header'
import NotificationComp from './Notification'
import Button from './ui/Button'
import Icon from './ui/Icon'

import { Notification, Notifications } from '../store/types'
import { State } from '../store/reducers'

type Props = {
  notifications: {
    notifications: Notifications
  }
}

const mapStateToProps = ({ notifications }: State) => {
  return {
    notifications,
  }
}

class Navigation extends React.Component<Props> {

  state: {
    toggleSidebar: boolean,
  } = {
    toggleSidebar: false,
  }

  private toggleSidebar = () => {
    this.setState({toggleSidebar: !this.state.toggleSidebar})
  }

  private getUnreadNotifications = (arr: Notification[]): Notification[] => {
    const unred: Notification[] = arr.filter((noti: Notification) => {
      return noti.status === 'unread' ? noti : false
    })

    return unred
  }

  public render() {
    const sidebarClasses = `sidebar frame ${this.state.toggleSidebar ? 'small': null}`
    const { notifications } = this.props.notifications.notifications
    const unreadNotifications = this.getUnreadNotifications(notifications)
    
    return (
      <aside className={sidebarClasses}>
        <Header title={"Menu"}>
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
                  <span className="nav__text">Dashboard</span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title="Notifications">
              <NavLink to="/notifications" activeClassName="active">
                <span className="nav__content">
                  <Icon name="bell" />
                  <span className="nav__text">Notifications</span>
                </span>
                {
                  unreadNotifications.length > 0 ?
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
                      unreadNotifications.map((noti: Notification, index: number) => {
                        if (index > 2) return
                        return (
                          <NotificationComp key={noti.kind + index} notification={noti}/>
                        )
                      })
                    }
                    <Link to="/notifications" className="show-more">
                      Show all
                    </Link>
                  </div>
                : null
              }
            </li>
            <li className="nav__link" title="Books">
              <NavLink to="/books" activeClassName="active">
                <span className="nav__content">
                  <Icon name="book" />
                  <span className="nav__text">Books</span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title="Resources">
              <NavLink to="/resources" activeClassName="active">
                <span className="nav__content">
                  <Icon name="info" />
                  <span className="nav__text">Resources</span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title="Settings">
              <NavLink to="/settings" activeClassName="active">
                <span className="nav__content">
                  <Icon name="cog" />
                  <span className="nav__text">Settings</span>
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    )
  }
}

export default connect(mapStateToProps)(Navigation)
