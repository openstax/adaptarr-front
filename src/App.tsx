import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from './components/Navigation'

import Dashboard from './screens/app/Dashboard'
import NotificationsCentre from './screens/app/NotificationsCentre'
import Books from './screens/app/Books'
import Book from './screens/app/Book'
import Resources from './screens/app/Resources'
import Settings from './screens/app/Settings'

import './assets/styles/shared.css'

class App extends React.Component {
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

export default App
