import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Navigation from './components/Navigation'
import Spinner from './components/Spinner'

import Dashboard from './screens/app/Dashboard'
import NotificationsCentre from './screens/app/NotificationsCentre'
import Books from './screens/app/Books'
import Book from './screens/app/Book'
import Resources from './screens/app/Resources'
import Settings from './screens/app/Settings'
import Invitations from './screens/app/Invitations'

import * as userActions from './store/actions/User'
import * as teamActions from './store/actions/Team'
import * as notificationsActions from './store/actions/Notifications'
import * as booksActions from './store/actions/Books'
import * as modulesActions from './store/actions/Modules'
import * as types from './store/types'
import { State } from './store/reducers/index'

import './assets/styles/shared.css'

type Props = {
  user: {
    isLoading: types.IsLoading
    user: types.User
  }
  team: {
    teamMap: types.TeamMap
  }
  notifications: {}
  booksMap: {
    booksMap: types.BooksMap
  }
  modulesMap: {
    modulesMap: types.ModulesMap
  }
  fetchUser: () => void
  fetchTeamMap: () => void
  fetchNotifications: () => void
  fetchBooksMap: () => void
  fetchModulesMap: () => void
}

export const mapStateToProps = ({ user, notifications, team, booksMap, modulesMap }: State) => {
  return {
    user,
    team,
    notifications,
    booksMap,
    modulesMap,
  }
}

export const mapDispatchToProps = (dispatch: userActions.FetchUser | notificationsActions.FetchNotifications | booksActions.FetchBooksMap | modulesActions.FetchModulesMap) => {
  return {
    fetchUser: () => dispatch(userActions.fetchUser()),
    fetchTeamMap: () => dispatch(teamActions.fetchTeamMap()),
    fetchNotifications: () => dispatch(notificationsActions.fetchNotifications()),
    fetchBooksMap: () => dispatch(booksActions.fetchBooksMap()),
    fetchModulesMap: () => dispatch(modulesActions.fetchModulesMap()),
  }
}

class App extends React.Component<Props> {

  componentDidMount () {
    this.props.fetchUser()
    this.props.fetchNotifications()
    this.props.fetchBooksMap()
    this.props.fetchModulesMap()
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
                <Route exact path="/" component={Dashboard} />
                <Route path="/notifications" component={NotificationsCentre} />
                <Route exact path="/books" component={Books} />
                <Route path="/books/:id" component={Book} />
                <Route path="/resources" component={Resources} />
                <Route path="/settings" component={Settings} />
                <Route path="/invitations" component={Invitations} />
              </main>
            </div>
          : <Spinner />
        }
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
