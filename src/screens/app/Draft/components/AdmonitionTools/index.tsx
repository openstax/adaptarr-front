import * as React from 'react'
import Select from 'react-select'
import { Block, BlockProperties, Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Classes from '../Classes'

const ADMONITIONS_TYPES: string[] = ['note', 'warning', 'tip', 'important']

export type Props = {
  editor: Editor,
  value: Value,
}

export default function AdmonitionTools({ editor, value }: Props) {
  const admonition = editor.getActiveAdmonition(value)

  if (admonition === null) return null

  function onChange({value}: {value: string, label: string}) {
    editor.setNodeByKey(admonition!.key, {
      data: { type: value },
    } as unknown as BlockProperties)
  }

  const admonitionType = admonition.data.get('type')

  return (
    <ToolGroup title="editor-tools-admonition-title">
      <Select
        className="toolbox__select"
        value={{value: admonitionType, label: admonitionType}}
        onChange={onChange}
        options={ADMONITIONS_TYPES.map(t => {return {value: t, label: t}})}
        formatOptionLabel={OptionLabel}
      />
      <Classes editor={editor} block={admonition} />
    </ToolGroup>
  )
}

function OptionLabel({value: type}: {value: string, label: string}) {
  return <Localized id="editor-tools-admonition-type" $type={type}>{type}</Localized>
}
