import { Editor } from 'slate'

export default function onKeyDown(event: KeyboardEvent, change: Editor, next: () => any) {
  switch (event.key) {
  case 'Enter':
    return onEnter(event, change) || next()

  case 'Backspace':
    return onBackspace(event, change) || next()

  default:
    return next()
  }
}

function onEnter(event: KeyboardEvent, change: Editor) {
  const { value } = change

  const sourceBlock = value.startBlock && value.startBlock.type === 'source_element'
  const sourceInline = value.startInline && value.startInline.type === 'source_element'
  if (!sourceBlock && !sourceInline) return false

  // Add new line
  if (event.shiftKey) {
    change.insertText('\n')
    return true
  }

  const { selection, startBlock, startInline } = value

  let isAtEnd = false
  let lastNodeIsEmpty = false

  if (sourceBlock) {
    isAtEnd = selection.start.isAtEndOfNode(startBlock)
    && selection.end.isAtEndOfNode(startBlock)

    const lastNode = startBlock.getText().split(/\r?\n/)
      .pop()
    lastNodeIsEmpty = lastNode ? lastNode.replace(/\s+/g, '') === '' : true
  } else if (sourceInline) {
    isAtEnd = selection.start.isAtEndOfNode(startInline)
    && selection.end.isAtEndOfNode(startInline)

    const lastNode = startInline.getText().split(/\r?\n/)
      .pop()
    lastNodeIsEmpty = lastNode ? lastNode.replace(/\s+/g, '') === '' : true
  }

  // Add new paragraph and unwrap block
  if (isAtEnd && lastNodeIsEmpty) {
    // remove last \n
    change.deleteBackward(1)
    change.insertBlock('paragraph')
    if (sourceBlock) {
      change.unwrapBlock('source_element')
      return true
    } else if (sourceInline) {
      change.unwrapInline('source_element')
      return true
    }
  }

  // Just add newline
  change.insertText('\n')
  return true
}

function onBackspace(event: KeyboardEvent, change: Editor) {
  const { value } = change

  const sourceBlock = value.startBlock && value.startBlock.type === 'source_element'
  const sourceInline = value.startInline && value.startInline.type === 'source_element'
  if (!sourceBlock && !sourceInline) return false

  const { selection, startBlock, startInline } = value

  let isAtStart = false

  if (sourceBlock) {
    isAtStart = selection.start.isAtStartOfNode(startBlock)
    && selection.end.isAtStartOfNode(startBlock)
  } else if (sourceInline) {
    isAtStart = selection.start.isAtStartOfNode(startInline)
    && selection.end.isAtStartOfNode(startInline)
  }

  // Unwrap first line from block and marge it with element above
  if (isAtStart) {
    // Split source_element at first \n
    let texts = ['']
    if (sourceBlock) {
      texts = startBlock.getText().split(/\r?\n/)
      change.removeNodeByKey(startBlock.key)
    } else if (sourceInline) {
      texts = startInline.getText().split(/\r?\n/)
      change.removeNodeByKey(startInline.key)
    }

    // Take first line and add it to element before.
    const firstText = texts.shift() || ''
    change.insertText(firstText)

    // If there is still some text then create source_element with it.
    if (texts.length) {
      if (sourceBlock) {
        change.insertBlock({ type: 'source_element' })
      } else if (sourceInline) {
        change.insertInline({ type: 'source_element' })
      }
      change.insertText(texts.join('\n'))
    }
    // Move cursor before text which was splitted.
    change.moveToEndOfPreviousBlock()
    change.moveBackward(firstText.length)
    return true
  }

  return false
}
