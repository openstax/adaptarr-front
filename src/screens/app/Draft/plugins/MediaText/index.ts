import { Plugin } from 'slate-react'

import make_schema, { MediaTextOptions } from './schema'
import renderBlock from './render'

const MediaText = (options: MediaTextOptions): Plugin => ({
  schema: make_schema(options),
  renderBlock,
})

export default MediaText
