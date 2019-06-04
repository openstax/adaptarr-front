import { Plugin } from 'slate-react'

import renderBlock from './render'
import schema from './schema'

interface CustomPlugin extends Plugin {
  schema: object
}

const I18nPlugin: CustomPlugin = {
  schema,
  renderBlock,
}

export default I18nPlugin
