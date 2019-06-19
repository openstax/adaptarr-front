import { Editor, SlateError } from 'slate'

function normalizeSourceBlock(change: Editor, error: SlateError) {
  console.warn('Unhandled source element (block) violation:', error.code)
}

function normalizeSourceInline(change: Editor, error: SlateError) {
  console.warn('Unhandled source element (inline) violation:', error.code)
}

export type SchemaOptions = { inlines?: string[] }

export default function make_schema({ inlines = [] }: SchemaOptions) {

  const allowedTypes = inlines.map(type => ({ type }))

  return {
    blocks: {
      source_element: {
        nodes: [{ match: [...allowedTypes, { object: 'text' }] }],
        normalize: normalizeSourceBlock,
      },
    },
    inlines: {
      source_element: {
        nodes: [{ match: [...allowedTypes, { object: 'text' }] }],
        normalize: normalizeSourceInline,
      }
    }
  }
}