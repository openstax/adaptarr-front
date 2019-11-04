import * as React from 'react'
import { Editor } from 'slate'
import { RenderBlockProps } from 'slate-react'

function renderBlock(
  { node, children, attributes }: RenderBlockProps,
  editor: Editor,
  next: () => any
) {
  if (node.type !== 'media_text') return next()

  return <div className="media-text" {...attributes}>{children}</div>
}

export default renderBlock
