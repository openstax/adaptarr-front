import { Plugin } from 'slate-react'

import { renderBlock, renderInline } from './render'
import schema from './schema'
import onKeyDown from './handlers'

interface CustomPlugin extends Plugin {
  schema: object
}

const SourceElements: CustomPlugin = {
  schema,
  renderBlock,
  renderInline,
  onKeyDown,
}

export default SourceElements
