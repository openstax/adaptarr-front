import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { updateLabel } from 'src/store/actions/modules'
import { ModuleLabel as ModuleLabelType } from 'src/store/types'

import { useIsLabelExisting } from 'src/hooks'

import ColorGenerator from 'src/components/ColorGenerator'
import ModuleLabel from 'src/components/ModuleLabel'
import Input from 'src/components/ui/Input'
import Button from 'src/components/ui/Button'

import './index.css'

interface ModuleLabelManagerProps {
  label: ModuleLabelType
  onCancel?: () => void
  onUpdate?: (label: ModuleLabelType) => void
}

const ModuleLabelManager = ({ label, onCancel, onUpdate }: ModuleLabelManagerProps) => {
  const [labelPreview, setLabelPreview] = React.useState(label)

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const updateLabelPreview = (data: { name?: string, color?: string }) => {
    setLabelPreview({
      ...labelPreview,
      ...data,
    })
  }

  const isLabelExisting = useIsLabelExisting(labelPreview.name)

  const onChange = (name: string) => {
    updateLabelPreview({ name })
  }

  const onColorChange = (color: string) => {
    updateLabelPreview({ color })
  }

  const handleUpdateLabel = () => {
    if (isLabelExisting && labelPreview.name !== label.name) return

    store.dispatch(
      updateLabel(labelPreview.id, {
        name: labelPreview.name,
        color: labelPreview.color,
      })
    )
    if (onUpdate) {
      onUpdate(labelPreview)
    }
  }

  return (
    <div className="module-label-manager">
      <ModuleLabel label={labelPreview} />
      <div className="module-label-manager__controls">
        <Input
          value={labelPreview.name}
          l10nId="module-labels-editor-label-name-placeholder"
          onChange={onChange}
          validation={{
            custom: input => input === label.name || !isLabelExisting,
          }}
          errorMessage="module-labels-editor-label-name-taken"
        />
        <ColorGenerator startColor={labelPreview.color} onChange={onColorChange} />
        <div className="module-label-manager__buttons">
          <Button clickHandler={handleCancel}>
            <Localized id="module-labels-editor-cancel">
              Cancel
            </Localized>
          </Button>
          <Button
            clickHandler={handleUpdateLabel}
            isDisabled={!labelPreview.name || !labelPreview.color || isLabelExisting}
          >
            <Localized id="module-labels-editor-update-label">
              Update label
            </Localized>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ModuleLabelManager
