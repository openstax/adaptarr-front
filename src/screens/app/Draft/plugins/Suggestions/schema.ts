import { Editor, SlateError } from 'slate'

function normalizeSuggestionInsert(editor: Editor, error: SlateError) {
  const { code, child, node } = error

  switch(code) {
    case 'child_type_invalid':
      if (child.type === 'suggestion_delete') {
        editor.removeNodeByKey(child.key)
      } else {
        const path = editor.value.document.getPath(child.key)
        editor.unwrapChildrenByPath(path)
      }
      break

    case 'node_text_invalid':
      editor.removeNodeByKey(node.key)
      break

    default:
      console.warn('Unhandled suggestion insert violation:', error.code)
      break
  }
}

function normalizeSuggestionRemove(editor: Editor, error: SlateError) {
  const { code, child, node } = error

  switch(code) {
    case 'child_type_invalid':
      if (child.type === 'suggestion_insert') {
        editor.removeNodeByKey(child.key)
        break
      }

      const path = editor.value.document.getPath(child.key)
      editor.unwrapChildrenByPath(path)
      break

    case 'node_text_invalid':
      editor.removeNodeByKey(node.key)
      break

    default:
      console.warn('Unhandled suggestion remove violation:', error.code)
  }
}

export type SchemaOptions = { allowedInlines?: string[] }

export default function make_schema({ allowedInlines = [] }: SchemaOptions) {
  const allowedTypes = allowedInlines.map(type => ({ type }))

  return {
    inlines: {
      suggestion_insert: {
        nodes: [{ match: [...allowedTypes, { object: 'text' }] }],
        normalize: normalizeSuggestionInsert,
        text: (t: string) => t.length > 0,
      },
      suggestion_delete: {
        nodes: [{ match: [...allowedTypes, { object: 'text' }] }],
        normalize: normalizeSuggestionRemove,
        text: (t: string) => t.length > 0,
      },
    },
  }
}