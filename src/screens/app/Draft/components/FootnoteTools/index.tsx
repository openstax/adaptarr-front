import * as React from 'react'
import { Editor, Value, Inline } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Button from 'src/components/ui/Button'

import { OnToggle } from '../ToolboxDocument'

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class FootnoteTools extends React.Component<Props> {
  render() {
    const footnote = this.getActiveFootnote()
    if (!footnote) return null
    const collapsed = footnote.data.get('collapse')

    return (
      <ToolGroup
        title="editor-tools-footnote-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('footnoteTools')}
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
    const first = this.props.value.inlines.first()
    return first && first.type === 'footnote' ? first : null
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
