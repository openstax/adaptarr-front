declare module 'react-nestable' {
  import * as React from 'react'

  export interface NestableProps {
    items: any[]
    threshold?: number
    maxDepth?: number
    collapsed?: boolean
    group?: string | number
    handler?: React.Component
    childrenProp?: string
    renderItem?: any//({item: any, index?: number})
    renderCollapseIcon?: any//({isCollapsed: boolean})
    onChange?: any//(items: [], item: any)
  }

  export default class Nestable extends React.Component<NestableProps> {}
}
