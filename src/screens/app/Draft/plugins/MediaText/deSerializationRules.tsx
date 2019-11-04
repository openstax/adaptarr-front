import * as React from 'react'
import { Node, Text } from 'slate'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mediatext': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & { xmlns: string },
          HTMLElement
        >
    }
  }
}

const MEDIA_TEXT_NAMESPACE = 'http://adaptarr.naukosfera.com/mediatext/1.0'

const deSerializeRules = {
  serialize(obj: Node, children: Element | Array<any>) {
    if (obj instanceof Text) return undefined
    if (obj.type === 'media_text') {
      return (
        <mediatext
          xmlns={MEDIA_TEXT_NAMESPACE}
        >
          {children}
        </mediatext>
      )
    }
    return undefined
  },
  deserialize(el: Element, next: (nodes: any) => any) {
    if (el.namespaceURI === MEDIA_TEXT_NAMESPACE && el.tagName === 'mediatext') {
      return {
        object: 'block',
        type: 'media_text',
        nodes: next(Array.from(el.childNodes)),
      }
    }
    return undefined
  },
}

export default deSerializeRules
