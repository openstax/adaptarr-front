import * as React from 'react'
import { Trans } from 'react-i18next'
import { Editor, Value } from 'slate'
import { EditorAug } from 'cnx-designer'

import i18n from 'src/i18n'

import Button from 'src/components/ui/Button'

export type Props = {
  editor: Editor,
  value: Value,
}

const FORMATS = ['strong', 'emphasis', 'underline', 'superscript', 'subscript']

export default class FormatTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props

    if ((editor as EditorAug).isVoid(value.startBlock)) {
      return null
    }

    const list = (editor as EditorAug).getCurrentList(value)

    return <div className="toolbox-format">
      <select onChange={this.changeTextType} value={value.startBlock.type}>
        <option value="paragraph">
          {i18n.t("Editor.format.textType.paragraph")}
        </option>
        <option value="header">
          {i18n.t("Editor.format.textType.header")}
        </option>
      </select>
      {FORMATS.map(format => (
        <Button key={format} clickHandler={this.applyFormat(format)}>
          <Trans i18nKey={"Editor.format." + format} />
        </Button>
      ))}
      <Button isDisabled={value.activeMarks.isEmpty()} clickHandler={this.clear}>
        <Trans i18nKey="Editor.format.clear" />
      </Button>
      <Button isDisabled={list !== null} clickHandler={this.formatList}>
        <Trans i18nKey="Editor.format.list" />
      </Button>
    </div>
  }

  private changeTextType = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const { editor, value } = this.props
    editor.setNodeByKey(value.startBlock.key, { type: ev.target.value })
  }

  // TODO: This should be a single callback, and take format from
  // ev.target.dataset. It is not because it's currently impossible to set data-
  // attributes on <Button>.
  private applyFormat = (format: string) => (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    this.props.editor.addMark(format)
  }

  private clear = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    ;(this.props.editor as EditorAug).removeMarks()
  }

  private formatList = () => {
    ;(this.props.editor as EditorAug).wrapInList('ul_list')
  }
}
