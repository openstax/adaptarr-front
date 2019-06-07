import { Editor, SlateError } from 'slate'

function normalizeSourceBlock(change: Editor, error: SlateError) {
  console.warn('Unhandled source element (block) violation:', error.code)
}

function normalizeSourceInline(change: Editor, error: SlateError) {
  console.warn('Unhandled source element (inline) violation:', error.code)
}

export default {
  blocks: {
    source_element: {
      nodes: [{
        match: { object: 'text' }
      }],
      normalize: normalizeSourceBlock,
    },
  },
  inlines: {
    source_element: {
      nodes: [{
        match: { object: 'text' }
      }],
      normalize: normalizeSourceInline,
    }
  }
}