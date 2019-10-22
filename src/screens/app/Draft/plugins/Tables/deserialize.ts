const deserializeRules = {
  deserialize(el: Element, next: (nodes: any) => any) {
    const block = BLOCK_TAGS[el.tagName]
    if (!block) return undefined

    const props = block instanceof Function
      ? block(el, next)
      : {
        type: block,
        nodes: next(Array.from(el.children)),
      }

    if (props == null) return undefined

    if (props instanceof Array) {
      props[0].key = props[0].key || el.getAttribute('id') || undefined

      for (const node of props) {
        if (!node.object) {
          node.object = 'block'
        }
      }

      return props
    }

    const data = {}
    Array.from(el.attributes).forEach(a => {
      data[a.name] = a.value
    })

    return {
      object: 'block',
      key: el.getAttribute('id') || undefined,
      data,
      ...props,
    }
  },
}

const BLOCK_TAGS = {
  caption,
  colspec: 'table_colspec',
  entry,
  table,
  tbody: 'table_tbody',
  tgroup: 'table_tgroup',
  thead: 'table_thead',
  tfoot: 'table_tfoot',
  row: 'table_row',
}

// Process data for captions.
function caption(el: Element, next: (nodes: any) => any) {
  if (el.parentElement && el.parentElement.tagName === 'table') {
    return {
      type: 'table_caption',
      nodes: next(el.childNodes),
    }
  }
  return undefined
}

// Process data for entries.
function entry(el: Element, next: (nodes: any) => any) {
  const data = {}
  Array.from(el.attributes).forEach(a => {
    data[a.name] = a.value
  })
  return {
    type: 'table_entry',
    data,
    nodes: next(el.childNodes),
  }
}

/**
 * Process data for tables.
 */
function table(el: Element, next: (nodes: any) => any) {
  return {
    type: 'table',
    data: {
      summary: el.getAttribute('summary'),
    },
    nodes: next(Array.from(el.children)),
  }
}

export default deserializeRules
