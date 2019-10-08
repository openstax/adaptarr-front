import { Plugin } from 'slate-react'

import { renderInline } from './render'
import onCommand from './onCommand'
import make_schema from './schema'
import normalizeNode from './normalizeNode'

const ALLOWED_INLINES = ['code', 'docref', 'link', 'source_element', 'term', 'xref', 'footnote']

type Options = { isActive?: boolean, allowedInlines?: string[] }

const Suggestions = ({ allowedInlines = [], isActive = true }: Options): Plugin => {
  const inls = [
    ...allowedInlines,
    ...ALLOWED_INLINES,
  ]

  const plugin = {
    schema: make_schema({ allowedInlines: inls }),
    renderInline,
  } as any

  if (isActive) {
    plugin.onCommand = onCommand
    plugin.normalizeNode = normalizeNode
  }

  return plugin as Plugin
}

export default Suggestions
