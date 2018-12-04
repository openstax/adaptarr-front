import * as React from 'react'

type Props = {
  color?: 'green' | 'red'
  size?: 'small' | 'medium' | 'big'
  children: React.ReactNode
  clickHandler?: any
}

const button = ({ color, size, children, clickHandler }: Props) => {
  const classes: string[] = ['button']

  if (color) classes.push(`button--${color}`)
  if (size) classes.push(`button--${size}`)

  return (
    <button className={classes.join(' ')} onClick={clickHandler}>
      {children}
    </button>
  )
}

export default button
