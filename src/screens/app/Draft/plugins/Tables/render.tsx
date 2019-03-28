import * as React from 'react'
import { Editor } from 'slate'
import { RenderNodeProps } from 'slate-react'

export default function renderNode(props: RenderNodeProps, _: Editor, next: () => any) {
  switch (props.node.type) {
    case 'table':
      return <TableNode name="adr-table" props={props} />

    case 'table_title':
      return <TableNode name="adr-title" props={props} />

    case 'table_caption':
      return <TableNode name="adr-caption" props={props} />

    case 'table_tgroup':
      return <TableNode name="adr-tgroup" props={props} />

    case 'table_colspec':
      return <TableNode name="adr-colspec" props={props} />
    
    case 'table_spanspec':
      return <TableNode name="adr-spanspec" props={props} />

    case 'table_thead':
      return <TableNode name="adr-thead" props={props} />

    case 'table_tbody':
      return <TableNode name="adr-tbody" props={props} />

    case 'table_tfoot':
      return <TableNode name="adr-tfoot" props={props} />

    case 'table_row':
      return <TableNode name="adr-row" props={props} />
    
    case 'table_entry':
      return <TableNode name="adr-entry" props={props} />

    default:
      return next()
  }
}

type TableNodeProps = {
  name: string
  props: RenderNodeProps
}

const TableNode = ({ name, props: { node, attributes, children } }: TableNodeProps) => {
  return (
    <div
      className={name}
      {...attributes}
      {...node.data.toJS()}
    >
      {children}
    </div>
  )
}
