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
  const key = createL10nKeyForXrefLabel(target.type)
  const args = { case: case_ }

  for (const [name, value] of counters as IterableIterator<[string, number]>) {
    args[name] = value
  }

  return l10n.getString(key, args)
}

export function createL10nKeyForXrefLabel(type: string) {
  let key = 'xref-label-unknown'
  switch (type) {
  case 'note':
    key = 'xref-label-note'
    break
  case 'important':
    key = 'xref-label-important'
    break
  case 'warning':
    key = 'xref-label-warning'
    break
  case 'tip':
    key = 'xref-label-tip'
    break
  case 'equation':
    key = 'xref-label-equation'
    break
  case 'example':
    key = 'xref-label-example'
    break
  case 'exercise':
    key = 'xref-label-exercise'
    break
  case 'solution':
    key = 'xref-label-solution'
    break
  case 'exercise_solution':
    key = 'xref-label-exercise_solution'
    break
  case 'commentary':
    key = 'xref-label-commentary'
    break
  case 'figure':
    key = 'xref-label-figure'
    break
  case 'table':
    key = 'xref-label-table'
    break

  default:
    break
  }

  return key
}
