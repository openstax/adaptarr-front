import * as React from 'react'
import { Editor } from 'slate'
import { RenderInlineProps } from 'slate-react'

function renderInline(
  { node, children, attributes }: RenderInlineProps,
  editor: Editor,
  next: () => any
) {
  if (node.type !== 'footnote') return next()

  let className = 'footnote'
  const collapse = node.data.get('collapse')
  if (collapse) {
    className += ' collapse'
  }

  return <span className={className} {...attributes}>{children}</span>
}

export default renderInline
