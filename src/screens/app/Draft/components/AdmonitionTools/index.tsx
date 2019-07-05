import * as React from 'react'
import Select from 'react-select'
import { Block, BlockProperties, Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Classes from '../Classes'
import SwitchableTypes from '../SwitchableTypes'

import { OnToggle } from '../ToolboxDocument'

const ADMONITIONS_TYPES: string[] = ['note', 'warning', 'tip', 'important']

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default function AdmonitionTools({ editor, value, toggleState, onToggle }: Props) {
  const admonition = editor.getActiveAdmonition(value)

  if (admonition === null) return null

  function onChange({value}: {value: string, label: string}) {
    editor.setNodeByKey(admonition!.key, {
      data: { type: value },
    } as unknown as BlockProperties)
  }

  const admonitionType = admonition.data.get('type')
  // Allow switching types only for first node.
  const { selection } = value
  const first = admonition.nodes.first()
  let isSelectionInFirstNode = selection.start.isInNode(first) && selection.end.isInNode(first)

  return (
    <ToolGroup
      title="editor-tools-admonition-title"
      toggleState={toggleState}
      onToggle={() => onToggle('admonitionTools')}
    >
      <Select
        className="toolbox__select react-select"
        value={{value: admonitionType, label: admonitionType}}
        onChange={onChange}
        options={ADMONITIONS_TYPES.map(t => {return {value: t, label: t}})}
        formatOptionLabel={OptionLabel}
      />
      {
        isSelectionInFirstNode ?
          <SwitchableTypes editor={editor} value={value} />
        : null
      }
      <Classes editor={editor} block={admonition} />
    </ToolGroup>
  )
}

function OptionLabel({value: type}: {value: string, label: string}) {
  return <Localized id="editor-tools-admonition-type" $type={type}>{type}</Localized>
}
