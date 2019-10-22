import * as React from 'react'
import { Editor as CoreEditor } from 'slate'
import {
  RenderAnnotationProps,
  RenderBlockProps,
  RenderInlineProps,
  RenderMarkProps,
} from 'slate-react'

import Mention from '../Mention'

import { CONTEXT_ANNOTATION_TYPE } from '../InputEditor'

export function renderBlock(props: RenderBlockProps, editor: CoreEditor, next: () => any) {
  const { node, children, attributes } = props

  switch (node.type) {
  case 'paragraph':
    return <p {...attributes}>{children}</p>

  default:
    return next()
  }
}

export function renderMark(props: RenderMarkProps, editor: CoreEditor, next: () => any) {
  const { mark, children, attributes } = props

  switch (mark.type) {
  case 'emphasis':
    return <em {...attributes}>{children}</em>

  case 'strong':
    return <strong {...attributes}>{children}</strong>

  default:
    return next()
  }
}

export function renderInline(props: RenderInlineProps, editor: CoreEditor, next: () => any) {
  const { node, children, attributes } = props

  switch (node.type) {
  case 'hyperlink': {
    const url = node.data.get('url')
    if (url.text.length === 0) {
      return <a href={url} {...attributes}>{url}</a>
    }
    return <a href={url} {...attributes}>{children}</a>
  }

  case 'mention':
    return <Mention userId={node.data.get('userId')} />

  default:
    return next()
  }
}

export function renderAnnotation(
  props: RenderAnnotationProps,
  editor: CoreEditor,
  next: () => any
) {
  if (props.annotation.type === CONTEXT_ANNOTATION_TYPE) {
    return (
      <span {...props.attributes} className="mention-context">
        {props.children}
      </span>
    )
  }

  return next()
}
