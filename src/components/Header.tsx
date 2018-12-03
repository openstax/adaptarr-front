import * as React from 'react'

type Props = {
  title?: string,
  children?: any
}

const header = (props: Props) => {
  return (
    <div className="header">
      <h2 className="header__title">{props.title}</h2>
      {props.children}
    </div>
  )
}

export default header
