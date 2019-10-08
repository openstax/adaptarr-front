import * as React from 'react'
import { CounterProps, WithCounters } from 'slate-counters'

import Labelled, { LabelledProps } from '../Labelled'

interface LabelledWithCountersProps extends LabelledProps {
  counterMap: { [key: string]: string },
}

function LabelledWithCounters(
  { counterMap, counters, ...props }: LabelledWithCountersProps & CounterProps
) {
  const args = {}

  for (const [name, from] of Object.entries(counterMap)) {
    args[name] = counters.get(from)
  }

  return <Labelled args={args} {...props} />
}

export default WithCounters<LabelledWithCountersProps>(({ node }) => node.key)(LabelledWithCounters)
