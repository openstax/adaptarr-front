declare module 'react-nestable' {
  import * as React from 'react'

  export interface Item {
    id: string | number
    [key: string]: any
  }

  export type RenderItem = {item: {}, index: number, collapseIcon: any, handler: any}

  export interface NestableProps {
    items: Item[]
    threshold?: number
    maxDepth?: number
    collapsed?: boolean
    group?: string | number
    handler?: React.Component
    childrenProp?: string
    renderItem: (payload: RenderItem) => any
    renderCollapseIcon?: any//({isCollapsed: boolean})
    onMove?: () => boolean
    onChange?: any//(items: [], item: any)
  }

  export default class Nestable extends React.Component<NestableProps> {}
}
