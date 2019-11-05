import { Block, Editor, Inline, SlateError } from 'slate'

import { isValidUrl } from 'src/helpers'

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
  switch (error.code) {
  case 'node_data_invalid':
    if (error.key === 'url') {
      const node = error.node as Inline
      const text = node.text
      editor.removeNodeByKey(node.key)
      editor.insertText(text)
      break
    }
    console.warn('Unhandled hyperlink node_data_invalid violation for key:', error.key)
    break

  default:
    console.warn('Unhandled hyperlink violation:', error)
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
    hyperlink: {
      data: {
        url: (u: any) => isValidUrl(u),
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
