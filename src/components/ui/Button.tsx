import * as React from 'react'
import { Link } from 'react-router-dom'
import { LocationDescriptor } from 'history'

type Props = {
  color?: 'green' | 'red'
  size?: 'small' | 'medium' | 'big'
  children: React.ReactNode
  clickHandler?: any
  to?: LocationDescriptor
}

const button = ({ color, size, children, clickHandler, to }: Props) => {
  const classes: string[] = ['button']

  if (color) classes.push(`button--${color}`)
  if (size) classes.push(`button--${size}`)

  return (
    <React.Fragment>
      {
        to ?
          <Link to={to} className={classes.join(' ')}>{children}</Link>
        :
          <button className={classes.join(' ')} onClick={clickHandler}>
            {children}
          </button>
      }
    </React.Fragment>
  )
}

export default button
