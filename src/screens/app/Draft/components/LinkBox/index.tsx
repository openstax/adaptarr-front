import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Input from 'src/components/ui/Input'
import Button from 'src/components/ui/Button'

type Props = {
  onAccept: (text: string, url: string) => any
}

class LinkBox extends React.Component<Props> {
  state: {
    text: string
    url: string
  } = {
    text: '',
    url: '',
  }

  private handleTextChange = (val: string) => {
    this.setState({ text: val })
  }

  private handleUrlChange = (val: string) => {
    this.setState({ url: val })
  }

  private onAccept = () => {
    const { text, url } = this.state
    this.props.onAccept(text, url)
  }

  public render() {
    const { text, url } = this.state

    return (
      <div className="linkbox">
        <form onSubmit={this.onAccept}>
          <label className="linkbox__text">
            <span className="linkbox__label-text">
              <Localized id="editor-tools-link-text">
                Provide text
              </Localized>
            </span>
            <Input
              type="text"
              autoFocus={true}
              value={text}
              onChange={this.handleTextChange}
            />
          </label>
          <label className="linkbox__url">
            <span className="linkbox__label-text">
              <Localized id="editor-tools-link-url">
                Provide link
              </Localized>
            </span>
            <Input
              type="text"
              value={url}
              onChange={this.handleUrlChange}
            />
          </label>
          <input className="button" type="submit" value="Accept"/>
        </form>
      </div>
    )
  }
}

export default LinkBox
