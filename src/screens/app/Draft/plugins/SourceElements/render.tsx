import * as React from 'react'
import { Editor } from 'slate'
import { RenderBlockProps, RenderInlineProps } from 'slate-react'

export function renderBlock({
    node,
    children,
    attributes,
  }: RenderBlockProps, _: Editor, next: () => any) {
  if (node.type === 'source_element') {
    return <div className="source source--block" {...attributes}>
      {children}
    </div>
  }

  return next()
}

export function renderInline({
  node,
  children,
  attributes,
}: RenderInlineProps, _: Editor, next: () => any) {
  if (node.type === 'source_element') {
    return <span className="source source--inline" {...attributes}>
      {children}
    </span>
  }

  return next()
}