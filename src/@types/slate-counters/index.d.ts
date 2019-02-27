declare module 'slate-counters' {
  import * as React from 'react'
  import * as Immutable from 'immutable'
  import { Plugin } from 'slate-react'

  export default function(): Plugin;

  export type CounterProps = {
    counters: Immutable.Map<string, number>,
  }

  export type WithCountersDecorator<Props> = (component: React.ComponentType<Props & CounterProps>) => React.ComponentType<Props>;

  export function WithCounters<Props>(getKey: (props: Props) => string): WithCountersDecorator<Props>;
}
