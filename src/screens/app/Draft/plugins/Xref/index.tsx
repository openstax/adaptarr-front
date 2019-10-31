import { ReactLocalization } from 'fluent-react/compat'
import { Map } from 'immutable'
import { Inline, Value } from 'slate'
import { Plugin } from 'slate-react'

import renderInline from './render'

const XrefPlugin: Plugin = {
  renderInline,
}

export default XrefPlugin

export function collectForeignDocuments(value: Value): string[] {
  const documents = new Set<string>()

  for (const node of value.document.getInlinesByType('xref') as unknown as Iterable<Inline>) {
    const document = node.data.get('document')
    if (document) {
      documents.add(document)
    }
  }

  return Array.from(documents)
}

interface Target {
  key: string,
  type: string,
}

export function renderXref(
  l10n: ReactLocalization,
  target: Target,
  counters: Map<string, number> | Iterable<[string, number]>,
  case_: string = 'nominative',
): string {
  const key = 'xref-label-' + target.type
  const args = { case: case_ }

  for (const [name, value] of counters as IterableIterator<[string, number]>) {
    args[name] = value
  }

  return l10n.getString(key, args)
}
