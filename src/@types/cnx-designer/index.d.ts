declare module 'cnx-designer' {
  import {
    Inline,
    Block,
    Data,
    Editor as SlateEditor,
    Node,
    Operation,
    Range,
    Value,
  } from 'slate'
  import { Plugin } from 'slate-react'
  import { List } from 'immutable'

  type EditorProps = {
    documentDb: DocumentDB,
    storage: Storage,
    value: Value,
    prePlugins?: Plugin[],
    postPlugins?: Plugin[],
  }

  export default class Editor extends React.Component<EditorProps> {
  }

  export const CNXML: {
    deserialize(html: string, options?: {}): Value
    serialize(value: Value, title: string): string
  }

  export class APIError extends Error {
    status: number
    statusText: string
  }

  export class Storage {
    static load(id: string): Promise<Storage>
    read(): Promise<Value>
    write(value: Value): Promise<void>
    writeFile(file: File): Promise<void>
    current(value: Value): boolean
    mediaUrl(name: string): string
  }

  export class PersistDB {
    static open(): Promise<PersistDB>
    static load(id: string): Promise<DocumentDB>
    openDocument(id: string): Promise<DocumentDB>
    dirty(): Promise<{}[]>
    discard(id: string): Promise<void>
  }

  export class DocumentDB {
    id: string
    dirty: boolean

    save(value: Value, version: string): Promise<void>
    mark(op: Operation): Promise<void>
    restore(): Promise<Value>
    discard(): Promise<void>
  }

  export type AdmonitionKind = 'note' | 'warning' | 'tip' | 'important'

  export type MediaDescription = {
    mime: string,
    name: string,
    alt: string,
  }

  export interface EditorAug {
    // Commands
    insertAdmonition(kind: AdmonitionKind): EditorAug
    insertExercise(): EditorAug
    insertSolution(): EditorAug
    insertCommentary(): EditorAug
    insertFigure(media: MediaDescription): EditorAug
    insertSubfigure(media: MediaDescription): EditorAug
    insertCaption(): EditorAug
    changeListType(type: string): EditorAug
    insertXref(target: string, document?: string): EditorAug
    removeMarks(): EditorAug

    // Queries
    getActiveAdmonition(value: Value): Block | null
    getActiveExercise(value: Value): Block | null
    getActiveFigure(value: Value): Block | null
    getActiveSubfigure(value: Value): Block | null

    // From slate-core, but not included in @types/slate for some reason
    isVoid(node: Node): boolean

    // From slate-edit-list
    decreaseItemDepth(): EditorAug
    increaseItemDepth(): EditorAug
    splitListItem(): EditorAug
    unwrapList(): EditorAug
    wrapInList(type?: string, data?: Object | Data): EditorAug
    getCurrentItem(value: Value, block?: Block): Block | null
    getCurrentList(value: Value, block?: Block): Block | null
    getItemDepth(value: Value, block?: Block): number
    getItemsAtRange(value: Value, range?: Range): List<Block>
    getListForItem(value: Value, item: Block): Block | null
    getPreviousItem(value: Value, block?: Block): Block | null
    isSelectionInList(value: Value): boolean
  }
}
