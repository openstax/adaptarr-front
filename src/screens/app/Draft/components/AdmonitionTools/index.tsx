import * as React from 'react'
import Select from 'react-select'
import { BlockProperties, Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Classes from '../Classes'

import { OnToggle } from '../ToolboxDocument'

const ADMONITIONS_TYPES: string[] = ['note', 'warning', 'tip', 'important']

interface AdmonitionToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

function AdmonitionTools({ editor, value, toggleState, onToggle }: AdmonitionToolsProps) {
  const admonition = editor.getActiveAdmonition(value)

  if (admonition === null) return null

  function onChange({ value }: {value: string, label: string}) {
    editor.setNodeByKey(admonition!.key, {
      data: { type: value },
    } as unknown as BlockProperties)
  }

  const onClickToggle = () => {
    onToggle('admonitionTools')
  }

  const admonitionType = admonition.data.get('type')

  return (
    <ToolGroup
      title="editor-tools-admonition-title"
      toggleState={toggleState}
      onToggle={onClickToggle}
    >
      <Select
        className="toolbox__select react-select"
        value={{ value: admonitionType, label: admonitionType }}
        onChange={onChange}
        options={ADMONITIONS_TYPES.map(t => ({ value: t, label: t }))}
        formatOptionLabel={OptionLabel}
      />
      <Classes editor={editor} block={admonition} />
    </ToolGroup>
  )
}

export default AdmonitionTools

function OptionLabel({ value: type }: {value: string, label: string}) {
  return <Localized id="editor-tools-admonition-type" $type={type}>{type}</Localized>
}
