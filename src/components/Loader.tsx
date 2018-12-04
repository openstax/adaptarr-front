import * as React from 'react'

type Props = {
  isLoading: boolean
}

const loader = ({ isLoading }: Props) => {
  return (
    <span className="loader">
      {isLoading ? 'Loading...' : null}
    </span>
  )
}

export default loader
