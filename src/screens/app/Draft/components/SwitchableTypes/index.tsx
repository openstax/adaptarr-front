import * as React from 'react'
import Select from 'react-select'
import { Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  editor: Editor,
  value: Value,
  isDisabled?: boolean,
}

/**
 * Types of paragraph-like block that user can switch between.
 *
 * If current type is paragraph then it should be changed to title, etc.
 */
const SWITCHABLE_TYPES = {
  paragraph: 'title',
  title: 'paragraph',
}

export default class SwitchableTypes extends React.Component<Props> {

  private changeTextType = () => {
    const { editor, value: { startBlock } } = this.props
    editor.setNodeByKey(startBlock.key, { type: SWITCHABLE_TYPES[startBlock.type] })
  }

  public render() {
    const { value: { startBlock }, isDisabled = false } = this.props

    if (!startBlock || !SWITCHABLE_TYPES[startBlock.type]) return null

    const newType = SWITCHABLE_TYPES[startBlock.type]

    return (
      <div className="switchable-types">
        <Button clickHandler={this.changeTextType} isDisabled={isDisabled}>
          <Localized id={`editor-tools-switchable-type-to-${newType}`}>
            {`Change to ${newType}`}
          </Localized>
        </Button>
      </div>
    )
  }
}

