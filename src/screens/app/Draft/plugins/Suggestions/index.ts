import { Plugin } from 'slate-react'
import { Command, Editor, Node } from 'slate'

import { renderInline } from './render'
import onCommand from './onCommand'
import make_schema from './schema'
import normalizeNode from './normalizeNode'

const ALLOWED_INLINES = ['code', 'docref', 'link', 'source_element', 'term', 'xref', 'footnote']

type Options = { isActive?: boolean, allowedInlines?: string[] }

const Suggestions = (options: Options): Plugin => {
  const { isActive = true } = options
  const allowedInlines = [
    ...(options.allowedInlines || []),
    ...ALLOWED_INLINES,
  ]

  let plugin = {
    schema: make_schema({ allowedInlines }),
    renderInline,
  } as any

  if (isActive) {
    plugin.onCommand = onCommand
    plugin.normalizeNode = normalizeNode
  }

  return plugin as Plugin
}

export default Suggestions
