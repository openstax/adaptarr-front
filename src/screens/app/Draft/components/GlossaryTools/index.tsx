import * as React from 'react'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import CharactersCounter from '../CharactersCounter'

import { OnToggle } from '../ToolboxGlossary'

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class GlossaryTools extends React.Component<Props> {
  render() {
    return (
      <ToolGroup
        title="editor-tools-glossary-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('glossaryTools')}
      >
        <CharactersCounter value={this.props.value} />
      </ToolGroup>
    )
  }
}
