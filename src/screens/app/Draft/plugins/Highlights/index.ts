import { Plugin } from 'slate-react'

import schema from './schema'
import renderInline from './render'
import * as queries from './queries'

const Highlights = (): Plugin => ({
  schema,
  renderInline,
  queries,
})

export default Highlights
