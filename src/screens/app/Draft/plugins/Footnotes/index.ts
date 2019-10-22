import { Plugin } from 'slate-react'

import { onClick, onKeyDown } from './handlers'
import schema from './schema'
import renderInline from './render'

const Footnotes = (options?: any): Plugin => ({
  onClick,
  onKeyDown,
  schema,
  renderInline,
})

export default Footnotes
