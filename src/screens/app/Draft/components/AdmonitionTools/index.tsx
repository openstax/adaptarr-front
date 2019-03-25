import * as React from 'react'
import Select from 'react-select'
import { Block, BlockProperties, Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'

const ADMONITIONS_TYPES: string[] = ['note', 'warning', 'tip', 'important']

export type Props = {
  editor: Editor,
  value: Value,
}

export default function AdmonitionTools({ editor, value }: Props) {
  const admonition = editor.getActiveAdmonition(value)

  if (admonition === null) return null

  function onChange(value: string) {
    editor.setNodeByKey(admonition!.key, {
      data: { type: value },
    } as unknown as BlockProperties)
  }

  return (
    <ToolGroup title="editor-tools-admonition-title">
      <Select
        className="toolbox__select"
        value={admonition.data.get('type')}
        onChange={onChange}
        options={ADMONITIONS_TYPES}
        formatOptionLabel={OptionLabel}
      />
    </ToolGroup>
  )
}

function OptionLabel(type: string) {
  return <Localized id="editor-tools-admonition-type" $type={type} />
}
