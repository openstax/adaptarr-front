import * as React from 'react'

import './index.css'

interface ProgressBarProps {
  max: number
  value: number
  className?: string
  animate?: boolean
  color?: 'red' | 'orange' | 'green' | 'blue'
}

const ProgressBar = ({ max, value, className, animate, color }: ProgressBarProps) => {
  const classes = ['progressBar']
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
      <span style={{ width: `${(value/max)*100}%` }}><span /></span>
    </div>
  )
}

export default ProgressBar
