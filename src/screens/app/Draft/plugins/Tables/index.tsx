import { Plugin } from 'slate-react'

import renderBlock from './render'
import schema from './schema'
import * as queries from './queries'

interface CustomPlugin extends Plugin {
  schema: object
  queries: { [key: string]: any }
}

const TablesPlugin: CustomPlugin = {
  queries,
  schema,
  renderBlock,
}

export default TablesPlugin
