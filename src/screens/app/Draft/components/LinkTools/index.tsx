import * as React from 'react'
import { Editor, Value, Inline } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Input from 'src/components/ui/Input'
import Icon from 'src/components/ui/Icon'
import Button from 'src/components/ui/Button'

import { OnToggle } from '../ToolboxDocument'

import './index.css'

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class LinkTools extends React.Component<Props> {
  state: {
    isUrlValid: boolean
  } = {
    isUrlValid: true,
  }

  private onChange = (val: string) => {
    const link = this.getActiveLink()
    if (!link) return

    if (!this.validateUrl(val)) return

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

  private validateUrl = (url: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    const isValid = !!pattern.test(url)
    return isValid
  }

  render() {
    const link = this.getActiveLink()
    if (!link) return null

    return (
      <ToolGroup
        title="editor-tools-link-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('linkTools')}
      >
        <Input
          l10nId="editor-tools-link-url"
          value={link.data.get('url')}
          onChange={this.onChange}
          validation={{ custom: this.validateUrl }}
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
