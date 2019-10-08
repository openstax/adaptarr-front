import { Editor, InlineProperties, SlateError } from 'slate'

function normalizeFootnoteData(editor: Editor, error: SlateError) {
  switch (error.code) {
  case 'node_data_invalid': {
    const newData = error.node.data.set('collapse', false)
    editor.setNodeByKey(error.node.key, { data: newData } as InlineProperties)
    break
  }

  default:
    console.warn('Unhandled footnote violation:', error)
  }
}

export default {
  inlines: {
    footnote: {
      data: {
        collapse: (c: any) => typeof c === 'boolean',
      },
      normalize: normalizeFootnoteData,
    },
  },
}
