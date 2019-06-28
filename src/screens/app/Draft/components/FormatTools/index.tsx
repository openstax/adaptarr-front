import * as React from 'react'
import Select from 'react-select'
import { Editor, Value, Text, Document, Block, Inline } from 'slate'
import { Localized } from 'fluent-react/compat'
import { List } from 'immutable'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Tooltip from 'src/components/ui/Tooltip'

export type Props = {
  editor: Editor,
  value: Value,
  selectionParent: Document | Block | Inline | null,
  showSwitchableTypes?: boolean,
}

type Format = 'strong' | 'emphasis' | 'underline' | 'superscript' | 'subscript' | 'code' | 'term'

const FORMATS: Format[] = ['strong', 'emphasis', 'underline', 'superscript', 'subscript', 'code', 'term']

/**
 * Types of paragraph-like block that user can switch between.
 *
 * When selected node is not on this list, block type switching will
 * be disabled.
 */
const SWITCHABLE_TEXT_TYPES = ['paragraph', 'title']

const VALID_LIST_PARENTS = ['admonition', 'document', 'exercise_problem', 'exercise_solution', 'section']

export default class FormatTools extends React.Component<Props> {
  render() {
    const { editor, value, showSwitchableTypes = true } = this.props
    const { startBlock } = value
    const code = startBlock && startBlock.type === 'code' ? startBlock : null

    if (!startBlock || editor.isVoid(startBlock) || code) {
      return null
    }

    return (
      <div className="toolbox-format">
        {
          showSwitchableTypes ?
            <Select
              className="toolbox__select"
              value={{ value: startBlock.type, label: startBlock.type}}
              onChange={this.changeTextType}
              options={SWITCHABLE_TEXT_TYPES.map(t => {return {value: t, label: t}})}
              isDisabled={!SWITCHABLE_TEXT_TYPES.find(t => t === startBlock.type)}
              formatOptionLabel={OptionLabel}
            />
          : null
        }
        {FORMATS.map(format => (
          <Tooltip
            l10nId={`editor-tools-format-button-${format}`}
            direction="up"
            className="toolbox__button--with-tooltip"
          >
            <Button
              className={`toolbox__button--only-icon ${this.isActive(format) ? 'active' : ''}`}
              dataId={format}
              clickHandler={this.applyFormat}
            >
              <Icon name={format} />
            </Button>
          </Tooltip>
        ))}
        <Tooltip
          l10nId={'editor-tools-format-button-list'}
          direction="up"
          className="toolbox__button--with-tooltip"
        >
          <Button
            className="toolbox__button--only-icon"
            isDisabled={!this.validateParents(VALID_LIST_PARENTS)}
            clickHandler={this.formatList}
          >
            <Icon name="list-ul" />
          </Button>
        </Tooltip>
        <Tooltip
          l10nId={'editor-tools-format-button-clear'}
          direction="up"
          className="toolbox__button--with-tooltip"
        >
          <Button
            className="toolbox__button--only-icon"
            isDisabled={value.activeMarks.isEmpty()}
            clickHandler={this.clear}
          >
            <Icon name="close" />
          </Button>
        </Tooltip>
      </div>
    )
  }

  private isActive = (format: Format) => {
    const isMark = this.props.value.marks.some(mark => mark ? mark.type === format : false)
    const inline = this.props.value.startInline
    const isInline = inline && inline.type === format ? true : false
    return isMark || isInline
  }

  private changeTextType = ({value: blockType}: {value: string, label: string}) => {
    const { editor, value } = this.props
    editor.setNodeByKey(value.startBlock.key, { type: blockType })
  }

  private applyFormat = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()

    const format = (ev.currentTarget as HTMLButtonElement).dataset.id
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
    } else if (format === 'term') {
      const inline = this.props.value.startInline
      if (!inline || inline.type !== 'term') {
        this.props.editor.wrapInline({ type: 'term' })
      } else {
        this.props.editor.unwrapInlineByKey(inline.key, { type: 'term', data: inline.data.toJS() })
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

  private validateParents = (validParents: string[]): boolean => {
    const sp = this.props.selectionParent
    if (!sp) return false
    if (validParents.includes(sp.type) || validParents.includes(sp.object)) return true
    return false
  }
}

function OptionLabel({value: type}: {value: string, label: string}) {
  return <Localized id="editor-tools-format-text-type" $type={type}>{type}</Localized>
}
