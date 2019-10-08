import * as React from 'react'

import { User } from "src/api"

export default function useIsInSuperMode(user: User) {
  const [state, setState] = React.useState(false)

  const checkIfUserIsInSuperMode = async () => {
    setState(await user.isInSuperMode())
  }

  React.useEffect(() => {
    checkIfUserIsInSuperMode()
  }, [user.id])

  return state
}
