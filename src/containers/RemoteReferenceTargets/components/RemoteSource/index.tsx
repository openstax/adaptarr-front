import './index.css'

import * as React from 'react'

import { Module } from 'src/api'

import Icon from 'src/components/ui/Icon'

type Props = {
  module: Module,
  onClick: (ev: React.MouseEvent) => void,
}

const remoteSource = ({ module, onClick }: Props) => {
  return (
    <div
      className="target-source"
      data-id={module.id}
      onClick={onClick}
    >
      <span className="target-source__title">{module.title}</span>
      <Icon name='arrow-right' size='small' />
    </div>
  )
}

export default remoteSource
