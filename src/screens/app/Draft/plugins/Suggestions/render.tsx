import * as React from 'react'
import { Editor } from 'slate'
import { RenderInlineProps } from 'slate-react'

import { SUGGESTION_TYPES } from './types'

export function renderInline(props: RenderInlineProps, _: Editor, next: () => any) {
  if (SUGGESTION_TYPES.includes(props.node.type)) {
    return <span
        className={`suggestion suggestion--${props.node.type.split('_')[1]}`}
        {...props.attributes}
      >
        {props.children}
      </span>
  }

  return next()
}
