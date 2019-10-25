import * as React from 'react'
import * as PropTypes from 'prop-types'
import { ReactLocalization } from 'fluent-react/compat'
import { Map } from 'immutable'
import { Block, Editor, Inline } from 'slate'
import { CounterContext } from 'slate-counters'
import { RenderInlineProps } from 'slate-react'
import { connect } from 'react-redux'

import { State } from 'src/store/reducers'
import { ReferenceTarget } from 'src/store/types'

function renderInline(
  props: RenderInlineProps,
  editor: Editor,
  next: () => any
) {
  if (props.node.type === 'xref') {
    return <Xref {...props} />
  }

  return next()
}

export default renderInline

interface XrefProps extends RenderInlineProps {
  referenceTargets?: ReferenceTarget[]
  counters: Map<any, any>
}

const mapStateTopProps = (
  { modules: { referenceTargets } }: State,
  { node }: RenderInlineProps
) => {
  const document = node.data.get('document')
  if (document) {
    return {
      referenceTargets: referenceTargets.get(document),
    }
  }
  return {}
}

type RefTranslation = [ReactLocalization, string, object, string]

class _Xref extends React.Component<XrefProps> {
  static contextTypes = {
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
    const { counters, node, editor } = this.props
    const { l10n, uiL10n } = this.context
    const targetKey = node.data.get('target')
    const target = editor.value.document.getNode(targetKey) as unknown as Block | Inline

    let l10nKey
    const args: {
      case: string
      note?: string
      [key: string]: any
    } = { case: node.data.get('case') }
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
        // Temporary solution until we will support all types of notes
        if (name === 'admonition') {
          args.note = value
        } else {
          args[name] = value
        }
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

    const findTarget = (refs: ReferenceTarget[] = []): ReferenceTarget | undefined => {
      let result
      refs.some(target => {
        if (target.id === targetKey) {
          result = target
          return true
        }
        if (target.children.length) {
          const res = findTarget(target.children)
          if (res) {
            result = res
            return true
          }
        }
        return false
      })
      return result
    }
    const target = findTarget(referenceTargets)

    let l10nKey
    const args = { case: node.data.get('case') }
    let localization

    if (!referenceTargets) {
      l10nKey = 'editor-tools-xref-label-remote-loading'
      localization = uiL10n
    } else if (target) {
      l10nKey = 'xref-label-' + target.type
      args[target.type] = target.counter
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
}

interface XrefWithLegacyContextProps extends RenderInlineProps {
  referenceTargets?: ReferenceTarget[]
}

// Fluent is not yet supporting new context api so this is how we deal with it.
// TODO: Update this when https://github.com/projectfluent/fluent.js/pull/406 will be released.
// eslint-disable-next-line react/prefer-stateless-function
class XrefWithLegacyContext extends React.Component<XrefWithLegacyContextProps> {
  static contextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
    uiL10n: PropTypes.instanceOf(ReactLocalization),
  }

  render() {
    return (
      <CounterContext.Consumer>
        {
          counters => (
            <_Xref
              counters={counters}
              {...this.props}
            />
          )
        }
      </CounterContext.Consumer>
    )
  }
}

const Xref = connect(mapStateTopProps)(XrefWithLegacyContext)
