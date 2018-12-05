import * as React from 'react'
import { NavLink } from 'react-router-dom'

import Header from './Header'
import Icon from './ui/Icon'

const navigation = () => {
  const toggleMenu = () => {
    console.log('toggle')
  }

  return (
    <aside className="sidebar frame">
      <Header title={"Menu"}>
        <button 
          className="sidebar__toggle" 
          onClick={toggleMenu}>
          <Icon name={'menu'} />
        </button>
      </Header>
      <nav className="nav">
        <ul>
          <li className="nav__link">
            <NavLink exact to="/" activeClassName="active">Dashboard</NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/notifications" activeClassName="active">Notifications</NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/books" activeClassName="active">Books</NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/resources" activeClassName="active">Resources</NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/settings" activeClassName="active">Settings</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default navigation
