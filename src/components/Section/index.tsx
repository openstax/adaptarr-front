import * as React from 'react'

import './index.css'

interface SectionProps {
  children?: any
  className?: string
}

const Section = ({ children, className }: SectionProps) => (
  <section className={`section--wrapper ${className ? className : ''}`}>
    {children}
  </section>
)

export default Section
