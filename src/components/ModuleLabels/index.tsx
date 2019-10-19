import * as React from 'react'
import { useSelector } from 'react-redux'

import { Module } from 'src/api'

import store from 'src/store'
import { addLabelToModule, removeLabelFromModule } from 'src/store/actions/modules'
import { State } from 'src/store/reducers'
import { ModuleID, ModuleLabel } from 'src/store/types'

import ModuleLabelComp from 'src/components/ModuleLabel'
import ModuleLabelsList from 'src/components/ModuleLabelsList'
import Icon from 'src/components/ui/Icon'

import './index.css'

interface ModuleLabelsProps {
  module: Module | ModuleID
  onModuleLabelClick?: (label: ModuleLabel) => void
}

const ModuleLabels = ({
  module,
  onModuleLabelClick,
}: ModuleLabelsProps) => {
  const [editLabels, setEditLabels] = React.useState(false)
  const { labels, modulesWithLabels } = useSelector((state: State) => ({
    labels: state.modules.labels,
    modulesWithLabels: state.modules.modulesWithLabels,
  }))

  const moduleId = typeof module === 'string' ? module : module.id
  const moduleLabels = (modulesWithLabels[moduleId] || []).map(lId => labels[lId])

  // Triggered by click or from child component.
  const toggleEditLabel = (ev: React.MouseEvent | undefined) => {
    if (ev) {
      ev.preventDefault()
    }
    setEditLabels(!editLabels)
  }

  const onLabelClick = (label: ModuleLabel) => {
    if (moduleLabels.find(ml => ml.id === label.id)) {
      removeLabel(label)
    } else {
      addLabel(label)
    }
  }

  const addLabel = (label: ModuleLabel) => {
    store.dispatch(addLabelToModule(moduleId, label))
  }

  const removeLabel = (label: ModuleLabel) => {
    store.dispatch(removeLabelFromModule(moduleId, label.id))
  }

  return (
    <div className="module-labels">
      {
        moduleLabels.length
          ? <div className="module-labels__labels">
            {
              moduleLabels.map(label => (
                <ModuleLabelComp
                  key={label.id}
                  label={label}
                  onClick={onModuleLabelClick}
                />
              ))
            }
          </div>
          : null
      }
      <span
        className="module-labels__settings"
        onClick={toggleEditLabel}
      >
        <Icon size="small" name="cog"/>
      </span>
      {
        editLabels
          ?
          <ModuleLabelsList
            active={moduleLabels}
            title="module-labels-selector-title"
            onLabelClick={onLabelClick}
            onClose={toggleEditLabel as () => void}
          />
          : null
      }
    </div>
  )
}

export default ModuleLabels
