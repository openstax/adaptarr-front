import * as React from 'react'
import Select from 'react-select'
import { Editor, Value, Text } from 'slate'
import { Localized } from 'fluent-react/compat'
import { List } from 'immutable'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

export type Props = {
  editor: Editor,
  value: Value,
}

type Format = 'strong' | 'emphasis' | 'underline' | 'superscript' | 'subscript' | 'code'

const FORMATS: Format[] = ['strong', 'emphasis', 'underline', 'superscript', 'subscript', 'code']

/**
 * Types of paragraph-like block that user can switch between.
 *
 * When selected node is not on this list, block type switching will
 * be disabled.
 */
const SWITCHABLE_TEXT_TYPES = ['paragraph', 'title']

export default class FormatTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props
    const { startBlock } = value
    const code = startBlock.type === 'code' ? startBlock : null
    
    if (editor.isVoid(startBlock) || code) {
      return null
    }

    const list = editor.getCurrentList(value)

    return (
      <div className="toolbox-format">
        <Select
          className="toolbox__select"
          value={startBlock.type}
          onChange={this.changeTextType}
          options={SWITCHABLE_TEXT_TYPES}
          isDisabled={!SWITCHABLE_TEXT_TYPES.includes(startBlock.type)}
          formatOptionLabel={OptionLabel}
        />
        {FORMATS.map(format => (
          <Localized key={format} id={`editor-tools-format-button-${format}`} attrs={{ title: true }}>
            <Button
              className={`toolbox__button--only-icon ${this.isActive(format) ? 'active' : ''}`}
              dataId={format}
              clickHandler={this.applyFormat}
            >
              <Icon name={format} />
            </Button>
          </Localized>
        ))}
        <Localized id="editor-tools-format-button-list" attrs={{ title: true }}>
          <Button
            className="toolbox__button--only-icon"
            isDisabled={list !== null}
            clickHandler={this.formatList}
          >
            <Icon name="list-ul" />
          </Button>
        </Localized>
        <Localized id="editor-tools-format-button-clear" attrs={{ title: true }}>
          <Button
            className="toolbox__button--only-icon"
            isDisabled={value.activeMarks.isEmpty()}
            clickHandler={this.clear}
          >
            <Icon name="close" />
          </Button>
        </Localized>
      </div>
    )
  }

  private isActive = (format: Format) => {
    const isMark = this.props.value.marks.some(mark => mark ? mark.type === format : false)
    const inline = this.props.value.startInline
    const isInline = inline && inline.type === format ? true : false
    return isMark || isInline
  }

  private changeTextType = (blockType: string) => {
    const { editor, value } = this.props
    editor.setNodeByKey(value.startBlock.key, { type: blockType })
  }

  private applyFormat = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()

    const format = (ev.target as HTMLButtonElement).dataset.id
    if (!format) return

    if (format === 'code') {
      const inline = this.props.value.startInline
      if (!inline || inline.type !== 'code') {
        if (this.props.value.selection.isCollapsed) {
          this.props.editor.insertInline({ type: 'code', nodes: List([Text.create(' ')]) })
          this.props.editor.moveBackward()
        } else {
          this.props.editor.wrapInline({ type: 'code' })
        }
      } else {
        this.props.editor.unwrapInlineByKey(inline.key, { type: 'code' })
      }
      return
    }

    this.props.editor.toggleMark(format)
  }

  private clear = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    this.props.editor.removeMarks()
  }

  private formatList = () => {
    this.props.editor.wrapInList('ul_list')
  }
}

function OptionLabel(type: string) {
  return <Localized id="editor-tools-format-text-type" $type={type}>{type}</Localized>
}
