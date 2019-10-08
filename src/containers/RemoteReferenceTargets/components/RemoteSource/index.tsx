import * as React from 'react'

import { Module } from 'src/api'

import './index.css'

interface RemoteSourceProps {
  module: Module,
  onClick: (ev: React.MouseEvent) => void,
}

const RemoteSource = ({ module, onClick }: RemoteSourceProps) => (
  <div
    className="target-source"
    data-id={module.id}
    onClick={onClick}
  >
    <span className="target-source__title">{module.title}</span>
  </div>
)

export default RemoteSource
