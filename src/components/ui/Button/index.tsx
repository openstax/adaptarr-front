import * as React from 'react'
import { Link } from 'react-router-dom'
import { LocationDescriptor } from 'history'

import './index.css'

interface ButtonProps {
  type?: 'default' | 'danger'
  className?: string
  isDisabled?: boolean
  children: React.ReactNode
  clickHandler?: (event: React.MouseEvent<HTMLButtonElement>) => any
  to?: LocationDescriptor
  dataId?: string
  title?: string
  withBorder?: boolean
}

const Button = ({
  type,
  className,
  isDisabled,
  children,
  clickHandler,
  to,
  dataId,
  title,
  withBorder,
}: ButtonProps) => {
  const classes: string[] = ['button']

  if (type) classes.push(`button--${type}`)
  if (className) classes.push(className)
  if (withBorder) classes.push('button--borderd')

  if (to) {
    return (
      <Link
        to={to}
        className={classes.join(' ')}
        data-id={dataId ? dataId : null}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes.join(' ')}
      onClick={clickHandler}
      disabled={isDisabled}
      type="button"
      data-id={dataId ? dataId : null}
      title={title ? title : ''}
    >
      {children}
    </button>
  )
}

export default Button
