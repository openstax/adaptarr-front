import * as React from 'react'
import { Value, Editor as CoreEditor } from 'slate'
import { Editor as SlateEditor } from 'slate-react'
import { Localized } from 'fluent-react/compat'

import { Conversation } from 'src/api'

import SCHEMA from './schema'
import serialize from './serialize'
import { renderBlock, renderMark, renderInline } from './render'

import './index.css'

const INITIAL = Value.fromJSON({})

type Props = {
  socket: Conversation
}

class InputEditor extends React.Component<Props> {
  state: {
    value: Value
  } = {
    value: INITIAL,
  }

  public focus() {
    this.editor.current!.focus()
  }

  sendMessage() {
    this.props.socket.sendMessage(serialize(this.state.value))
    this.setState({ value: INITIAL })
  }

  componentDidMount() {
    this.focus()
  }

  editor: React.RefObject<SlateEditor> = React.createRef()

  render() {
    const { value } = this.state

    return (
      <div className="chat__input-editor">
        <Localized id="chat-input-placeholder" attrs={{placeholder: true}}>
          <SlateEditor
            ref={this.editor}
            schema={SCHEMA}
            value={value}
            placeholder="Type your message"
            autoFocus={true}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderBlock={renderBlock}
            renderMark={renderMark}
            renderInline={renderInline}
          />
        </Localized>
      </div>
    )
  }

  onChange = ({ value }: { value: Value }) => this.setState({ value })

  onKeyDown = (event: KeyboardEvent, editor: CoreEditor, next: () => any) => {
    if (event.shiftKey) {
      return next()
    }

    if (event.key === 'Enter') {
      this.sendMessage()
    }

    if (event.ctrlKey) {
      switch (event.key) {
      case 'i':
        event.preventDefault()
        editor.toggleMark('emphasis')
        break

      case 'b':
        event.preventDefault()
        editor.toggleMark('strong')
        break

      default:
        return next()
      }
    } else {
      return next()
    }
  }
}

export default InputEditor
