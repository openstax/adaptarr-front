import * as slate from 'slate-react'
import { Annotation, Editor as CoreEditor } from 'slate'
import { Map as ImmutableMap } from 'immutable'

// Temporary types for annotations until there will be proper update to DefinitelyTyped

declare module 'slate-react' {
  interface RenderAnnotationProps extends slate.RenderNodeProps {
    annotation: Annotation
  }

  interface PluginAug {
    renderAnnotation?: (props: RenderAnnotationProps, editor: CoreEditor, next: () => any) => any
  }

  interface Plugin extends PluginAug {}

  interface EditorAug {
    addAnnotation: (annotation: Annotation) => any
    setAnnotation: (annotation: Annotation, newAnno: Annotation) => any
  }

  interface Editor extends EditorAug {}
}
