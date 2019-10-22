import * as React from 'react'
import { Node, Text } from 'slate'

const serializeRules = {
  serialize(obj: Node, children: Element | Array<any>) {
    if (obj instanceof Text) return undefined
    const Block = BLOCK_TAGS[obj.type]
    if (!Block) return undefined

    if (Block instanceof Function) return Block(obj, children)

    return (
      <Block id={obj.key} {...obj.data.toJS()}>
        {children}
      </Block>
    )
  },
}

const BLOCK_TAGS = {
  table: 'table',
  table_title: 'title',
  table_tgroup: 'tgroup',
  table_colspec: 'colspec',
  table_thead: 'thead',
  table_tbody: 'tbody',
  table_tfoot: 'tfoot',
  table_row: 'row',
  table_entry: 'entry',
  table_caption: 'caption',
}

export default serializeRules
