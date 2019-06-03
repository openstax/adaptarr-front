import * as React from 'react'
import { Node, Text } from 'slate'

const serializeRules = {
  serialize(obj: Node, children: Element | Array<any>) {
    if (obj instanceof Text) return
    if (obj.type === 'source_element') {
      return source(obj, children)
    }

    return
  }
}

/**
 * Serializer for source elements.
 */
function source(obj: Node, children: Element | Array<any>) {
  const parser = new DOMParser();
  const source = obj.getText().trim()
  // Source inlines are created with text: " " and if user will forgot about this element
  // then we should still handle this instead throwing an error.
  if (!source) return null

  // Add xmlns="http://cnx.rice.edu/cnxml" as default namespace for elements.
  const xmlDoc = parser.parseFromString(`<content xmlns="http://cnx.rice.edu/cnxml">${source}</content>`, 'application/xml')

  const error = xmlDoc.getElementsByTagName('parsererror')
  if (error.length) {
    throw new Error(`${error[0].textContent}, Content: ${obj.getText()}`)
  }

  const elements = xmlDoc.getElementsByTagName('content')[0].children

  return <>{elements}</>
}

export default serializeRules
