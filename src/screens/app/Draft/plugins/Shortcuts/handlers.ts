import { Editor, Text } from 'slate'
import { isKeyHotkey } from 'is-hotkey'
import { List } from 'immutable'

const isStrongShortcut = isKeyHotkey('mod+b')
const isEmphasisShortcut = isKeyHotkey('mod+i')
const isUnderlineShortcut = isKeyHotkey('mod+u')
const isCodeShortcut = isKeyHotkey('mod+`')
const isTermShortcut = isKeyHotkey('mod+k')

export default function onKeyDown(event: KeyboardEvent, editor: Editor, next: () => any) {
  let mark

  if (isStrongShortcut(event)) {
    mark = 'strong'
  } else if (isEmphasisShortcut(event)) {
    mark = 'emphasis'
  } else if (isUnderlineShortcut(event)) {
    mark = 'underline'
  } else if (isCodeShortcut(event)) {
    event.preventDefault()
    const inline = editor.value.startInline
    if (!inline || inline.type !== 'code') {
      if (editor.value.selection.isCollapsed) {
        editor.insertInline({ type: 'code', nodes: List([Text.create(' ')]) })
        editor.moveBackward()
      } else {
        editor.wrapInline({ type: 'code' })
      }
    } else {
      editor.unwrapInlineByKey(inline.key, { type: 'code' })
    }
    return
  } else if (isTermShortcut(event)) {
    event.preventDefault()
    const inline = editor.value.startInline
    if (!inline || inline.type !== 'term') {
      editor.wrapInline({ type: 'term' })
    } else {
      editor.unwrapInlineByKey(inline.key, { type: 'term' })
    }
    return
  } else {
    return next()
  }

  event.preventDefault()
  editor.toggleMark(mark)
}
