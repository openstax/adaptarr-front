function normalizeTable(change: any, error: any) {
  const { code: violation, child } = error

  switch (violation) {
    case 'child_type_invalid':
      if (child.type === 'title') {
        change.setNodeByKey(child.key, { type: 'table_title' })
      } else if (child.type === 'caption') {
        change.setNodeByKey(child.key, { type: 'table_caption' })
      } else {
        console.warn('Unhandled table violation:', violation, JSON.stringify(error, null, 2))
      }
      break

    default:
      console.warn('Unhandled table violation:', violation)
      break
  }
}

function normalizeTgroup(change: any, error: any) {
  console.warn('Unhandled tgroup violation:', error.code)
}

function normalizeColspec(change: any, error: any) {
  console.warn('Unhandled colspec violation:', error.code)
}

function normalizeSpanspec(change: any, error: any) {
  console.warn('Unhandled spanspec violation:', error.code)
}

function normalizeThead(change: any, error: any) {
  console.warn('Unhandled thead violation:', error.code)
}

function normalizeTbody(change: any, error: any) {
  console.warn('Unhandled tbody violation:', error.code)
}

function normalizeTfoot(change: any, error: any) {
  console.warn('Unhandled tfoot violation:', error.code)
}

function normalizeRow(change: any, error: any) {
  console.warn('Unhandled row violation:', error.code)
}

function normalizeEntry(change: any, error: any) {
  console.warn('Unhandled entry violation:', error.code)
}

function normalizeCaption(change: any, error: any) {
  console.warn('Unhandled caption violation:', error.code)
}

export default {
  blocks: {
    table: {
      data: {
        summary: () => true,
        frame: () => true,
        colsep: () => true,
        rowsep: () => true,
        pgwide: () => true,
      },
      nodes: [
        { match: { type: 'table_title' }, min: 0, max: 1, },
        { match: { type: 'table_tgroup' }, min: 1, },
        { match: { type: 'table_caption' }, min: 0, max: 1, },
      ],
      normalize: normalizeTable,
    },
    table_tgroup: {
      data: {
        cols: () => true,
        colsep: () => true,
        rowsep: () => true,
        align: () => true,
        char: () => true,
        charoff: () => true,
      },
      nodes: [
        { match: { type: 'table_colspec' } },
        { match: { type: 'table_thead' }, min: 0, },
        { match: { type: 'table_tbody' }, min: 1, max: 1, },
        { match: { type: 'table_tfoot' }, min: 0, },
      ],
      normalize: normalizeTgroup,
    },
    table_colspec: {
      isVoid: true,
      data: {
        colnum: () => true,
        colname: () => true,
        colwidth: () => true,
        colsep: () => true,
        rowsep: () => true,
        align: () => true,
        char: () => true,
        charoff: () => true,
      },
      normalize: normalizeColspec,
    },
    table_spanspec: {
      isVoid: true,
      data: {
        namest: () => true,
        nameend: () => true,
        spanname: () => true,
        colsep: () => true,
        rowsep: () => true,
        align: () => true,
        char: () => true,
        charoff: () => true,
      },
      normalize: normalizeSpanspec,
    },
    table_thead: {
      data: {
        valign: () => true,
      },
      nodes: [
        { match: { type: 'table_colspec' } },
        { match: { type: 'table_row' } },
      ],
      normalize: normalizeThead,
    },
    table_tbody: {
      data: {
        valign: () => true,
      },
      nodes: [
        { match: { type: 'table_row' } },
      ],
      normalize: normalizeTbody,
    },
    table_tfoot: {
      data: {
        valign: () => true,
      },
      nodes: [
        { match: { type: 'table_colspec' } },
        { match: { type: 'table_row' } },
      ],
      normalize: normalizeTfoot,
    },
    table_row: {
      data: {
        valign: () => true,
        rowsep: () => true,
      },
      nodes: [
        { match: { type: 'table_entry' } },
      ],
      normalize: normalizeRow,
    },
    table_entry: {
      data: {
        morerows: () => true,
        colname: () => true,
        namest: () => true,
        nameend: () => true,
        spanname: () => true,
        colsep: () => true,
        rowsep: () => true,
        align: () => true,
        char: () => true,
        charoff: () => true,
        valign: () => true,
      },
      normalize: normalizeEntry,
    },
    table_caption: {
      normalize: normalizeCaption,
    },
  },
}