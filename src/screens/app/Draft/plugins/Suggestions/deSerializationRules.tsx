import * as React from 'react'
import { Node, Text } from 'slate'

import { SUGGESTION_TYPES } from './types'
import { EDITING_NAMESPACE } from '../config'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'insert': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & { xmlns: string },
          HTMLElement
        >
      'delete': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & { xmlns: string },
          HTMLElement
        >
    }
  }
}

// This is replaced by single namespace: http://adaptarr.naukosfera.com/editing/1.0
// This namespace should be removed after few weeks when all drafs will no longer
// contain it.
const SUGGESTIONS_NAMESPACE = 'http://adaptarr.naukosfera.com/suggestions/1.0'

const deSerializeRules = {
  serialize(obj: Node, children: Element | Array<any>) {
    if (obj instanceof Text) return undefined
    if (SUGGESTION_TYPES.includes(obj.type)) {
      const Tag = obj.type.split('_')[1] as 'insert' | 'delete'
      return <Tag xmlns={EDITING_NAMESPACE}>{children}</Tag>
    }
    return undefined
  },
  deserialize(el: Element, next: (nodes: any) => any) {
    if (
      [SUGGESTIONS_NAMESPACE, EDITING_NAMESPACE].includes(el.namespaceURI!)
      && ['insert', 'delete'].includes(el.tagName)
    ) {
      return {
        object: 'inline',
        type: 'suggestion_' + el.tagName,
        nodes: next(Array.from(el.childNodes)),
      }
    }
    return undefined
  },
}

export default deSerializeRules
