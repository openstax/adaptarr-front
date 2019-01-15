import * as React from 'react'

import { Module } from 'src/api'

type Props = {
  mod: Module
}

class ModuleInfo extends React.Component<Props> {

  public render() {
    const { mod } = this.props

    return (
      <div className="modulesList__info">
        <h2 className="modulesList__title">{mod.title}</h2>
      </div>
    )
  }
}

export default ModuleInfo
