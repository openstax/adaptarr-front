declare module 'slate-counters' {
  import * as React from 'react'
  import * as Immutable from 'immutable'
  import { Plugin } from 'slate-react'

  export default function(): Plugin

  export interface CounterProps {
    counters: Immutable.Map<string, number>
  }

  export class CountersProvider {}

  export const CounterContext: React.Context<{
    counters: Immutable.Map<any, any>
    counterUpdater: CountersProvider
  }>

  export type WithCountersDecorator<Props> = (
    component: React.ComponentType<Props & CounterProps>
  ) => React.ComponentType<Props>

  export function WithCounters<Props>(
    getKey: (props: Props) => string
  ): WithCountersDecorator<Props>
}
