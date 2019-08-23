import { Plugin } from 'slate-react'
import { Command, Editor, Node } from 'slate'

import { renderInline } from './render'
import onCommand from './onCommand'
import make_schema from './schema'
import normalizeNode from './normalizeNode'

interface CustomPlugin extends Plugin {
  schema: object
  onCommand?: (command: Command, editor: Editor, next: () => any) => any
  normalizeNode?: (node: Node, editor: Editor, next: () => any) => any
}

const ALLOWED_INLINES = ['code', 'link', 'source_element', 'term', 'xref']

type Options = { isActive?: boolean, allowedInlines?: string[] }

const Suggestions = (options: Options): CustomPlugin => {
  const { isActive = true } = options
  const allowedInlines = [
    ...(options.allowedInlines || []),
    ...ALLOWED_INLINES,
  ]

  let plugin: CustomPlugin = {
    schema: make_schema({ allowedInlines }),
    renderInline,
  }

  if (isActive) {
    plugin.onCommand = onCommand
    plugin.normalizeNode = normalizeNode
  }

  return plugin
}

export default Suggestions
