import * as React from 'react'
import { InjectedProps, withLocalization } from 'fluent-react/compat'
import { WithCounters, CounterProps } from 'slate-counters'
import { RenderBlockProps } from 'slate-react'

type Props = RenderBlockProps & CounterProps & InjectedProps

function Caption({ counters, children, attributes, getString }: Props) {
  const message = getString('figure-label', { figure: counters.get('figure') })

  return <figcaption {...attributes} data-label={message}>
    {children}
  </figcaption>
}

export default withLocalization(WithCounters(({ parent }) => parent.key)(Caption))
