import * as React from 'react'
import Select from 'react-select'
import { Editor, Value } from 'slate'

import i18n from 'src/i18n'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

export type Props = {
  editor: Editor,
  value: Value,
}

type Format = 'strong' | 'emphasis' | 'underline' | 'superscript' | 'subscript'
type BlockType = { value: string, label: string }

const FORMATS: Format[] = ['strong', 'emphasis', 'underline', 'superscript', 'subscript']

/**
 * Types of paragraph-like block that user can switch between.
 *
 * When selected node is not on this list, block type switching will
 * be disabled.
 */
const SWITCHABLE_TEXT_TYPES = ['paragraph', 'title']

const BLOCK_TYPES: BlockType[] = [
  { value: 'paragraph', label: i18n.t('Editor.format.textType.paragraph') },
  { value: 'title', label: i18n.t('Editor.format.textType.title') },
]

export default class FormatTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props
    const { startBlock } = value

    if (editor.isVoid(startBlock)) {
      return null
    }

    const list = editor.getCurrentList(value)

    return (
      <div className="toolbox-format">
        <Select
          className="toolbox__select"
          value={{ value: startBlock.type, label: i18n.t(`Editor.format.textType.${startBlock.type}`) as string }}
          onChange={this.changeTextType}
          options={BLOCK_TYPES}
          isDisabled={!SWITCHABLE_TEXT_TYPES.includes(startBlock.type)}
        />
        {FORMATS.map(format => (
          <Button
            key={format}
            className={`toolbox__button--only-icon ${this.isActive(format) ? 'active' : ''}`}
            dataId={format}
            clickHandler={this.applyFormat}
            title={i18n.t(`Editor.format.${format}`) as string}
          >
            <Icon name={format} />
          </Button>
        ))}
        <Button
          className="toolbox__button--only-icon"
          isDisabled={list !== null}
          clickHandler={this.formatList}
          title={i18n.t('Editor.format.list') as string}
        >
          <Icon name="list-ul" />
        </Button>
        <Button
          className="toolbox__button--only-icon"
          isDisabled={value.activeMarks.isEmpty()}
          clickHandler={this.clear}
          title={i18n.t('Editor.format.clear') as string}
        >
          <Icon name="close" />
        </Button>
      </div>
    )
  }

  private isActive = (format: Format) => {
    return this.props.value.marks.some(mark => mark ? mark.type === format : false)
  }

  private changeTextType = (blockType: BlockType) => {
    const { editor, value } = this.props
    editor.setNodeByKey(value.startBlock.key, { type: blockType.value })
  }

  private applyFormat = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()

    const format = (ev.target as HTMLButtonElement).dataset.id
    if (!format) return

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
