import * as React from 'react'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'

import { OnToggle } from '../ToolboxDocument'

interface QuotationToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

function QuotationTools({ editor, value, toggleState, onToggle }: QuotationToolsProps) {
  const quotation = editor.getActiveQuotation(value)

  if (quotation === null) return null

  const onClickToggle = () => {
    onToggle('quotationTools')
  }

  return (
    <ToolGroup
      title="editor-tools-quotation-title"
      toggleState={toggleState}
      onToggle={onClickToggle}
    >
      Not implemented!
    </ToolGroup>
  )
}

export default QuotationTools
