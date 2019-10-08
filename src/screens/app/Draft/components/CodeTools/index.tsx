import * as React from 'react'
import { Block, BlockProperties, Document, Editor, Inline, InlineProperties, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import Input from 'src/components/ui/Input'

import { OnToggle } from '../ToolboxDocument'

interface CodeToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class CodeTools extends React.Component<CodeToolsProps> {
  private onChange = (val: string) => {
    const code = this.getActiveCode()
    if (!code) return

    this.props.editor.setNodeByKey(
      code.key,
      {
        ...code,
        data: val ? { lang: val } : {},
      } as BlockProperties | InlineProperties,
    )
  }

  private onClickToggle = () => {
    this.props.onToggle('codeTools')
  }

  private getActiveCode = () => {
    const { document, selection: { start } } = this.props.value

    if (!start.path) return null

    let node: Document | Inline | Block = document
    for (const index of start.path as unknown as Iterable<number>) {
      node = node.nodes.get(Number(index)) as Inline | Block

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
        onToggle={this.onClickToggle}
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
