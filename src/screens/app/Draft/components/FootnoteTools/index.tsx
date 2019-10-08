import * as React from 'react'
import { Document, Editor, Inline, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Button from 'src/components/ui/Button'

import { OnToggle } from '../ToolboxDocument'

interface FootnoteToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class FootnoteTools extends React.Component<FootnoteToolsProps> {
  private onClickToggle = () => {
    this.props.onToggle('footnoteTools')
  }

  render() {
    const footnote = this.getActiveFootnote()
    if (!footnote) return null
    const collapsed = footnote.data.get('collapse')

    return (
      <ToolGroup
        title="editor-tools-footnote-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        {
          collapsed ?
            <Button clickHandler={this.showText}>
              <Localized id="editor-tools-footnote-show">
                Show content
              </Localized>
            </Button>
            :
            <Button clickHandler={this.hideText}>
              <Localized id="editor-tools-footnote-hide">
                Hide content
              </Localized>
            </Button>
        }
      </ToolGroup>
    )
  }

  private getActiveFootnote = (): Inline | null => {
    const { document, selection: { start } } = this.props.value

    if (!start.path) return null

    let node: Document | Inline = document
    for (const index of start.path as unknown as Iterable<number>) {
      node = node.nodes.get(Number(index)) as Inline

      if (node.type === 'footnote') {
        return node
      }
    }

    return null
  }

  private showText = () => {
    const footnote = this.getActiveFootnote()
    if (!footnote) return
    const newData = footnote.data.set('collapse', false)
    this.props.editor.setNodeByKey(footnote.key, {
      type: 'footnote',
      data: newData,
    })
  }

  private hideText = () => {
    const footnote = this.getActiveFootnote()
    if (!footnote) return
    const newData = footnote.data.set('collapse', true)
    this.props.editor.setNodeByKey(footnote.key, {
      type: 'footnote',
      data: newData,
    })
  }
}
