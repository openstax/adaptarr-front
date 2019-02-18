import * as React from 'react'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { Block, Inline, Value } from 'slate'
import { Plugin, RenderNodeProps } from 'slate-react'

import capitalize from 'src/helpers/capitalize'

import i18n from 'src/i18n'
import { State } from 'src/store/reducers'
import { ReferenceTarget } from 'src/store/types'

const XrefPlugin: Plugin = {
  renderNode(props, _, next) {
    if (props.node.type === 'xref') {
      return <Xref {...props} />
    }

    return next()
  }
}

export default XrefPlugin

type CmlnleCases = {
  nominative: string
  genitive: string
  dative: string
  accusative: string
  instrumental: string
  locative: string
  vocative: string
}

const CASES: Map<string, CmlnleCases> = Map({
  exercise: {
    nominative: "Ćwiczenie",
    genitive: "Ćwiczenia",
    dative: "Ćwiczeniu",
    accusative: "Ćwiczenie",
    instrumental: "Ćwiczeniem",
    locative: "Ćwiczeniu",
    vocative: "Ćwiczenie",
  },
  table: {
    nominative: "Tabela",
    genitive: "Tabeli",
    dative: "Tabeli",
    accusative: "Tabelę",
    instrumental: "Tabelą",
    locative: "Tabeli",
    vocative: "Tabelo",
  },
  example: {
    nominative: "Przykład",
    genitive: "Przykładu",
    dative: "Przykładowi",
    accusative: "Przykład",
    instrumental: "Przykładem",
    locative: "Przykładzie",
    vocative: "Przykładzie",
  },
  equation: {
    nominative: "Równanie",
    genitive: "Równania",
    dative: "Równaniu",
    accusative: "Równanie",
    instrumental: "Równaniem",
    locative: "Równaniu",
    vocative: "Równanie",
  },
  figure: {
    nominative: "Rysunek",
    genitive: "Rysunku",
    dative: "Rysunkowi",
    accusative: "Rysunek",
    instrumental: "Rysunkiem",
    locative: "Rysunku",
    vocative: "Rysunku",
  }
})

type XrefProps = RenderNodeProps & {
  referenceTargets?: ReferenceTarget[],
}

const mapStateTopProps = ({ modules: { referenceTargets } }: State, { node }: RenderNodeProps) => {
  const document = node.data.get('document')
  if (document) {
    return {
      referenceTargets: referenceTargets.get(document),
    }
  }
  return {}
}

const Xref = connect(mapStateTopProps)(class Xref extends React.Component<XrefProps> {
  static contextTypes = {
    counters: PropTypes.instanceOf(Map as any),
  }

  render() {
    const { node, attributes } = this.props

    const targetDocument = node.data.get('document')

    const [text, href] = targetDocument
      ? this.renderRemote()
      : this.renderLocal()

    return (
      <a
        href={href}
        title={i18n.t('Editor.reference.tooltip')}
        onClick={this.onClick}
        {...attributes}
      >
        {text}
      </a>
    )
  }

  getCase (type: string, cmlnleCase: string) {
    const dec = CASES.get(type) ? CASES.get(type)[cmlnleCase] : null

    if (!dec) {
      console.warn(`Couldn't find translation for target type: ${type} with cmlnl case: ${cmlnleCase}.`)
      return capitalize(type)
    }

    return dec
  }

  renderLocal() {
    const { node, editor } = this.props
    const { counters } = this.context
    const targetKey = node.data.get('target')
    const target = editor.value.document.getNode(targetKey) as Block | Inline

    let text

    if (target) {
      const cnts = counters.get(targetKey) || Map()
      text = this.getCase(target.type, node.data.get('case')) + ' ' + cnts.get(target.type)
    } else {
      console.warn(`Undefined target in ${node.key}: ${targetKey}`)
      text = i18n.t('Editor.reference.missing')
    }

    return [text, "#" + targetKey]
  }

  renderRemote() {
    const { node, referenceTargets } = this.props

    const targetDocument = node.data.get('document')
    const targetKey = node.data.get('target')
    const target = referenceTargets && referenceTargets
      .find(target => target.id === targetKey)

    let text

    if (!referenceTargets) {
      text = i18n.t('Editor.reference.loading')
    } else if (target) {
      text = this.getCase(target.type, node.data.get('case')) + ' ' + target.counter
    } else {
      console.warn(`Undefined target in ${node.key}: ${targetKey} from document ${targetDocument}`)
      text = i18n.t('Editor.reference.missing')
    }

    const href = `/modules/${targetDocument}#${targetKey}`

    return [text, href]
  }

  onClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ev.ctrlKey) {
      ev.preventDefault()
    }
  }
})

export function collectForeignDocuments(value: Value): string[] {
  const documents = new Set()

  for (const node of value.document.getInlinesByType('xref') as unknown as Iterable<Inline>) {
    const document = node.data.get('document')
    if (document) {
      documents.add(document)
    }
  }

  return Array.from(documents)
}
