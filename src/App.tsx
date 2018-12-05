import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Navigation from './components/Navigation'

import Dashboard from './screens/app/Dashboard'
import NotificationsCentre from './screens/app/NotificationsCentre'
import Books from './screens/app/Books'
import Book from './screens/app/Book'
import Resources from './screens/app/Resources'
import Settings from './screens/app/Settings'

import * as userActions from './store/actions/User'
import * as notificationsActions from './store/actions/Notifications'
import * as booksActions from './store/actions/Books'
import * as modulesActions from './store/actions/Modules'
import * as types from './store/types'
import { State } from './store/reducers/index'

import './assets/styles/shared.css'

type Props = {
  user: {}
  notifications: {}
  booksMap: {
    booksMap: types.BooksMap
  }
  modulesMap: {
    modulesMap: types.ModulesMap
  }
  fetchUser: () => void
  fetchNotifications: () => void
  fetchBooksMap: () => void
  fetchModulesMap: () => void
}

export const mapStateToProps = ({ user, notifications, booksMap, modulesMap }: State) => {
  return {
    user,
    notifications,
    booksMap,
    modulesMap,
  }
}

export const mapDispatchToProps = (dispatch: userActions.FetchUser | notificationsActions.FetchNotifications | booksActions.FetchBooksMap | modulesActions.FetchModulesMap) => {
  return {
    fetchUser: () => dispatch(userActions.fetchUser()),
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
    return (
      <Router>
        <div className="container container--main">
          <Navigation />
          <main>
            <Route exact path="/" component={Dashboard} />
            <Route path="/notifications" component={NotificationsCentre} />
            <Route exact path="/books" component={Books} />
            <Route path="/books/:id" component={Book} />
            <Route path="/resources" component={Resources} />
            <Route path="/settings" component={Settings} />
          </main>
        </div>
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
