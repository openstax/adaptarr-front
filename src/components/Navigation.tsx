import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'
import { compose } from 'lodash/fp'
import { withNamespaces } from 'react-i18next'

import Header from './Header'
import NotificationComp from './Notification'
import Spinner from './Spinner'
import AdminUI from './AdminUI'
import Button from './ui/Button'
import Icon from './ui/Icon'

import { IsLoading, Notification } from '../store/types'
import { State } from '../store/reducers'

type Props = {
  t: any,
  i18n: any,
  notifications: {
    isLoading: IsLoading
    notifications: Notification[]
    error?: string
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
    const { t, i18n } = this.props;

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng)
    }

    const sidebarClasses = `sidebar frame ${this.state.toggleSidebar ? 'small': null}`
    const { isLoading, notifications } = this.props.notifications
    const unreadNotifications = this.getUnreadNotifications(notifications)
    
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
            <li className="nav__link" title={t('Navigation.dashboardLink')}>
              <NavLink exact to="/" activeClassName="active">
                <span className="nav__content">
                  <Icon name="dashboard" />
                  <span className="nav__text">{t('Navigation.dashboardLink')}</span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title={t('Navigation.notificationsLink')}>
              <NavLink to="/notifications" activeClassName="active">
                <span className="nav__content">
                  <Icon name="bell" />
                  <span className="nav__text">{t('Navigation.notificationsLink')}</span>
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
                            {t('Notifications.showAll')}
                          </Link>
                        </React.Fragment>
                      : <Spinner />
                    }
                  </div>
                : null
              }
            </li>
            <li className="nav__link" title={t('Navigation.booksLink')}>
              <NavLink to="/books" activeClassName="active">
                <span className="nav__content">
                  <Icon name="book" />
                  <span className="nav__text">{t('Navigation.booksLink')}</span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title={t('Navigation.resourcesLink')}>
              <NavLink to="/resources" activeClassName="active">
                <span className="nav__content">
                  <Icon name="info" />
                  <span className="nav__text">{t('Navigation.resourcesLink')}</span>
                </span>
              </NavLink>
            </li>
            <li className="nav__link" title={t('Navigation.settingsLink')}>
              <NavLink to="/settings" activeClassName="active">
                <span className="nav__content">
                  <Icon name="cog" />
                  <span className="nav__text">{t('Navigation.settingsLink')}</span>
                </span>
              </NavLink>
              <div className="nav__hoverbox">
                <Button clickHandler={() => changeLanguage('pl')}>
                  Change language to Polish
                </Button>
              </div>
            </li>
            <AdminUI>
              <li className="nav__link" title={t('Navigation.invitationsLink')}>
                <NavLink to="/invitations" activeClassName="active">
                  <span className="nav__content">
                    <Icon name="users" />
                    <span className="nav__text">{t('Navigation.invitationsLink')}</span>
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

export default compose(withNamespaces('translations'), connect(mapStateToProps))(Navigation)
