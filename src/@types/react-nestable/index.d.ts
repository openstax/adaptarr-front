declare module 'react-nestable' {
  import * as React from 'react'

  export interface Item {
    id: string | number
    [key: string]: any
  }

  export type RenderItem = {item: {}, index: number, collapseIcon: any, handler: any}

  export interface NestableProps {
    isDisabled?: boolean
    items: Item[]
    threshold?: number
    maxDepth?: number
    collapsed?: boolean
    group?: string | number
    handler?: React.Component
    childrenProp?: string
    className?: string
    renderItem: (payload: RenderItem) => any
    renderCollapseIcon?: () => {isCollapsed: boolean}
    onMove?: () => boolean
    onChange?: (newItems: Item[], changedItem: Item) => any
  }

  export default class Nestable extends React.Component<NestableProps> {}
}
