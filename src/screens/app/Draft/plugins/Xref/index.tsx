import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Localized, ReactLocalization } from 'fluent-react/compat'
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

type RefTranslation = [ReactLocalization, string, object, string]

const Xref = connect(mapStateTopProps)(class Xref extends React.Component<XrefProps> {
  static contextTypes = {
    counters: PropTypes.instanceOf(Map as any),
    l10n: PropTypes.instanceOf(ReactLocalization),
    uiL10n: PropTypes.instanceOf(ReactLocalization),
  }

  componentDidMount() {
    const { l10n, uiL10n } = this.context

    if (l10n) l10n.subscribe(this)
    if (uiL10n) uiL10n.subscribe(this)
  }

  componentWillUnmount() {
    const { l10n, uiL10n } = this.context

    if (l10n) l10n.unsubscribe(this)
    if (uiL10n) uiL10n.unsubscribe(this)
  }

  relocalize() {
    this.forceUpdate()
  }

  render() {
    const { node, attributes } = this.props
    const { uiL10n } = this.context

    const targetDocument = node.data.get('document')

    const [l10n, l10nKey, args, href] = targetDocument
      ? this.renderRemote()
      : this.renderLocal()

    const title = uiL10n.getString('editor-tools-xref-hover-tooltip')
    const text = l10n.getString(l10nKey, args)

    return (
      <a
        href={href}
        onClick={this.onClick}
        title={title}
        {...attributes}
      >
        {text}
      </a>
    )
  }

  renderLocal(): RefTranslation {
    const { node, editor } = this.props
    const { counters, l10n, uiL10n } = this.context
    const targetKey = node.data.get('target')
    const target = editor.value.document.getNode(targetKey) as Block | Inline

    let l10nKey
    let args = { case: node.data.get('case') }
    let localization

    if (target) {
      switch (target.type) {
      case 'admonition':
        l10nKey = 'xref-label-' + target.data.get('type')
        break

      default:
        l10nKey = 'xref-label-' + target.type
        break
      }

      localization = l10n

      const cnts = counters.get(targetKey) || Map()
      for (const [name, value] of cnts) {
        args[name] = value
      }
    } else {
      console.warn(`Undefined target in ${node.key}: ${targetKey}`)
      l10nKey = 'editor-tools-xref-label-local-reference-missing'
      localization = uiL10n
    }

    return [localization, l10nKey, args, "#" + targetKey]
  }

  renderRemote(): RefTranslation {
    const { node, referenceTargets } = this.props
    const { l10n, uiL10n } = this.context

    const targetDocument = node.data.get('document')
    const targetKey = node.data.get('target')
    const target = referenceTargets && referenceTargets
      .find(target => target.id === targetKey)

    let l10nKey
    let args = { $case: node.data.get('case') }
    let localization

    if (!referenceTargets) {
      l10nKey = 'editor-tools-xref-label-remote-loading'
      localization = uiL10n
    } else if (target) {
      l10nKey = 'xref-label-' + target.type
      args['$' + target.type] = target.counter
      localization = l10n
    } else {
      console.warn(`Undefined target in ${node.key}: ${targetKey} from document ${targetDocument}`)
      l10nKey = 'editor-tools-xref-label-remote-reference-missing'
      localization = uiL10n
    }

    const href = `/modules/${targetDocument}#${targetKey}`

    return [localization, l10nKey, args, href]
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

  for (const [name, value] of counters) {
    args[name] = value
  }

  return l10n.getString(key, args)
}
