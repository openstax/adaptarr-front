import * as React from 'react'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import SwitchableTypes from '../SwitchableTypes'

import { OnToggle } from '../ToolboxDocument'

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default function QuotationTools({ editor, value, toggleState, onToggle }: Props) {
  const quotation = editor.getActiveQuotation(value)

  if (quotation === null) return null

  return (
    <ToolGroup
      title="editor-tools-quotation-title"
      toggleState={toggleState}
      onToggle={() => onToggle('quotationTools')}
    >
      <SwitchableTypes editor={editor} value={value} />
    </ToolGroup>
  )
}
