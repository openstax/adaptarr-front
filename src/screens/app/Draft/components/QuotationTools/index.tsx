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

  // Allow switching types only for first node.
  const { selection } = value
  const first = quotation.nodes.first()
  let isSelectionInFirstNode = selection.start.isInNode(first) && selection.end.isInNode(first)

  return (
    <ToolGroup
      title="editor-tools-quotation-title"
      toggleState={toggleState}
      onToggle={() => onToggle('quotationTools')}
    >
      {
        isSelectionInFirstNode ?
          <SwitchableTypes editor={editor} value={value} />
        : null
      }
    </ToolGroup>
  )
}
