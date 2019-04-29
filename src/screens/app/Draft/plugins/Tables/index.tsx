import { Plugin } from 'slate-react'

import renderNode from './render'
import schema from './schema'

interface CustomPlugin extends Plugin {
  schema: object
}

const I18nPlugin: CustomPlugin = {
  schema,
  renderNode,
}

export default I18nPlugin
