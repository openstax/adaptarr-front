import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Input from 'src/components/ui/Input'

type Props = {
  onAccept: (text: string, url: string) => any
}

class LinkBox extends React.Component<Props> {
  state: {
    text: string
    url: string
    isUrlValid: boolean
  } = {
    text: '',
    url: '',
    isUrlValid: false,
  }

  private handleTextChange = (val: string) => {
    this.setState({ text: val })
  }

  private handleUrlChange = (val: string) => {
    this.setState({ url: val }, this.validateUrl)
  }

  private onAccept = () => {
    const { text, url } = this.state
    this.props.onAccept(text.trim() ? text : url, url)
  }

  private validateUrl = () => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    this.setState({ isUrlValid: !!pattern.test(this.state.url) })
  }

  public render() {
    const { text, url, isUrlValid } = this.state

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
              validation={{custom: () => isUrlValid}}
            />
          </label>
          <input className="button" type="submit" value="Accept" disabled={!isUrlValid} />
        </form>
      </div>
    )
  }
}

export default LinkBox
