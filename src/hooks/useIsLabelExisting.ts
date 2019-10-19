import * as React from 'react'
import { useSelector } from 'react-redux'

import { State } from 'src/store/reducers'

const useIsLabelExisting = (name: string) => {
  const [state, setState] = React.useState(false)
  const labels = useSelector((state: State) => state.modules.labels)

  const checkIfLabelExists = () => {
    const values = Object.values(labels)
    setState(Boolean(values.find(l => l.name.toLowerCase() === name.toLowerCase())))
  }

  React.useEffect(() => {
    checkIfLabelExists()
  }, [name])

  return state
}

export default useIsLabelExisting
