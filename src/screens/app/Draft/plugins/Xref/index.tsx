import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { Block, Inline, Value } from 'slate'
import { Plugin, RenderNodeProps } from 'slate-react'

import capitalize from 'src/helpers/capitalize'

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

    const [text, attrs, href] = targetDocument
      ? this.renderRemote()
      : this.renderLocal()

    // TODO: add title back
    return (
      <a
        href={href}
        onClick={this.onClick}
        {...attributes}
      >
        <Localized id={text} {...attrs} />
      </a>
    )
  }

  renderLocal(): [string, object, string] {
    const { node, editor } = this.props
    const { counters } = this.context
    const targetKey = node.data.get('target')
    const target = editor.value.document.getNode(targetKey) as Block | Inline

    let text
    let attrs = { $case: node.data.get('case') }

    if (target) {
      const cnts = counters.get(targetKey) || Map()
      text = 'xref-label-' + target.type
      for (const [name, value] of cnts.get(target.type)) {
        attrs['$' + name] = value
      }
    } else {
      console.warn(`Undefined target in ${node.key}: ${targetKey}`)
      text = 'xref-label-local-reference-missing'
    }

    return [text, attrs, "#" + targetKey]
  }

  renderRemote(): [string, object, string] {
    const { node, referenceTargets } = this.props

    const targetDocument = node.data.get('document')
    const targetKey = node.data.get('target')
    const target = referenceTargets && referenceTargets
      .find(target => target.id === targetKey)

    let text
    let attrs = { $case: node.data.get('case') }

    if (!referenceTargets) {
      text = 'xref-label-remote-loading'
    } else if (target) {
      text = 'xref-label-' + target.type
      attrs['$' + target.type] = target.counter
    } else {
      console.warn(`Undefined target in ${node.key}: ${targetKey} from document ${targetDocument}`)
      text = 'xref-label-remote-reference-missing'
    }

    const href = `/modules/${targetDocument}#${targetKey}`

    return [text, attrs, href]
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
