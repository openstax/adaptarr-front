import * as React from 'react'
import { Value, Editor as CoreEditor, Block, Inline, Text, Annotation } from 'slate'
import { Editor as SlateEditor } from 'slate-react'
import { Localized } from 'fluent-react/compat'

import { Conversation, User } from 'src/api'

import SCHEMA from './schema'
import serialize from './serialize'
import { renderBlock, renderMark, renderInline, renderAnnotation } from './render'

import Suggestions from '../Suggestions'

import './index.css'

export const CONTEXT_ANNOTATION_TYPE = 'mentionContext'
const CAPTURE_MENTIONS_REGEXP = /\B@\w+$/

const INITIAL = Value.fromJSON({})

type Props = {
  socket: Conversation
}

class InputEditor extends React.Component<Props> {
  state: {
    value: Value
    searchQuery: string
  } = {
    value: INITIAL,
    searchQuery: '',
  }

  insertMention = (user: User) => {
    const value = this.state.value
    const inputValue = getInput(value)
    const editor = this.editor.current!

    // Delete the captured value, including the `@` symbol
    editor.deleteBackward(inputValue.length + 1)

    editor.insertInline({
      type: 'mention',
      data: { userId: user.id },
    })

    editor.moveToEndOfInline()
    editor.moveForward()

    setTimeout(() => {
      this.setState({ searchQuery: '' })
    }, 100)
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
    const { value, searchQuery } = this.state

    return (
      <>
        {
          searchQuery ?
            <Suggestions
              searchQuery={searchQuery}
              onSelect={this.insertMention}
            />
          : null
        }
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
              renderAnnotation={renderAnnotation}
            />
          </Localized>
        </div>
      </>
    )
  }

  lastInputValue: string = ''

  onChange = (change: CoreEditor) => {
    const inputValue = getInput(change.value)

    if (inputValue !== this.lastInputValue) {
      this.lastInputValue = inputValue
      const hasValAnc = hasValidAncestors(change.value)

      if (hasValAnc) {
        this.setState({ searchQuery: inputValue })
      }

      const { selection } = change.value

      let anno: Annotation | undefined = change.value.annotations.find(ann => {
        if (ann && ann.type === CONTEXT_ANNOTATION_TYPE) {
          return true
        }
        return false
      })

      let newAnno: Annotation | undefined = undefined
      if (inputValue && hasValAnc) {
        newAnno = {
          type: CONTEXT_ANNOTATION_TYPE,
          key: anno ? anno.key : getMentionKey(),
          anchor: {
            path: selection.anchor.path!,
            key: selection.start.key,
            offset: selection.start.offset - inputValue.length,
          },
          focus: {
            path: selection.focus.path!,
            key: selection.end.key,
            offset: selection.end.offset,
          },
        }
      }

      if (newAnno) {
        this.setState({ value: change.value }, () => {
          this.editor.current!.withoutSaving(() => {
            if (anno) {
              // We need to set annotations after the value flushes into the editor.
              this.editor.current!.setAnnotation(anno, newAnno!)
            } else {
              this.editor.current!.addAnnotation(newAnno!)
            }
          })
        })
        return
      }
    }

    this.setState({ value: change.value })
  }

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

function getInput(value: Value): string {
  // In some cases, like if the node that was selected gets deleted,
  // `startText` can be null.
  if (!value.startText) {
    return ""
  }

  const startOffset = value.selection.start.offset
  const textBefore = value.startText.text.slice(0, startOffset)
  const result = CAPTURE_MENTIONS_REGEXP.exec(textBefore)

  return result == null ? "" : result[0].slice(1, result[0].length)
}

function hasValidAncestors(value: Value): boolean {
  const { document, selection } = value

  // We only want mentions to live inside a paragraph.
  const parent = document.getParent(selection.start.key!)
  if (!parent || Text.isText(parent)) return false
  return (parent as Block | Inline).type === 'paragraph'
}

let n = 0
function getMentionKey() {
  return `mention_${n++}`
}
