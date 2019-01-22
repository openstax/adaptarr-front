import * as React from 'react'
import { Trans } from 'react-i18next'
import { Block, Editor, Value } from 'slate'
import { EditorAug } from 'cnx-designer'

import i18n from 'src/i18n'

import Button from 'src/components/ui/Button'

import ToolGroup from '../ToolGroup'

const STYLES = ['ol_list', 'ul_list']

export type Props = {
  editor: Editor,
  value: Value,
}

export default class ListTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props
    const list = editor.query('getCurrentList', value) as unknown as Block | null

    if (list === null) return null

    return (
      <ToolGroup title="Editor.list.groupTitle">
        <select onChange={this.changeListStyle} value={list.type}>
          {STYLES.map(style => (
            <option key={style} value={style}>
              {i18n.t("Editor.list.style." + style)}
            </option>
          ))}
        </select>
        <Button clickHandler={() => (editor as EditorAug).decreaseItemDepth()}>
          <Trans i18nKey="Editor.list.decreaseLevel" />
        </Button>
        <Button clickHandler={() => (editor as EditorAug).increaseItemDepth()}>
          <Trans i18nKey="Editor.list.increaseLevel" />
        </Button>
      </ToolGroup>
    )
  }

  private changeListStyle = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    ;(this.props.editor as EditorAug).changeListType(ev.target.value)
  }
}
