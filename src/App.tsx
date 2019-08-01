import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { SecureRoute } from 'react-route-guard'
import { connect } from 'react-redux'

import * as api from 'src/api'

import Alerts from 'src/components/Alerts'
import Navigation from 'src/components/Navigation'
import Spinner from 'src/components/Spinner'
import ConfirmDialog from 'src/components/ConfirmDialog'

import Dashboard from 'src/screens/app/Dashboard'
import NotificationsCentre from 'src/screens/app/NotificationsCentre'
import Books from 'src/screens/app/Books'
import Book from 'src/screens/app/Book'
import Module from 'src/screens/app/Module'
import Draft from 'src/screens/app/Draft'
import DraftDetais from 'src/screens/app/DraftDetails'
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
import * as conversationsActions from 'src/store/actions/Conversations'
import * as booksActions from 'src/store/actions/Books'
import * as modulesActions from 'src/store/actions/Modules'
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
  fetchUser: () => void
  fetchRoles: () => void
  fetchProcesses: () => void
  fetchTeamMap: () => void
  fetchNotifications: () => void
  fetchConversationsMap: () => void
  fetchBooksMap: () => void
  fetchModulesMap: () => void
}

const mapStateToProps = ({
  user,
  notifications,
  team,
  booksMap,
  modules,
  app: {
    roles,
    processes,
  },
}: State) => {
  return {
    user,
    team,
    notifications,
    booksMap,
    modules,
    roles,
    processes,
  }
}

const mapDispatchToProps = (dispatch: userActions.FetchUser | notificationsActions.FetchNotifications | conversationsActions.FetchConversationsMap | booksActions.FetchBooksMap | modulesActions.FetchModulesMap) => {
  return {
    fetchUser: () => dispatch(userActions.fetchUser()),
    fetchRoles: () => dispatch(appActions.fetchRoles()),
    fetchProcesses: () => dispatch(appActions.fetchProcesses()),
    fetchTeamMap: () => dispatch(teamActions.fetchTeamMap()),
    fetchNotifications: () => dispatch(notificationsActions.fetchNotifications()),
    fetchConversationsMap: () => dispatch(conversationsActions.fetchConversationsMap()),
    fetchBooksMap: () => dispatch(booksActions.fetchBooksMap()),
    fetchModulesMap: () => dispatch(modulesActions.fetchModulesMap()),
  }
}

class App extends React.Component<Props> {
  private InvitationsGuard = {
    shouldRoute: () => {
      return this.props.user.user.permissions.has('user:invite')
    }
  }

  private RolesGuard = {
    shouldRoute: () => {
      return this.props.user.user.permissions.has('role:edit')
    }
  }

  private ProcessesGuard = {
    shouldRoute: () => {
      return this.props.user.user.permissions.has('editing-process:edit')
    }
  }

  componentDidMount () {
    this.props.fetchUser()
    this.props.fetchRoles()
    this.props.fetchProcesses()
    this.props.fetchTeamMap()
    this.props.fetchNotifications()
    this.props.fetchConversationsMap()
    this.props.fetchBooksMap()
    this.props.fetchModulesMap()

    const events = api.Events.create()
  }

  public render() {
    const { isLoading, user } = this.props.user

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
                  <Route exact path="/drafts/:id" component={DraftDetais}/>
                  <Route path="/drafts/:id/edit" component={Draft}/>
                  <Route exact path="/resources" component={Resources}/>
                  <Route path="/resources/:id" component={Resources}/>
                  <Route path="/users/:id" component={Profile}/>
                  <Route path="/settings" component={Settings}/>
                  <Route path="/helpdesk" component={Helpdesk}/>
                  <SecureRoute path="/invitations" component={Invitations} routeGuard={this.InvitationsGuard} redirectToPathWhenFail="/" />
                  <SecureRoute path="/roles" component={Roles} routeGuard={this.RolesGuard} redirectToPathWhenFail="/"/>
                  <SecureRoute path="/processes" component={Processes} routeGuard={this.ProcessesGuard} redirectToPathWhenFail="/"/>
                  <Route component={Error404}/>
                </Switch>
              </main>
              <Alerts />
              <ConfirmDialog />
            </div>
          : <Spinner />
        }
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
