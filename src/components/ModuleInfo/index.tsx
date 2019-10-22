import * as React from 'react'

import { Module } from 'src/api'

interface ModuleInfoProps {
  mod: Module
}

const ModuleInfo = (props: ModuleInfoProps) => (
  <div className="modulesList__info">
    <h2 className="modulesList__title">{props.mod.title}</h2>
  </div>
)

export default ModuleInfo
