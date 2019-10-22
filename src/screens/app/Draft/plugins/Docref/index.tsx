import * as React from 'react'
import { connect } from 'react-redux'
import { Plugin, RenderInlineProps } from 'slate-react'

import { Module } from 'src/api'

import { State } from 'src/store/reducers'

const DocrefPlugin: Plugin = {
  renderInline(props, _, next) {
    if (props.node.type === 'docref') {
      return <Docref {...props} />
    }

    return next()
  },
}

export default DocrefPlugin

interface DocrefProps extends RenderInlineProps {
  targetModule: Module | undefined
}

const mapStateTopProps = ({ modules: { modulesMap } }: State, { node }: RenderInlineProps) => {
  const document = node.data.get('document')
  return {
    targetModule: modulesMap.get(document),
  }
}

const Docref = connect(mapStateTopProps)(class Docref extends React.Component<DocrefProps> {
  public render() {
    const { children, attributes, targetModule } = this.props
    const href = targetModule ? `/modules/${targetModule.id}` : undefined

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        title={targetModule ? targetModule.title : undefined}
        onClick={this.onClick}
        {...attributes}
      >
        {children}
      </a>
    )
  }

  // Slate will disable clicks on <a> which are not void for default.
  onClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (ev.ctrlKey && this.props.targetModule) {
      window.open(`/modules/${this.props.targetModule.id}`, '_blank')
    }
  }
})
