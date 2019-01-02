import './index.css'

import * as React from 'react'
import { Link } from 'react-router-dom'
import { LocationDescriptor } from 'history'

type Props = {
  color?: 'green' | 'red'
  size?: 'small' | 'medium' | 'big'
  className?: string
  isDisabled?: boolean
  children: React.ReactNode
  clickHandler?: any
  to?: LocationDescriptor
}

const button = ({ color, size, className, isDisabled, children, clickHandler, to }: Props) => {
  const classes: string[] = ['button']

  if (color) classes.push(`button--${color}`)
  if (size) classes.push(`button--${size}`)
  if (className) classes.push(className)

  return (
    <React.Fragment>
      {
        to ?
          <Link to={to} className={classes.join(' ')}>{children}</Link>
        :
          <button 
            className={classes.join(' ')} 
            onClick={clickHandler} 
            disabled={isDisabled}
            type="button"
          >
            {children}
          </button>
      }
    </React.Fragment>
  )
}

export default button
