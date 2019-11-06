import * as React from 'react'
import { Block, Document, Editor, Inline, Text, Value } from 'slate'
import { List } from 'immutable'
import { connect } from 'react-redux'

import { User } from 'src/api'

import { State } from 'src/store/reducers'

import SwitchableTypes from '../SwitchableTypes'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Tooltip from 'src/components/ui/Tooltip'

import './index.css'

interface FormatToolsProps {
  editor: Editor,
  value: Value,
  selectionParent: Document | Block | Inline | null,
  showSwitchableTypes?: boolean,
  user: User
}

const mapStateToProps = ({ user: { user } }: State) => ({
  user,
})

const INVALID_FORMAT_TOOLS_PARENTS = [
  'code',
  'media_alt',
  'source_element',
]

type Format = 'strong' | 'emphasis' | 'underline' | 'superscript' | 'subscript' | 'code' | 'term'

const FORMATS: [Format, string][] = [
  ['strong', 'editor-tools-format-button-strong'],
  ['emphasis', 'editor-tools-format-button-emphasis'],
  ['underline', 'editor-tools-format-button-underline'],
  ['superscript', 'editor-tools-format-button-superscript'],
  ['subscript', 'editor-tools-format-button-subscript'],
  ['code', 'editor-tools-format-button-code'],
  ['term', 'editor-tools-format-button-term'],
]

const VALID_LIST_PARENTS = [
  'admonition',
  'document',
  'exercise_problem',
  'exercise_solution',
  'section',
  'ul_list',
  'ol_list',
  'list_item',
]

const INVALID_HIGHLIGHT_PARENTS = [
  'image',
  'term',
  'link',
  'xref',
]

class FormatTools extends React.Component<FormatToolsProps> {
  render() {
    const { editor, value, showSwitchableTypes = true } = this.props
    const { startBlock, startInline } = value

    if (
      !startBlock ||
      editor.isVoid(startBlock) ||
      INVALID_FORMAT_TOOLS_PARENTS.includes(startBlock.type) ||
      (startInline && INVALID_FORMAT_TOOLS_PARENTS.includes(startInline.type))) {
      return null
    }

    const undosNumber = value.data.has('undos') ? value.data.get('undos').size : 0
    const redosNumber = value.data.has('redos') ? value.data.get('redos').size : 0

    return (
      <div className="toolbox-format">
        <div className="toolbox-format__special-tools">
          <Tooltip
            l10nId="editor-tools-format-button-undo"
            direction="up"
            className="toolbox__button--with-tooltip"
          >
            <Button
              clickHandler={this.undo}
              isDisabled={!undosNumber}
              className="toolbox__button--only-icon"
            >
              <Icon size="small" name="undo" />
            </Button>
          </Tooltip>
          <Tooltip
            l10nId="editor-tools-format-button-redo"
            direction="up"
            className="toolbox__button--with-tooltip"
          >
            <Button
              clickHandler={this.redo}
              isDisabled={!redosNumber}
              className="toolbox__button--only-icon"
            >
              <Icon size="small" name="redo" />
            </Button>
          </Tooltip>
          {
            showSwitchableTypes ?
              <SwitchableTypes editor={editor} value={value} />
              : null
          }
        </div>
        {FORMATS.map(([format, l10nId]) => (
          <Tooltip
            l10nId={l10nId}
            direction="up"
            className="toolbox__button--with-tooltip"
            key={format}
          >
            <Button
              className={`toolbox__button--only-icon ${this.isActive(format) ? 'active' : ''}`}
              dataId={format}
              clickHandler={this.applyFormat}
            >
              <Icon size="small" name={format} />
            </Button>
          </Tooltip>
        ))}
        <Tooltip
          l10nId="editor-tools-format-button-list"
          direction="up"
          className="toolbox__button--with-tooltip"
        >
          <Button
            className="toolbox__button--only-icon"
            isDisabled={!this.validateParents(VALID_LIST_PARENTS)}
            clickHandler={this.formatList}
          >
            <Icon size="small" name="list-ul" />
          </Button>
        </Tooltip>
        <Tooltip
          l10nId="editor-tools-format-button-highlight"
          direction="up"
          className="toolbox__button--with-tooltip"
        >
          <Button
            className="toolbox__button--only-icon"
            isDisabled={this.validateParents(INVALID_HIGHLIGHT_PARENTS)}
            clickHandler={this.toggleHighlight}
          >
            <Icon size="small" name="highlight" />
          </Button>
        </Tooltip>
        <Tooltip
          l10nId="editor-tools-format-button-clear"
          direction="up"
          className="toolbox__button--with-tooltip"
        >
          <Button
            className="toolbox__button--only-icon"
            isDisabled={value.activeMarks.isEmpty()}
            clickHandler={this.clear}
          >
            <Icon size="small" name="close" />
          </Button>
        </Tooltip>
      </div>
    )
  }

  private undo = () => {
    this.props.editor.undo()
  }

  private redo = () => {
    this.props.editor.redo()
  }

  private isActive = (format: Format) => {
    const isMark = this.props.value.marks.some(mark => {
      if (mark) return mark.type === format
      return false
    })
    const inline = this.props.value.startInline
    const isInline = inline && inline.type === format
    return isMark || isInline
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
    const { editor, value } = this.props
    if (editor.isSelectionInList(value)) {
      editor.unwrapList()
    } else {
      editor.wrapInList('ul_list')
    }
  }

  private toggleHighlight = () => {
    const { editor, value, value: { selection }, user } = this.props
    const highlight = editor.getActiveHighlight(value)
    if (highlight) {
      editor.unwrapInlineByKey(highlight.key, { type: 'highlight' })
      return
    }
    if (selection.isCollapsed) return
    editor.wrapInline({ type: 'highlight', data: { color: 'red', text: '', user: user.id } })
  }

  private validateParents = (validParents: string[]): boolean => {
    const sp = this.props.selectionParent
    if (!sp) return false
    if (validParents.includes(sp.type) || validParents.includes(sp.object)) return true
    return false
  }
}

export default connect(mapStateToProps)(FormatTools)
