import * as React from 'react'
import { InjectedProps, withLocalization } from 'fluent-react/compat'
import { RenderBlockProps } from 'slate-react'

export type Props = RenderBlockProps & {
  className: string,
  l10nKey: string,
  args?: object,
}

function Labelled({
  children, className, attributes, getString, node, l10nKey, args,
}: Props & InjectedProps) {
  const message = getString(l10nKey, args)

  return <div
    className={className}
    data-label={message}
    {...attributes}
    >
    {children}
  </div>
}

export default withLocalization(Labelled)
