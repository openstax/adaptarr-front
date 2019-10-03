import * as React from 'react'
import Select from 'react-select'
import { Editor, Value, Block, Document, Range, Inline } from 'slate'
import { Localized } from 'fluent-react/compat'

import './index.css'

type Props = {
  editor: Editor,
  value: Value,
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
    const { editor, value: { startBlock, document } } = this.props
    const parent = document.getParent(startBlock.key) as Block | Document

    editor.withoutNormalizing(() => {
      editor.setNodeByKey(startBlock.key, { type: blockType })

      if (parent.object === 'document' && blockType === 'title') {
        const index = parent.nodes.findIndex(n => n!.key === startBlock.key)
        const last = parent.nodes.findLast(
          (node: Block | Inline, inx) => node!.type !== 'section' && inx! >= index)

        editor.moveStartToStartOfNode(startBlock)
        editor.moveEndToEndOfNode(last)
        const { anchor, focus } = editor.value.selection
        const range = Range.create({ anchor, focus })
        editor.wrapBlockAtRange(range, 'section')
      }
    })
  }

  private isDisabled = () => {
    const { value: { startBlock, document } } = this.props
    if (!startBlock) return true

    if (SWITCHABLE_TEXT_TYPES.find(t => t === startBlock.type)) {
      const parent = document.getParent(startBlock.key) as Block | Document

      // Allow switching type only for frist element in notes and quotations
      if (parent.type === 'admonition' || parent.type === 'quotation') {
        if (startBlock.key !== parent.nodes.first().key) return true
      }

      return false
    }

    return true
  }

  public render() {
    const { value: { startBlock } } = this.props
    const isDisabled = this.isDisabled()

    return (
      <div className={`switchable-types ${isDisabled ? 'disabled' : ''}`}>
        <Select
          className="toolbox__select react-select"
          value={{ value: startBlock.type, label: startBlock.type}}
          onChange={this.changeTextType}
          options={SWITCHABLE_TEXT_TYPES.map(t => {return {value: t, label: t}})}
          isDisabled={isDisabled}
          formatOptionLabel={OptionLabel}
          isSearchable={false}
        />
      </div>
    )
  }
}

function OptionLabel({value: type}: {value: string, label: string}) {
  return <Localized id="editor-tools-format-text-type" $type={type}>{type}</Localized>
}
