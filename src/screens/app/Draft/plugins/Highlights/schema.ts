import { Editor, SlateError, InlineProperties, Data } from 'slate'

export type HighlightColor =
  'lightblue' |
  'green' |
  'red' |
  'yellow'

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  'lightblue',
  'green',
  'red',
  'yellow',
]

function normalizeHighlight(editor: Editor, error: SlateError) {
  const { code, node, key } = error

  switch (code) {
  case 'node_data_invalid':
    let newData: Data

    if (key === 'color') {
      newData = node.data.set('color', 'red')
    } else if (key === 'text') {
      newData = node.data.set('text', '')
    } else if (key === 'user') {
      const dataUser = node.data.get('user')
      if (Number(dataUser)) {
        newData = node.data.set('user', Number(node.data.get('user')))
      } else {
        console.warn(`Unhandled case for key: user in node_data_invalid for highlight`)
        return
      }
    } else {
      console.warn(`Unhandled key: ${key} in node_data_invalid for highlight`)
      return
    }

    editor.setNodeByKey(node.key, { data: newData } as InlineProperties)
    break

  default:
    console.warn('Unhandled highlight violation:', error)
  }
}

export default {
  inlines: {
    highlight: {
      data: {
        color: (c: HighlightColor) => HIGHLIGHT_COLORS.includes(c),
        text: (t: string) => typeof t === 'string',
        user: (n: number) => typeof n === 'number',
      },
      normalize: normalizeHighlight,
    }
  }
}
