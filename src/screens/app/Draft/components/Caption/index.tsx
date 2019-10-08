import * as React from 'react'
import { InjectedProps, withLocalization } from 'fluent-react/compat'
import { CounterProps, WithCounters } from 'slate-counters'
import { RenderBlockProps } from 'slate-react'

interface CaptionProps extends RenderBlockProps, CounterProps, InjectedProps {}

function Caption({ counters, children, attributes, getString }: CaptionProps) {
  const message = getString('figure-label', { figure: counters.get('figure') })

  return <figcaption {...attributes} data-label={message}>
    {children}
  </figcaption>
}

export default withLocalization(WithCounters(({ parent }) => parent.key)(Caption))
