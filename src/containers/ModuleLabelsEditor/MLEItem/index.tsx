import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { removeLabel } from 'src/store/actions/modules'
import { ModuleLabel as ModuleLabelType } from 'src/store/types'

import { confirmDialog } from 'src/helpers'

import ModuleLabelManager from '../ModuleLabelManager'
import ModuleLabel from 'src/components/ModuleLabel'
import Button from 'src/components/ui/Button'

import './index.css'

interface MLEItemProps {
  label: ModuleLabelType
}

const MLEItem = ({ label }: MLEItemProps) => {
  const [editMode, setEditMode] = React.useState(false)

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleRemove = async () => {
    const res = await confirmDialog({
      title: 'module-labels-editor-remove-confirm',
      size: 'medium',
      $label: label.name,
      buttons: {
        cancel: 'module-labels-editor-cancel',
        remove: 'module-labels-editor-remove',
      },
    })
    if (res === 'remove') {
      store.dispatch(removeLabel(label))
    }
  }

  return (
    <div className="module-labels-editor__item">
      {
        editMode
          ?
          <ModuleLabelManager
            label={label}
            onCancel={toggleEditMode}
            onUpdate={toggleEditMode}
          />
          :
          <>
            <ModuleLabel label={label} />
            <div className="module-labels-editor__buttons">
              <Button clickHandler={toggleEditMode}>
                <Localized id="module-labels-editor-edit">
                  Edit
                </Localized>
              </Button>
              <Button clickHandler={handleRemove}>
                <Localized id="module-labels-editor-remove">
                  Remove
                </Localized>
              </Button>
            </div>
          </>
      }
    </div>
  )
}

export default MLEItem
