import * as slate from 'slate'
import { EditorAug } from 'cnx-designer'
import { List } from 'immutable'

// Temporary types for annotations until there will be proper update to DefinitelyTyped

declare module 'slate' {
  interface Annotation {
    type: string
    key: string
    anchor: {
      path: slate.Path
      key: string | null
      offset: number
    }
    focus: {
      path: slate.Path
      key: string | null
      offset: number
    }
  }

  interface ValueAug {
    annotations: List<Annotation>
  }

  interface Value extends ValueAug {}

  interface Editor extends EditorAug {}
}
