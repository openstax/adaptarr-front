import * as React from 'react'
import { Editor } from 'slate'
import { RenderInlineProps } from 'slate-react'

import Highlight from './Highlight'

import './index.css'

const renderInline = (
  props: RenderInlineProps,
  editor: Editor,
  next: () => any
) => {
  if (props.node.type !== 'highlight') return next()

  return <Highlight slateEditor={editor} {...props} />
}

export default renderInline
