import * as React from 'react'
import { Node, Text } from 'slate'

import { EDITING_NAMESPACE } from '../config'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'highlight': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            xmlns: string
            color: string
            text: string
            user: number
          },
          HTMLElement
        >
    }
  }
}

// This is replaced by single namespace: http://adaptarr.naukosfera.com/editing/1.0
// This namespace should be removed after few weeks when all drafs will no longer
// contain it.
const HIGHLIGHTS_NAMESPACE = 'http://adaptarr.naukosfera.com/highlights/1.0'

const deSerializeRules = {
  serialize(obj: Node, children: Element | Array<any>) {
    if (obj instanceof Text) return undefined
    if (obj.type === 'highlight') {
      return (
        <highlight
          xmlns={EDITING_NAMESPACE}
          color={obj.data.get('color')}
          text={obj.data.get('text')}
          user={obj.data.get('user')}
        >
          {children}
        </highlight>
      )
    }
    return undefined
  },
  deserialize(el: Element, next: (nodes: any) => any) {
    if (
      [HIGHLIGHTS_NAMESPACE, EDITING_NAMESPACE].includes(el.namespaceURI!)
      && el.tagName === 'highlight'
    ) {
      return {
        object: 'inline',
        type: 'highlight',
        data: {
          color: el.getAttribute('color'),
          text: el.getAttribute('text'),
          user: Number(el.getAttribute('user')),
        },
        nodes: next(Array.from(el.childNodes)),
      }
    }
    return undefined
  },
}

export default deSerializeRules
