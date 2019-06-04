import * as React from 'react'
import { WithCounters, CounterProps } from 'slate-counters'

import Labelled, { Props as LabelledProps } from '../Labelled'

export type Props = LabelledProps & {
  counterMap: { [key: string]: string },
}

function LabelledWithCounters({ counterMap, counters, ...props }: Props & CounterProps) {
  const args = {}

  for (const [name, from] of Object.entries(counterMap)) {
    args[name] = counters.get(from)
  }

  return <Labelled args={args} {...props} />
}

export default WithCounters<Props>(({ node }) => node.key)(LabelledWithCounters)
