import * as React from 'react'
import { Node, Text } from 'slate'

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

const HIGHLIGHTS_NAMESPACE = 'http://adaptarr.naukosfera.com/highlights/1.0'

const deSerializeRules = {
  serialize(obj: Node, children: Element | Array<any>) {
    if (obj instanceof Text) return undefined
    if (obj.type === 'highlight') {
      return (
        <highlight
          xmlns={HIGHLIGHTS_NAMESPACE}
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
    if (el.namespaceURI === HIGHLIGHTS_NAMESPACE && el.tagName === 'highlight') {
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
