import * as React from 'react'
import { Node, Text } from 'slate'

import { SUGGESTION_TYPES } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'insert': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { xmlns: string }, HTMLElement>
      'delete': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { xmlns: string }, HTMLElement>
    }
  }
}

const SUGGESTIONS_NAMESPACE = 'http://adaptarr.naukosfera.com/suggestions/1.0'

const deSerializeRules = {
  serialize(obj: Node, children: Element | Array<any>) {
    if (obj instanceof Text) return
    if (SUGGESTION_TYPES.includes(obj.type)) {
      const Tag = obj.type.split('_')[1] as 'insert' | 'delete'
      return <Tag xmlns={SUGGESTIONS_NAMESPACE}>{children}</Tag>
    }
    return
  },
  deserialize(el: Element, next: (nodes: any) => any) {
    if (el.namespaceURI === SUGGESTIONS_NAMESPACE && ['insert', 'delete'].includes(el.tagName)) {
      return {
        object: 'inline',
        type: 'suggestion_' + el.tagName,
        nodes: next(Array.from(el.childNodes)),
      }
    }
    return
  }
}

export default deSerializeRules
