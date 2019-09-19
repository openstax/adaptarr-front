import { Command, Editor, Text, Inline, Block, Node, Document, InlineProperties } from 'slate'
import { List } from 'immutable'

import { SUGGESTION_TYPES } from './types'

const COMMANDS_TO_HANDLE = ['insertText', 'insertFragment', 'deleteCharBackward', 'deleteCharForward', 'delete', 'wrapInline', 'insertInline']
const Selection = window.getSelection()

export default function onCommand(command: Command, editor: Editor, next: () => any) {
  if (!COMMANDS_TO_HANDLE.includes(command.type)) return next()

  const { selection, startBlock } = editor.value

  const highestSuggestion: Inline | null = getHighestSuggestion(editor)

  // TODO: Handle changing marks

  switch (command.type) {
    case 'insertText':
      const textToInsert = command.args[0]
      const inlineProps = {
        type: 'suggestion_insert',
        nodes: List([Text.create(textToInsert)]),
      }

      if (!selection.isCollapsed) {
        // User want to replace current selection with new text
        editor.wrapInline('suggestion_delete')
        editor.moveToEndOfInline()
        editor.insertInline(inlineProps)
        break
      }

      if (!highestSuggestion) {
        editor.insertInline(inlineProps)
        break
      }

      if (highestSuggestion.type === 'suggestion_insert') {
        return next()
      } else if (highestSuggestion.type === 'suggestion_delete') {
        // Add new text at then end of remove suggestion
        const nextNodePath = startBlock.getPath(highestSuggestion.key)
        // getNextNode always return Node, because after Inline there is always Slate~Text
        editor.moveToStartOfNode(startBlock.getNextNode(nextNodePath)!)
        editor.insertInline(inlineProps)
        break
      }

      break

    case 'deleteCharBackward':
      if (!selection.isCollapsed) {
        editor.wrapInline('suggestion_delete')
        editor.moveToStartOfInline()
        break
      }

      if (!highestSuggestion) {
        // Check if user pressed Backspace when cursor was behind suggestion_delete
        editor.moveAnchorBackward()
        const newHighestSuggestion = getHighestSuggestion(editor)
        if (newHighestSuggestion) {
          if (newHighestSuggestion.type === 'suggestion_insert') {
            editor.moveToFocus()
            return next()
          } else if (newHighestSuggestion.type === 'suggestion_delete') {
            editor.moveToAnchor()
          }
          break
        }

        const newStartInline = editor.value.startInline
        if (newStartInline) {
          if (editor.isVoid(newStartInline)) {
            // This is always returning Node, because Inlines always have Slate~Text
            // before and after.
            const prevNode = startBlock.getPreviousNode(newStartInline.key)!
            // Insert empty text before void inline so it's not removed when we will
            // wrap it with suggestion inline.
            editor.insertNodeByKey(newStartInline.key, 0, Text.create(' '))
            editor.moveAnchorToEndOfNode(prevNode)
          } else if (!SUGGESTION_TYPES.includes(newStartInline.type)) {
            // Cursor is inside other inline like term or code
            editor.moveToAnchor()
            editor.moveAnchorForward()
            editor.wrapInline('suggestion_delete')
            editor.moveBackward(1)
            break
          }
        }

        editor.wrapInline('suggestion_delete')
        editor.moveToAnchor()
        break
      }

      const isSelectionAtStart = selection.start.isAtStartOfNode(highestSuggestion)
      if (highestSuggestion.type === 'suggestion_insert' && !isSelectionAtStart) {
        return next()
      } else if (highestSuggestion.type === 'suggestion_delete'  && !isSelectionAtStart) {
        return editor.moveBackward(1)
      }

      editor.moveAnchorBackward()
      editor.wrapInline('suggestion_delete')
      editor.moveToAnchor()
      break

    case 'deleteCharForward':
      if (!selection.isCollapsed) {
        editor.wrapInline('suggestion_delete')
        editor.moveToEndOfInline()
        break
      }

      if (!highestSuggestion) {
        // Check if user pressed Delete when cursor was before suggestion_delete
        editor.moveAnchorForward()
        const newHighestSuggestion = getHighestSuggestion(editor)
        const newStartInline = editor.value.startInline
        if (newHighestSuggestion && newHighestSuggestion.type === 'suggestion_delete') {
          editor.moveToAnchor()
          break
        }
        // If user want to remove void Node we remove it at once.
        if (newStartInline && editor.isVoid(newStartInline)) {
          // This is always returning Node, because Inlines always have Slate~Text
          // before and after.
          const nextNode = startBlock.getNextNode(newStartInline.key)!
          // Insert empty text before void inline so it's not removed when we will
          // wrap it with suggestion inline.
          editor.insertNodeByKey(newStartInline.key, 0, Text.create(' '))
          editor.moveFocusToStartOfInline()
          editor.moveAnchorToStartOfNode(nextNode)
        }

        editor.wrapInline('suggestion_delete')
        editor.moveToAnchor()
        break
      }

      if (highestSuggestion.type === 'suggestion_insert') {
        return next()
      } else if (highestSuggestion.type === 'suggestion_delete') {
        return editor.moveForward(1)
      }

      editor.moveAnchorForward()
      editor.wrapInline('suggestion_delete')
      editor.moveToAnchor()
      break

    case 'delete':
      // When cutting text
      if (!selection.isCollapsed) {
        editor.wrapInline('suggestion_delete')
        editor.moveToFocus()
      }
      break

    case 'insertFragment':
      const fragment = command.args[0]
      const nodes: List<Node> = getTextsAndInlines(fragment)
      const inline = Inline.create({
        type: 'suggestion_insert',
        nodes: nodes,
      })

      if (!selection.isCollapsed) {
        editor.wrapInline('suggestion_delete')
        editor.moveToEnd()
        const newHighestSuggestion = getHighestSuggestion(editor)
        if (newHighestSuggestion && newHighestSuggestion.type === 'suggestion_delete') {
          const nextNodePath = startBlock.getPath(newHighestSuggestion.key)
          editor.moveToStartOfNode(startBlock.getNextNode(nextNodePath)!)
        }
        editor.insertInline(inline)
        break
      }

      if (!highestSuggestion) {
        editor.insertInline(inline)
        break
      }

      if (highestSuggestion.type === 'suggestion_delete') {
        const nextNodePath = startBlock.getPath(highestSuggestion.key)
        editor.moveToStartOfNode(startBlock.getNextNode(nextNodePath)!)
        editor.insertInline(inline)
        break
      }

      editor.insertInline(inline)
      break

    case 'wrapInline':
      let wrapType
      let data

      if (typeof command.args[0] === 'string') {
        wrapType = command.args[0]
      } else if (typeof command.args[0] === 'object') {
        wrapType = command.args[0].type
        data = command.args[0].data
      }

      if (SUGGESTION_TYPES.includes(wrapType) || !wrapType) return next()

      // Replace selected fragment with text wrapped with new inline type.

      const text = Selection ? Selection.toString() : ''

      editor.wrapInline('suggestion_delete')
      editor.moveToEnd()

      const node = Inline.create({
        type: wrapType,
        data: data ? data : {},
        nodes: List([Text.create(text)]),
      })
      editor.insertInline({
        type: 'suggestion_insert',
        nodes: List([node]),
      })
      break

    case 'insertInline':
      let insertInlineProps = command.args[0] as Inline | InlineProperties

      if (!insertInlineProps || SUGGESTION_TYPES.includes(insertInlineProps.type)) return next()

      const insertInline = insertInlineProps instanceof Inline ? insertInlineProps : Inline.create(insertInlineProps)

      if (editor.isVoid(insertInline)) {
        // We have to add space before void inline. In other case it will be removed.
        editor.insertInline({
          type: 'suggestion_insert',
          nodes: List([Text.create(' '), insertInline]),
        })
      } else {
        editor.insertInline({
          type: 'suggestion_insert',
          nodes: List([insertInline]),
        })
      }
      break

    default:
      next()
      break
  }
}

function getTextsAndInlines(fragment: Document | Block) {
  let nodes: (Text | Inline)[] = []
  fragment.nodes.forEach((n: Node | undefined) => {
    if (n) {
      if (n.object === 'text' || n.object === 'inline') {
        nodes.push(n)
      } else if (n.object === 'block') {
        nodes.push(...getTextsAndInlines(n).toArray())
      }
    }
  })

  return List(nodes)
}

function getHighestSuggestion(editor: Editor) {
  const { selection, document } = editor.value

  let highestSuggestion: Inline | null = null

  if (selection.start.path) {
    highestSuggestion = document.getFurthest(selection.start.path, (n => n.object === 'inline' && SUGGESTION_TYPES.includes(n.type))) as Inline
  }

  return highestSuggestion
}
