import * as React from 'react'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import CharactersCounter from '../CharactersCounter'

import { OnToggle } from '../ToolboxGlossary'

interface GlossaryToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

const GlossaryTools = (props: GlossaryToolsProps) => {
  const onClickToggle = () => {
    props.onToggle('glossaryTools')
  }

  return (
    <ToolGroup
      title="editor-tools-glossary-title"
      toggleState={props.toggleState}
      onToggle={onClickToggle}
    >
      <CharactersCounter value={props.value} />
    </ToolGroup>
  )
}

export default GlossaryTools
