import * as React from 'react'
import  { Localized } from 'fluent-react/compat'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import * as api from 'src/api'

import Navigation from 'src/components/Navigation'
import Spinner from 'src/components/Spinner'
import Notification from 'src/components/Notification'
import Icon from 'src/components/ui/Icon'

import Dashboard from 'src/screens/app/Dashboard'
import NotificationsCentre from 'src/screens/app/NotificationsCentre'
import Books from 'src/screens/app/Books'
import Book from 'src/screens/app/Book'
import Module from 'src/screens/app/Module'
import Draft from 'src/screens/app/Draft'
import Resources from 'src/screens/app/Resources'
import Profile from 'src/screens/app/Profile'
import Settings from 'src/screens/app/Settings'
import Helpdesk from 'src/screens/app/Helpdesk'
import Invitations from 'src/screens/app/Invitations'
import Roles from 'src/screens/app/Roles'
import Processes from 'src/screens/app/Processes'
import Error404 from 'src/screens/app/Error404'

import * as userActions from 'src/store/actions/User'
import * as appActions from 'src/store/actions/app'
import * as teamActions from 'src/store/actions/Team'
import * as notificationsActions from 'src/store/actions/Notifications'
import * as booksActions from 'src/store/actions/Books'
import * as modulesActions from 'src/store/actions/Modules'
import * as alertsActions from 'src/store/actions/Alerts'
import * as types from 'src/store/types'
import { State } from 'src/store/reducers/index'

import 'src/assets/styles/shared.css'

type Props = {
  user: {
    isLoading: types.IsLoading
    user: api.User
  }
  team: {
    teamMap: types.TeamMap
  }
  notifications: {}
  booksMap: {
    booksMap: types.BooksMap
  }
  modules: {
    modulesMap: types.ModulesMap
  }
  alerts: {
    alerts: types.Alert[]
  }
  fetchUser: () => void
  fetchRoles: () => void
  fetchProcesses: () => void
  fetchTeamMap: () => void
  fetchNotifications: () => void
  fetchBooksMap: () => void
  fetchModulesMap: () => void
  removeAlert: (alert: types.Alert) => void
}

export const mapStateToProps = ({ user, notifications, team, booksMap, modules, alerts, app: { roles, processes } }: State) => {
  return {
    user,
    team,
    notifications,
    booksMap,
    modules,
    alerts,
    roles,
    processes,
  }
}

export const mapDispatchToProps = (dispatch: userActions.FetchUser | notificationsActions.FetchNotifications | booksActions.FetchBooksMap | modulesActions.FetchModulesMap | alertsActions.AddAlert) => {
  return {
    fetchUser: () => dispatch(userActions.fetchUser()),
    fetchRoles: () => dispatch(appActions.fetchRoles()),
    fetchProcesses: () => dispatch(appActions.fetchProcesses()),
    fetchTeamMap: () => dispatch(teamActions.fetchTeamMap()),
    fetchNotifications: () => dispatch(notificationsActions.fetchNotifications()),
    fetchBooksMap: () => dispatch(booksActions.fetchBooksMap()),
    fetchModulesMap: () => dispatch(modulesActions.fetchModulesMap()),
    removeAlert: (alert: types.Alert) => dispatch(alertsActions.removeAlert(alert))
  }
}

class App extends React.Component<Props> {

  componentDidMount () {
    this.props.fetchUser()
    this.props.fetchRoles()
    this.props.fetchProcesses()
    this.props.fetchTeamMap()
    this.props.fetchNotifications()
    this.props.fetchBooksMap()
    this.props.fetchModulesMap()

    const events = api.Events.create()
  }

  public render() {
    const { isLoading, user } = this.props.user
    const { alerts } = this.props.alerts

    return (
      <Router>
        {
          !isLoading && user.id ?
            <div className="container container--main">
              <Navigation />
              <main>
                <Switch>
                  <Route exact path="/" component={Dashboard}/>
                  <Route path="/notifications" component={NotificationsCentre}/>
                  <Route exact path="/books" component={Books}/>
                  <Route path="/books/:id" component={Book}/>
                  <Route path="/modules/:id" component={Module}/>
                  <Route path="/drafts/:id" component={Draft}/>
                  <Route exact path="/resources" component={Resources}/>
                  <Route path="/resources/:id" component={Resources}/>
                  <Route path="/users/:id" component={Profile}/>
                  <Route path="/settings" component={Settings}/>
                  <Route path="/helpdesk" component={Helpdesk}/>
                  <Route path="/invitations" component={Invitations}/>
                  <Route path="/roles" component={Roles}/>
                  <Route path="/processes" component={Processes}/>
                  <Route component={Error404}/>
                </Switch>
              </main>
              <div className="alerts">
                {
                  alerts.length > 0 ?
                    <ul className="alerts__list">
                      {
                        alerts.map((alert: types.Alert) => {

                          switch(alert.kind) {
                            case 'alert':
                              return (
                                <li
                                  key={alert.id}
                                  className={`alerts__alert alert--${alert.data.kind}`}
                                  onClick={() => this.props.removeAlert(alert)}
                                >
                                  <Localized id={alert.data.message} {...alert.data.arguments}>
                                    Unknow alert
                                  </Localized>
                                </li>
                              )
                            case 'notification':
                              return (
                                <li
                                  key={alert.id}
                                  className="alerts__alert alert--notification"
                                  onClick={() => this.props.removeAlert(alert)}
                                >
                                  <Notification
                                    notification={alert.data}
                                  />
                                </li>
                              )
                          }
                        })
                      }
                    </ul>
                  : null
                }
              </div>
            </div>
          : <Spinner />
        }
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
