import * as React from 'react'
import { NavLink } from 'react-router-dom'

import Header from './Header'
import Button from './ui/Button'
import Icon from './ui/Icon'

class Navigation extends React.Component {

  state: {
    toggleSidebar: boolean,
  } = {
    toggleSidebar: false,
  }

  private toggleSidebar = () => {
    this.setState({toggleSidebar: !this.state.toggleSidebar})
  }

  public render() {
    const sidebarClasses = `sidebar frame ${this.state.toggleSidebar ? 'small': null}`
    
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
                <Icon name="dashboard" />
                <span className="nav__text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav__link" title="Notifications">
              <NavLink to="/notifications" activeClassName="active">
                <Icon name="bell" />
                <span className="nav__text">Notifications</span>
              </NavLink>
            </li>
            <li className="nav__link" title="Books">
              <NavLink to="/books" activeClassName="active">
                <Icon name="book" />
                <span className="nav__text">Books</span>
              </NavLink>
            </li>
            <li className="nav__link" title="Resources">
              <NavLink to="/resources" activeClassName="active">
                <Icon name="info" />
                <span className="nav__text">Resources</span>
              </NavLink>
            </li>
            <li className="nav__link" title="Settings">
              <NavLink to="/settings" activeClassName="active">
                <Icon name="cog" />
                <span className="nav__text">Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    )
  }
}

export default Navigation
