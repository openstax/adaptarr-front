import * as React from 'react'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import Input from 'src/components/ui/Input'

export type Props = {
  editor: Editor,
  value: Value,
}

export default class DocumentTools extends React.Component<Props> {

  private onChange = (val: string) => {
    const { value: { startInline } } = this.props
    const link = startInline && startInline.type === 'link' ? startInline : null
    if (!link) return

    let newLink = {
      type: 'link',
      data: {
        url: val,
      }
    }

    this.props.editor.setNodeByKey(link.key, newLink)
  }

  render() {
    const { value: { startInline } } = this.props
    const link = startInline && startInline.type === 'link' ? startInline : null
    if (!link) return null

    return (
      <ToolGroup title="editor-tools-link-title">
        <Input
          l10nId="editor-tools-link-url"
          value={link.data.get('url')}
          onChange={this.onChange}
        />
      </ToolGroup>
    )
  }
}
