import * as React from 'react'

type Props = {
  isLoading: boolean
  children: React.ReactNode
}

const loader = ({ isLoading, children }: Props) => {
  return (
    <React.Fragment>
      {
        isLoading ?
        <span className="loader">
          {isLoading ? 'Loading...' : null}
        </span>
        :
        children
      }
    </React.Fragment>
  )
}

export default loader
