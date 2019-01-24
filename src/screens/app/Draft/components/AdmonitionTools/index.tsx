import * as React from 'react'
import { Block, BlockProperties, Editor, Value } from 'slate'
import { EditorAug } from 'cnx-designer'

import i18n from 'src/i18n'

import ToolGroup from '../ToolGroup'

const TYPES = ["note", "warning", "tip", "important"]

export type Props = {
  editor: Editor,
  value: Value,
}

export default function AdmonitionTools({ editor, value }: Props) {
  const admonition = (editor as EditorAug).getActiveAdmonition(value)

  if (admonition === null) return null

  function onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    editor.setNodeByKey(admonition!.key, {
      data: { type: ev.target.value },
    } as unknown as BlockProperties)
  }

  return (
    <ToolGroup title="Editor.admonition.groupTitle">
      <select onChange={onChange} value={admonition.data.get('type')}>
        {TYPES.map(type => (
          <option key={type} value={type}>
            {i18n.t("Editor.admonition.type." + type)}
          </option>
        ))}
      </select>
    </ToolGroup>
  )
}
