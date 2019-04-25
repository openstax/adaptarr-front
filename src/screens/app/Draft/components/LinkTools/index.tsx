import * as React from 'react'
import { Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Input from 'src/components/ui/Input'
import Icon from 'src/components/ui/Icon'
import Button from 'src/components/ui/Button'

import './index.css'

export type Props = {
  editor: Editor,
  value: Value,
}

export default class DocumentTools extends React.Component<Props> {

  private onChange = (val: string) => {
    const link = this.getActiveLink()
    if (!link) return

    let newLink = {
      type: 'link',
      data: {
        url: val,
      }
    }

    this.props.editor.setNodeByKey(link.key, newLink)
  }

  private removeLink = () => {
    const link = this.getActiveLink()
    if (!link) return
    this.props.editor.unwrapInlineByKey(link.key, { type: 'link', data: link.data.toJS() })
  }

  private getActiveLink = () => {
    const { value: { startInline } } = this.props
    return startInline && startInline.type === 'link' ? startInline : null
  }

  render() {
    const link = this.getActiveLink()
    if (!link) return null

    return (
      <ToolGroup title="editor-tools-link-title">
        <Input
          l10nId="editor-tools-link-url"
          value={link.data.get('url')}
          onChange={this.onChange}
        />
        <Button
          className="link__button"
          clickHandler={this.removeLink}
        >
          <Icon name="close" />
          <Localized id="editor-tools-link-remove">
            Remove link
          </Localized>
        </Button>
      </ToolGroup>
    )
  }
}
