import * as React from 'react'

import { ModuleLabel as ModuleLabelType } from 'src/store/types'

import './index.css'

interface ModuleLabelProps {
  label: ModuleLabelType
  onClick?: (label: ModuleLabelType) => void
}

const ModuleLabel = ({ label, onClick }: ModuleLabelProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(label)
    }
  }

  // TODO: Change font color to white if bg is dark.
  return (
    <span
      className="module-label"
      style={{ backgroundColor: label.color }}
      onClick={handleClick}
    >
      { label.name }
    </span>
  )
}

export default ModuleLabel
