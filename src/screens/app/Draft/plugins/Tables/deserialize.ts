const deserializeRules = {
  deserialize(el: Element, next: (nodes: any) => any) {
    const block = BLOCK_TAGS[el.tagName]
    if (!block) return

    const props = block instanceof Function ? block(el, next) : {
      type: block,
      nodes: next(Array.from(el.children)),
    }

    if (props instanceof Array) {
      props[0].key = props[0].key || el.getAttribute('id') || undefined

      for (const node of props) {
        if (!node.object) {
          node.object = 'block'
        }
      }

      return props
    }

    let data = {}
    Array.from(el.attributes).forEach(a => {
      data[a.name] = a.value
    })

    return {
      object: 'block',
      key: el.getAttribute('id') || undefined,
      data,
      ...props,
    }
  }
}

const BLOCK_TAGS = {
  table: table,
  tgroup: 'table_tgroup',
  colspec: 'table_colspec',
  thead: 'table_thead',
  tbody: 'table_tbody',
  tfoot: 'table_tfoot',
  row: 'table_row',
  entry: entry,
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

/**
* Process data for entries.
*/
function entry(el: Element, next: (nodes: any) => any) {
  let data = {}
  Array.from(el.attributes).forEach(a => {
    data[a.name] = a.value
  })
  return {
    type: 'table_entry',
    data,
    nodes: next(el.childNodes),
  }
}

export default deserializeRules