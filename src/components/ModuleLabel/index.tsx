import * as React from 'react'

import { isColorDark } from 'src/helpers'

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

  const style: React.CSSProperties = {
    backgroundColor: label.color,
  }
  if (isColorDark(label.color)) {
    style.color = '#fff'
  }

  return (
    <span
      className="module-label"
      style={style}
      onClick={handleClick}
    >
      { label.name }
    </span>
  )
}

export default ModuleLabel
