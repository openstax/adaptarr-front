import * as React from 'react'
import Select from 'react-select'
import { Block, BlockProperties, Editor, Value } from 'slate'

import i18n from 'src/i18n'

import ToolGroup from '../ToolGroup'

type AdmonitionType = { value: string, label: string}

const ADMONITIONS_TYPES: AdmonitionType[] = [
  { value: 'note', label: i18n.t('Editor.admonition.type.note') },
  { value: 'warning', label: i18n.t('Editor.admonition.type.warning') },
  { value: 'tip', label: i18n.t('Editor.admonition.type.tip') },
  { value: 'important', label: i18n.t('Editor.admonition.type.important') },
]

export type Props = {
  editor: Editor,
  value: Value,
}

export default function AdmonitionTools({ editor, value }: Props) {
  const admonition = editor.getActiveAdmonition(value)

  if (admonition === null) return null

  function onChange({ value }: AdmonitionType) {
    editor.setNodeByKey(admonition!.key, {
      data: { type: value },
    } as unknown as BlockProperties)
  }

  return (
    <ToolGroup title="Editor.admonition.groupTitle">
      <Select
        className="toolbox__select"
        value={{ value: admonition.data.get('type'), label: i18n.t(`Editor.admonition.type.${admonition.data.get('type')}`) }}
        onChange={onChange}
        options={ADMONITIONS_TYPES}
      />
    </ToolGroup>
  )
}
