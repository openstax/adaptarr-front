declare module 'react-input-trigger' {
  import * as React from 'react'

  export type Trigger = {
    keyCode: number
    shiftKey?: boolean
    ctrlKey?: boolean
    metaKey?: boolean
  }

  export type HookType = "start" | "cancel" | "typing"

  export type MetaInfo = {
    hookType: HookType
    cursor: {
      selectionStart: number
      selectionEnd: number
      top: number
      left: number
      height: number
    }
    text?: string
  }

  export interface InputTriggerProps {
    trigger?: Trigger
    onStart?: (meta: MetaInfo) => any
    onType?: (meta: MetaInfo) => any
    onCancel?: (meta: MetaInfo) => any
    endTrigger?: (endTrigger: () => any) => any
  }

  export default class InputTrigger extends React.Component<InputTriggerProps> {}
}
