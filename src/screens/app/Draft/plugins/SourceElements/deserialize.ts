const deserializeRules = {
  deserialize(el: Element, next: (nodes: any) => any) {
    if (
      el.nodeType !== Node.TEXT_NODE &&
      el.localName &&
      SOURCE_TAGS.includes(el.localName.toLowerCase())) {

      const parentsForInlines = ['para', 'caption']

      let data = {
        object: 'block',
        type: 'source_element',
        nodes: [{
          object: 'text',
          text: new XMLSerializer().serializeToString(el),
          marks: [],
        }],
      }

      const parent = el.parentElement
      if (parent && parentsForInlines.includes(parent.tagName)) {
        data.object = 'inline'
      }

      return data
    }

    return
  }
}

/**
 * We do not support fully those elements yet so for now they are
 * transformed into normal text so magicians can edit them in
 * source mode.
 */

const SOURCE_TAGS = [
  'equation',
  'foreign',
  'math',
  'proof',
  'statement',
  'rule',
]

export default deserializeRules