import './index.css'

import * as React from 'react'

type Props = {
  max: number
  value: number
  className?: string
  animate?: boolean
  color?: 'red' | 'orange' | 'green' | 'blue'
}

const progressBar = ({ max, value, className, animate, color }: Props) => {
  let classes = ['progressBar']
  if (className) {
    classes.push(className)
  }
  if (animate) {
    classes.push('animate')
  }
  if (color) {
    classes.push(`progressBar--${color}`)
  }

  return (
    <div className={classes.join(' ')}>
      <span style={{width: `${(value/max)*100}%`}}><span></span></span>
    </div>
  )
}

export default progressBar
