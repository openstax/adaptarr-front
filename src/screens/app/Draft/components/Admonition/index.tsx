import * as React from 'react'
import { InjectedProps, withLocalization } from 'fluent-react/compat'
import { Block, Node } from 'slate'
import { RenderNodeProps } from 'slate-react'
import { List } from 'immutable';

type Props = RenderNodeProps & InjectedProps

function Labelled({ children, attributes, getString, node }: Props) {
  const type = node.data.get('type')
  const message = getString('admonition-label', { type })
  const hasTitle = ((node.nodes as List<Node>).get(0) as Block).type === 'title'

  return <div
    className="admonition"
    data-type={type}
    data-label={message}
    {...attributes}
    >
    { !hasTitle && <span className="admonition-title" contentEditable={false}>{message}</span> }
    {children}
  </div>
}

export default withLocalization(Labelled)
