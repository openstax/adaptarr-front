import { Editor, Node, Inline, Path } from 'slate'

import { SUGGESTION_TYPES } from './types'

/**
 * Create a schema definition with rules to normalize suggestions
 */
function normalizeNode(node: Node, editor: Editor, next: () => any) {
  if (node.object === 'inline' && SUGGESTION_TYPES.includes(node.type)) {
    const { document } = editor.value

    const descendantSuggestions: Iterable<[Inline, Path]> = (node as any).inlines({
        onlyTypes: SUGGESTION_TYPES
      })

    let nestedSuggestions: Inline[] = []
    for (const descendant of descendantSuggestions) {
      const [suggestion, _] = descendant
      nestedSuggestions.push(suggestion)
    }

    if (nestedSuggestions.length === 0) {
      return next()
    }

    return () => editor.withoutNormalizing(() => {
      nestedSuggestions.forEach(sugg => {
        const ancestors: Iterable<[Node, Path]> = (document as any).ancestors(document.getPath(sugg.key))
        removeNestedSuggestions(editor, sugg, ancestors)
      })
    })
  }

  if (node.object !== 'document' && node.object !== 'block' && node.object !== 'inline') {
    return next()
  }

  const invalids: (Inline[] | null)[] = node.nodes.toArray()
    .map((child, i) => {
      if (child.object === 'text' || !SUGGESTION_TYPES.includes(child.type)) return null

      const next = node.nodes.get(i + 1)
      const nextIsEmptyText = next ? (next.object === 'text' ? next.text === '' : false) : false
      const nextNext = node.nodes.get(i + 2)
      const nextNextIsSameInline = nextNext && nextNext.object === 'inline' ? (nextNext.type === child.type) : false

      if (!nextIsEmptyText || !nextNextIsSameInline) return null

      return [child as Inline, nextNext as Inline]
    })
    .filter(Boolean)

  if (invalids.length === 0) {
    return next()
  }

  /**
   * Join the suggestions pairs
   */
  // We join in reverse order, so that multiple suggestions folds onto the first one
  return () => editor.withoutNormalizing(() => {
      invalids.reverse().forEach(pair => {
        const [first, second] = pair
        const updatedSecond = editor.value.document.getDescendant(second.key)! as Inline
        updatedSecond.nodes.forEach((secondNode, index) => {
          editor.moveNodeByKey(
              secondNode!.key,
              first.key,
              first.nodes.size + index!
            )
        })
        editor.removeNodeByKey(second.key)
    })
  })
}

export default normalizeNode

/**
 * Handle nested suggestions depends on their parents.
 *
 * It may occur when user remove few characters inside <term> and then will wrap
 * whole term in remove suggestion.
 */
function removeNestedSuggestions(editor: Editor, node: Inline, ancestors: Iterable<[Node, Path]>) {
  for (const ancestor of ancestors) {
    const [parent, _] = ancestor
    // There can't be more suggestions above this ancestor.
    if (parent.object === 'block') break

    if (parent.object === 'inline' && SUGGESTION_TYPES.includes(parent.type)) {
      const parentType = parent.type.split('_')[1]
      if (node.type === 'suggestion_insert') {
        if (parentType === 'insert') {
          const path = editor.value.document.getPath(node.key)
          editor.unwrapChildrenByPath(path)
        } else if (parentType === 'delete') {
          editor.removeNodeByKey(node.key)
        }
      } else if (node.type === 'suggestion_delete') {
        if (parentType === 'delete') {
          editor.removeNodeByKey(node.key)
        } else if (parentType === 'delete') {
          const path = editor.value.document.getPath(node.key)
          editor.unwrapChildrenByPath(path)
        }
      }
    }
  }
}