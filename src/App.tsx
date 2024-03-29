import * as React from 'react'
import { Redirect, Route, RouteProps, BrowserRouter as Router, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import * as api from 'src/api'
import { TeamPermission } from 'src/api/team'

import Alerts from 'src/components/Alerts'
import Navigation from 'src/components/Navigation'
import Spinner from 'src/components/Spinner'
import ConfirmDialog from 'src/components/ConfirmDialog'

import Dashboard from 'src/screens/app/Dashboard'
import NotificationsCentre from 'src/screens/app/NotificationsCentre'
import Books from 'src/screens/app/Books'
import Book from 'src/screens/app/Book'
import Module from 'src/screens/app/Module'
import ModuleLabels from 'src/screens/app/ModuleLabels'
import Draft from 'src/screens/app/Draft'
import DraftDetais from 'src/screens/app/DraftDetails'
import Resources from 'src/screens/app/Resources'
import Profile from 'src/screens/app/Profile'
import Settings from 'src/screens/app/Settings'
import Helpdesk from 'src/screens/app/Helpdesk'
import Invitations from 'src/screens/app/Invitations'
import Processes from 'src/screens/app/Processes'
import Error404 from 'src/screens/app/Error404'
import Teams from 'src/screens/app/Teams'

import * as userActions from 'src/store/actions/user'
import * as appActions from 'src/store/actions/app'
import * as notificationsActions from 'src/store/actions/notifications'
import * as conversationsActions from 'src/store/actions/conversations'
import * as booksActions from 'src/store/actions/books'
import * as modulesActions from 'src/store/actions/modules'
import * as types from 'src/store/types'
import { State } from 'src/store/reducers/index'

import 'src/assets/styles/shared.css'

interface AppProps {
  user: {
    isLoading: types.IsLoading
    user: api.User
    users: types.UsersMap
  }
  fetchUser: () => void
  fetchUsers: () => void
  fetchProcesses: () => void
  fetchTeams: () => void
  fetchNotifications: () => void
  fetchConversationsMap: () => void
  fetchBooksMap: () => void
  fetchModulesMap: () => void
}

const mapStateToProps = ({ user }: State) => ({
  user,
})

const mapDispatchToProps = (
  dispatch:
    userActions.FetchUser |
    notificationsActions.FetchNotifications |
    conversationsActions.FetchConversationsMap |
    booksActions.FetchBooksMap |
    modulesActions.FetchModulesMap
) => ({
  fetchUser: () => dispatch(userActions.fetchUser()),
  fetchUsers: () => dispatch(userActions.fetchUsersMap()),
  fetchProcesses: () => dispatch(appActions.fetchProcesses()),
  fetchTeams: () => dispatch(appActions.fetchTeams()),
  fetchNotifications: () => dispatch(notificationsActions.fetchNotifications()),
  fetchConversationsMap: () => dispatch(conversationsActions.fetchConversationsMap()),
  fetchBooksMap: () => dispatch(booksActions.fetchBooksMap()),
  fetchModulesMap: () => dispatch(modulesActions.fetchModulesMap()),
})

/**
 * One of those permissions is required to go to the /teams route since in this screen
 * user can add, remove and manage users in teams.
 */
export const ROUTE_TEAMS_PERMISSIONS: TeamPermission[] = [
  'member:add',
  'member:assign-role',
  'member:edit-permissions',
  'member:remove',
]

class App extends React.Component<AppProps> {
  private InvitationsGuard = async () => {
    const user = this.props.user.user
    const isSuper = await user.isInSuperMode()
    return isSuper || user.allPermissions.has('member:add')
  }

  private TeamsGuard = async () => {
    const user = this.props.user.user
    const isSuper = await user.isInSuperMode()
    return isSuper || ROUTE_TEAMS_PERMISSIONS.some(p => user.allPermissions.has(p))
  }

  private ProcessesGuard = async () => {
    const user = this.props.user.user
    const isSuper = await user.isInSuperMode()
    return isSuper || user.allPermissions.has('editing-process:edit')
  }

  componentDidMount() {
    this.props.fetchUser()
    this.props.fetchUsers()
    this.props.fetchProcesses()
    this.props.fetchTeams()
    this.props.fetchNotifications()
    this.props.fetchConversationsMap()
    this.props.fetchBooksMap()
    this.props.fetchModulesMap()

    api.Events.create()
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
                  <Route path="/modules/labels" component={ModuleLabels}/>
                  <Route path="/modules/:id" component={Module}/>
                  <Route exact path="/drafts/:id" component={DraftDetais}/>
                  <Route path="/drafts/:id/:action" component={Draft}/>
                  <Route exact path="/resources" component={Resources}/>
                  <Route path="/resources/:id" component={Resources}/>
                  <Route path="/users/:id" component={Profile}/>
                  <Route path="/settings" component={Settings}/>
                  <Route path="/helpdesk" component={Helpdesk}/>
                  <SecureRoute
                    path="/invitations"
                    component={Invitations}
                    routeGuard={this.InvitationsGuard}
                    redirectToPathWhenFail="/"
                  />
                  <SecureRoute
                    path="/teams/:id?/:tab?"
                    component={Teams}
                    routeGuard={this.TeamsGuard}
                    redirectToPathWhenFail="/"
                  />
                  <SecureRoute
                    path="/processes"
                    component={Processes}
                    routeGuard={this.ProcessesGuard}
                    redirectToPathWhenFail="/"
                  />
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

interface SecureRouteProps extends RouteProps {
  redirectToPathWhenFail: string
  routeGuard: () => Promise<boolean>
}

const SecureRoute = ({ routeGuard, redirectToPathWhenFail, ...routeProps }: SecureRouteProps) => {
  const [loading, setLoading] = React.useState(true)
  const [passedGuard, setPassedGuard] = React.useState(false)

  const checkRouteGuard = async () => {
    const temp = await routeGuard()
    setPassedGuard(temp)
    setLoading(false)
  }

  React.useEffect(() => {
    checkRouteGuard()
  })

  if (loading) return null

  if (passedGuard) return <Route {...routeProps} />

  return <Redirect to={redirectToPathWhenFail} />
}
