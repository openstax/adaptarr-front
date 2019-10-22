import * as React from 'react'
import { InjectedProps, withLocalization } from 'fluent-react/compat'
import { Block } from 'slate'
import { RenderBlockProps } from 'slate-react'

interface LabelledProps extends RenderBlockProps, InjectedProps {}

function Labelled({ children, attributes, getString, node }: LabelledProps) {
  const type = node.data.get('type')
  const message = getString('admonition-label', { type })
  const hasTitle = (node.nodes.get(0) as unknown as Block).type === 'title'

  return (
    <div
      className="admonition"
      data-type={type}
      data-label={message}
      {...attributes}
    >
      { !hasTitle && <span className="admonition-title" contentEditable={false}>{message}</span> }
      {children}
    </div>
  )
}

export default withLocalization(Labelled)
