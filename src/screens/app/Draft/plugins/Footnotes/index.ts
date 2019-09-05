import { Plugin } from 'slate-react'

import { onClick, onKeyDown } from './handlers'
import schema from './schema'
import renderInline from './render'

const Footnotes = (options?: any): Plugin => {
  return {
    onClick,
    onKeyDown,
    schema,
    renderInline,
  }
}

export default Footnotes
