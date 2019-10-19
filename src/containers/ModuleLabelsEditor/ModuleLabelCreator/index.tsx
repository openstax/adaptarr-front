import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { createLabel } from 'src/store/actions/modules'
import { ModuleLabelData, ModuleLabelProperites } from 'src/store/types'

import ColorGenerator from 'src/components/ColorGenerator'
import Input from 'src/components/ui/Input'
import Button from 'src/components/ui/Button'
import { getRandomColor, isColorDark } from 'src/helpers'

import './index.css'

interface ModuleLabelCreatorProps {
  onCancel: () => void
  afterCreate?: () => void
}

const ModuleLabelCreator = ({ onCancel, afterCreate }: ModuleLabelCreatorProps) => {
  const [labelData, setLabelData] = React.useState<ModuleLabelProperites>({
    color: getRandomColor(),
  })

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const updateLabelData = (data: { name?: string, color?: string }) => {
    setLabelData({
      ...labelData,
      ...data,
    })
  }

  const onChange = (name: string) => {
    updateLabelData({ name })
  }

  const onColorChange = (color: string) => {
    updateLabelData({ color })
  }

  const handleCreateLabel = () => {
    if (labelData.name && labelData.color) {
      store.dispatch(createLabel(labelData as ModuleLabelData))
      if (afterCreate) {
        afterCreate()
      }
    }
  }

  return (
    <div className="module-label-creator">
      <ModuleLabelPreview
        name={labelData.name}
        color={labelData.color!}
      />
      <div className="module-label-creator__controls">
        <Input
          l10nId="module-labels-editor-label-name-placeholder"
          onChange={onChange}
        />
        <ColorGenerator startColor={labelData.color} onChange={onColorChange} />
        <div className="module-label-creator__buttons">
          <Button clickHandler={handleCancel}>
            <Localized id="module-labels-editor-cancel">
              Cancel
            </Localized>
          </Button>
          <Button
            clickHandler={handleCreateLabel}
            isDisabled={!labelData.name || !labelData.color}
          >
            <Localized id="module-labels-editor-create-label">
              Create label
            </Localized>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ModuleLabelCreator

interface ModuleLabelPreviewProps extends ModuleLabelProperites {
  color: string
}

const ModuleLabelPreview = ({ name, color }: ModuleLabelPreviewProps) => {
  const style: React.CSSProperties = {
    backgroundColor: color,
  }
  if (isColorDark(color)) {
    style.color = '#fff'
  }

  return (
    <span
      className="module-label"
      style={style}
    >
      {
        name
          ? name
          :
          <Localized id="module-label-editor-label-name">
            Label name
          </Localized>
      }
    </span>
  )
}
