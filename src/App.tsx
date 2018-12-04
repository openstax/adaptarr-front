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
import { State } from './store/reducers/index'

import './assets/styles/shared.css'

type Props = {
  user: {}
  notifications: {}
  fetchUser: () => void
  fetchNotifications: () => void
}

export const mapStateToProps = ({ user, notifications }: State) => {
  return {
    user,
    notifications,
  }
}

export const mapDispatchToProps = (dispatch: userActions.FetchUser | notificationsActions.FetchNotifications) => {
  return {
    fetchUser: () => dispatch(userActions.fetchUser()),
    fetchNotifications: () => dispatch(notificationsActions.fetchNotifications()),
  }
}

class App extends React.Component<Props> {

  componentDidMount () {
    this.props.fetchUser()
    this.props.fetchNotifications()
  }

  public render() {
    return (
      <Router>
        <div className="container container--main">
          <Navigation />
          <main>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/notifications" component={NotificationsCentre} />
            <Route exact path="/books" component={Books} />
            <Route exact path="/book/:id" component={Book} />
            <Route exact path="/resources" component={Resources} />
            <Route exact path="/settings" component={Settings} />
          </main>
        </div>
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
