import * as React from 'react'
import { Link } from 'react-router-dom'

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
            <Link to="/">Dashboard</Link>
          </li>
          <li className="nav__link">
            <Link to="/notifications">Notifications</Link>
          </li>
          <li className="nav__link">
            <Link to="/books">Books</Link>
          </li>
          <li className="nav__link">
            <Link to="/resources">Resources</Link>
          </li>
          <li className="nav__link">
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default navigation
