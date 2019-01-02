import './index.css'

import * as React from 'react'

type Props = {
  children?: any
}

const section = (props: Props) => {
  return (
    <section className="section--wrapper">
      {props.children}
    </section>
  )
}

export default section
