import { Plugin } from 'slate-react'

import { renderBlock, renderInline } from './render'
import make_schema, { SchemaOptions } from './schema'
import onKeyDown from './handlers'

import { SUGGESTION_TYPES } from '../Suggestions/types'

const SourceElements = ({ inlines = [] }: SchemaOptions): Plugin => {
  const inls = [
    ...inlines,
    ...SUGGESTION_TYPES,
  ]

  return {
    schema: make_schema({ inlines: inls }),
    renderBlock,
    renderInline,
    onKeyDown,
  } as unknown as Plugin
}

export default SourceElements
