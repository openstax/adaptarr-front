import * as React from 'react'
import { Link } from 'react-router-dom'

const error404 = (props: any) => {
  return (
    <div className="error404">
      <h1>This page does not exists. Please go back to <Link to="/">dashboard</Link>.</h1>
    </div>
  )
}

export default error404
