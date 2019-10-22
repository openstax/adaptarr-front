import * as slate from 'slate'
import { EditorAug } from 'cnx-designer'

declare module 'slate' {
  interface Editor extends EditorAug {}
}
