import * as React from 'react'
import { Editor, Value, Block, BlockProperties, Document, Inline, InlineProperties } from 'slate'

import ToolGroup from '../ToolGroup'
import Input from 'src/components/ui/Input'

import { OnToggle } from '../ToolboxDocument'

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class CodeTools extends React.Component<Props> {
  private onChange = (val: string) => {
    const code = this.getActiveCode()
    if (!code) return

    this.props.editor.setNodeByKey(code.key, {
        ...code,
        data: val ? { lang: val } : {},
      } as BlockProperties | InlineProperties,
    )
  }

  private getActiveCode = () => {
    const { document, selection: { start } } = this.props.value

    if (!start.path) return null

    let node: Document | Inline | Block = document
    for (const index of start.path) {
      node = node.nodes.get(+index) as Inline | Block

      if (node.type === 'code') {
        return node
      }
    }

    return null
  }

  render() {
    const code = this.getActiveCode()
    if (!code) return null

    return (
      <ToolGroup
        title="editor-tools-code-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('codeTools')}
      >
        <Input
          l10nId="editor-tools-code-lang"
          value={code.data.get('lang') || ''}
          onChange={this.onChange}
        />
      </ToolGroup>
    )
  }
}
