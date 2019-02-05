import * as React from 'react'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { Block, Inline, Value } from 'slate'
import { Plugin, RenderNodeProps } from 'slate-react'

import i18n from 'src/i18n'
import { Module } from 'src/api'
import { State } from 'src/store/reducers'
import { ReferenceTarget } from 'src/store/types'

import Modal from 'src/components/Modal'
import XrefTargetSelector from 'src/containers/XrefTargetSelector'

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

  xrefModal: Modal | null = null

  render() {
    const { node, attributes } = this.props

    const targetDocument = node.data.get('document')

    const [text, href] = targetDocument
      ? this.renderRemote()
      : this.renderLocal()

    return (
      <React.Fragment>
        <a
          href={href}
          title={i18n.t('Editor.reference.tooltip')}
          onClick={this.onClick}
          {...attributes}
        >
          {text}
        </a>
        <Modal
          ref={this.setXrefModal}
          content={this.renderXrefModal}
        />
      </React.Fragment>
    )
  }

  renderLocal() {
    const { node, editor } = this.props
    const { counters } = this.context

    const targetKey = node.data.get('target')
    const target = editor.value.document.getNode(targetKey) as Block | Inline

    let text

    if (target) {
      const cnts = counters.get(targetKey) || Map()
      text = editor.run('renderXRef', target, cnts) || `(${target.type})`
    } else {
      console.warn(`Undefined target in ${node.key}: ${targetKey}`)
      text = i18n.t('Editor.reference.missing')
    }

    return [text, "#" + targetKey]
  }

  renderRemote() {
    const { node, editor, referenceTargets } = this.props

    const targetDocument = node.data.get('document')
    const targetKey = node.data.get('target')
    const target = referenceTargets && referenceTargets
      .find(target => target.id === targetKey)

    let text

    if (!referenceTargets) {
      text = i18n.t('Editor.reference.loading')
    } else if (target) {
      text = editor.run('renderXRef', target, Map({ [target.type]: target.counter }))
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
      this.openXrefModal()
    }
  }

  setXrefModal = (el: Modal | null) => el &&(this.xrefModal = el)

  openXrefModal = () => this.xrefModal!.open()

  renderXrefModal = () => (
    <XrefTargetSelector
      editor={this.props.editor}
      onSelect={this.changeReference}
    />
  )

  changeReference = (target: ReferenceTarget, source: Module | null) => {
    this.xrefModal!.close()
    const newRef = {type: 'xref', data: { target: target.id, document: source ? source.id : undefined }}
    this.props.editor.setNodeByKey(this.props.node.key, newRef)
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
