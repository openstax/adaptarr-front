import { Editor, SlateError, Block } from 'slate'

import { CONTEXT_ANNOTATION_TYPE } from '../InputEditor'

function normalizeDocument(editor: Editor, error: SlateError) {
  switch (error.code) {
  case 'child_min_invalid':
    editor.insertNodeByKey(error.node.key, 0, Block.create('paragraph'))
    break

  default:
    console.warn('Unhandled document violation:', error)
    break
  }
}

export default {
  document: {
    nodes: [
      {
        match: { type: 'paragraph' },
        min: 1,
      },
    ],
    normalize: normalizeDocument,
  },
  inlines: {
    link: {
    },
    mention: {
      isVoid: true,
    },
  },
  annotations: {
    [CONTEXT_ANNOTATION_TYPE]: {
      isAtomic: true,
    }
  },
}
