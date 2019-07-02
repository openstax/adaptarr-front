import * as React from 'react'
import Select from 'react-select'
import { Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import './index.css'

type Props = {
  editor: Editor,
  value: Value,
  isDisabled?: boolean,
}

/**
 * Types of paragraph-like block that user can switch between.
 *
 * When selected node is not on this list, block type switching will
 * be disabled.
 */
const SWITCHABLE_TEXT_TYPES = ['paragraph', 'title']

export default class SwitchableTypes extends React.Component<Props> {

  private changeTextType = ({value: blockType}: {value: string, label: string}) => {
    const { editor, value } = this.props
    editor.setNodeByKey(value.startBlock.key, { type: blockType })
  }

  public render() {
    const { value: { startBlock }, isDisabled = false } = this.props

    if (!startBlock) return null

    return (
      <div className="switchable-types">
        <span className="switchable-types__title">
          <Localized id="editor-tools-switchable-type-title">
            Block type
          </Localized>
        </span>
        <Select
          className="toolbox__select"
          value={{ value: startBlock.type, label: startBlock.type}}
          onChange={this.changeTextType}
          options={SWITCHABLE_TEXT_TYPES.map(t => {return {value: t, label: t}})}
          isDisabled={isDisabled || !SWITCHABLE_TEXT_TYPES.find(t => t === startBlock.type)}
          formatOptionLabel={OptionLabel}
        />
      </div>
    )
  }
}

function OptionLabel({value: type}: {value: string, label: string}) {
  return <Localized id="editor-tools-format-text-type" $type={type}>{type}</Localized>
}
