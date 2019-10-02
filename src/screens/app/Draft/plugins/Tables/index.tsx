import { Plugin } from 'slate-react'

import renderBlock from './render'
import schema from './schema'
import * as queries from './queries'

const TablesPlugin = {
  queries,
  schema,
  renderBlock,
} as unknown as Plugin

export default TablesPlugin
