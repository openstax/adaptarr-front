import * as React from 'react'
import { Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import { isValidUrl } from 'src/helpers'

import ToolGroup from '../ToolGroup'
import Input from 'src/components/ui/Input'
import Button from 'src/components/ui/Button'

import { OnToggle } from '../ToolboxDocument'

import './index.css'

interface LinkToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class LinkTools extends React.Component<LinkToolsProps> {
  private onChange = (val: string) => {
    const link = this.getActiveLink()
    if (!link) return

    if (!isValidUrl(val)) return

    const newLink = {
      type: 'link',
      data: {
        url: val,
      },
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

  private onClickToggle = () => {
    this.props.onToggle('linkTools')
  }

  render() {
    const link = this.getActiveLink()
    if (!link) return null

    return (
      <ToolGroup
        title="editor-tools-link-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <Input
          l10nId="editor-tools-link-url"
          value={link.data.get('url')}
          onChange={this.onChange}
          validation={{ custom: isValidUrl }}
        />
        <Button
          className="link__button"
          clickHandler={this.removeLink}
        >
          <Localized id="editor-tools-link-remove">
            Remove link
          </Localized>
        </Button>
      </ToolGroup>
    )
  }
}
