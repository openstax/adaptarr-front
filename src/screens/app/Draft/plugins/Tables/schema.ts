function normalizeTable(change: any, error: any) {
  const { code: violation, child } = error

  switch (violation) {
    case 'child_type_invalid':
      console.log('normalizeTable child_type_invalid')
      console.log('child.type:', child.type)
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
        summary: (s: any) => s == null || typeof s === 'string',
        frame: (f: any) => f == null || typeof f === 'string',
        colsep: (c: any) => c == null || c >= 0,
        rowsep: (r: any) => r == null || r >= 0,
        pgwide: (p: any) => p == null || p >= 0,
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
        cols: (c: number) => c > 0,
        colsep: (c: any) => c == null || c >= 0,
        rowsep: (r: any) => r == null || r >= 0,
        align: (a: any) => a == null || typeof a === 'string',
        char: (c: any) => c == null || typeof c === 'string',
        charoff: (c: any) => c == null || 0 >= c && c <= 100,
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
        colnum: (c: any) => c == null || c > 0,
        colname: (c: any) => c == null || typeof c === 'string',
        colwidth: (c: any) => c == null || typeof c === 'string',
        colsep: (c: any) => c == null || c >= 0,
        rowsep: (r: any) => r == null || r >= 0,
        align: (a: any) => a == null || typeof a === 'string',
        char: (c: any) => c == null || typeof c === 'string',
        charoff: (c: any) => c == null || 0 >= c && c <= 100,
      },
      normalize: normalizeColspec,
    },
    table_spanspec: {
      isVoid: true,
      data: {
        namest: (n: any) => n == null || typeof n === 'string',
        nameend: (n: any) => n == null || typeof n === 'string',
        spanname: (s: any) => s == null || typeof s === 'string',
        colsep: (c: any) => c == null || c >= 0,
        rowsep: (r: any) => r == null || r >= 0,
        align: (a: any) => a == null || typeof a === 'string',
        char: (c: any) => c == null || typeof c === 'string',
        charoff: (c: any) => c == null || 0 >= c && c <= 100,
      },
      normalize: normalizeSpanspec,
    },
    table_thead: {
      data: {
        valign: (v: any) => v == null || typeof v === 'string',
      },
      nodes: [
        { match: { type: 'table_colspec' } },
        { match: { type: 'table_row' } },
      ],
      normalize: normalizeThead,
    },
    table_tbody: {
      data: {
        valign: (v: any) => v == null || typeof v === 'string',
      },
      nodes: [
        { match: { type: 'table_row' } },
      ],
      normalize: normalizeTbody,
    },
    table_tfoot: {
      data: {
        valign: (v: any) => v == null || typeof v === 'string',
      },
      nodes: [
        { match: { type: 'table_colspec' } },
        { match: { type: 'table_row' } },
      ],
      normalize: normalizeTfoot,
    },
    table_row: {
      data: {
        valign: (v: any) => v == null || typeof v === 'string',
        rowsep: (r: any) => r == null || r >= 0,
      },
      nodes: [
        { match: { type: 'table_entry' } },
      ],
      normalize: normalizeRow,
    },
    table_entry: {
      data: {
        morerows: (m: any) => m == null || m >= 0,
        colname: (c: any) => c == null || typeof c === 'string',
        namest: (n: any) => n == null || typeof n === 'string',
        nameend: (n: any) => n == null || typeof n === 'string',
        spanname: (s: any) => s == null || typeof s === 'string',
        colsep: (c: any) => c == null || c >= 0,
        rowsep: (r: any) => r == null || r >= 0,
        align: (a: any) => a == null || typeof a === 'string',
        char: (c: any) => c == null || typeof c === 'string',
        charoff: (c: any) => c == null || 0 >= c && c <= 100,
        valign: (v: any) => v == null || typeof v === 'string',
      },
      normalize: normalizeEntry,
    },
    table_caption: {
      normalize: normalizeCaption,
    },
  },
}