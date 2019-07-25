import './index.css'

import * as React from 'react'

type Props = {
  children?: any
  className?: string
}

const section = ({ children, className }: Props) => {
  return (
    <section className={`section--wrapper ${className ? className : ''}`}>
      {children}
    </section>
  )
}

export default section
