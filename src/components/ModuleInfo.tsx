import * as React from 'react'

import { ModuleShortInfo } from '../store/types'

type Props = {
  mod: ModuleShortInfo
  [key: string]: any
}

const moduleInfo = (props: Props) => {
  return (
    <div className="modulesList__info" {...props}>
      <h2 className="modulesList__title">{props.mod.title}</h2>
    </div>
  )
}

export default moduleInfo
