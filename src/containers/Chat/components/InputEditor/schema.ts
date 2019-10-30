import { Block, Editor, SlateError } from 'slate'

import { VALID_URL_PATTERN } from 'src/helpers/isValidUrl'

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

function normalizeHyperLink(editor: Editor, error: SlateError) {
  console.warn('Unhandled hyperlink error', error.code)
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
    hyperlink: {
      data: {
        url: (u: any) => VALID_URL_PATTERN.test(u),
      },
      normalize: normalizeHyperLink,
    },
    mention: {
      isVoid: true,
    },
  },
  annotations: {
    [CONTEXT_ANNOTATION_TYPE]: {
      isAtomic: true,
    },
  },
}
