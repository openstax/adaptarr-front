declare module 'cnx-designer' {
  import {
    Block,
    Data,
    Node,
    Operation,
    Range,
    Value,
  } from 'slate'
  import { Plugin } from 'slate-react'
  import { List } from 'immutable'

  export class CNXML {
    constructor(args: {documentRules: any[], glossaryRules: any[]})
    deserialize(html: string, options?: {}): {document: Value, glossary: Value}
    serialize(documentValue: Value, glossaryValue: Value | null, title: string): string
  }

  export class APIError extends Error {
    status: number
    statusText: string
  }

  export class Storage {
    static load(id: string): Promise<Storage>
    read(): Promise<{ document: Value, glossary: Value }>
    write(document: Value, glossary: Value): Promise<void>
    writeFile(file: File): Promise<void>
    current(document: Value, glossary: Value): boolean
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
    insertSection(): EditorAug
    decreaseSectionDepth(): EditorAug
    increaseSectionDepth(): EditorAug
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
    insertDefinition(postion?: 'before' | 'after'): EditorAug
    addMeaningToDefinition(): EditorAug
    addExampleToMeaning(): EditorAug
    addSeeAlsoToDefinition(): EditorAug

    // Queries
    getActiveSection(value: Value): Block | null
    getActiveAdmonition(value: Value): Block | null
    getActiveExercise(value: Value): Block | null
    getActiveFigure(value: Value): Block | null
    getActiveSubfigure(value: Value): Block | null
    getActiveDefinition(value: Value): Block | null
    getActiveDefinitionMeaning(value: Value): Block | null

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

  export const uuid: {
    v4: () => any
  }

  export function Persistence(options: {db: DocumentDB}): Plugin

  export function StoragePlugin({storage}: {storage: Storage}): Plugin

  export function TextContent(options?: {marks?: string[]}): Plugin[]

  export function Document(options?: {
    content?: string[],
    document_content?: string[],
    marks?: string[],
    list?: any,
  }): Plugin[]

  export function Glossary(options?: {
    content?: string[],
    glossary_content?: string[],
    marks?: string[],
    list?: any,
  }): Plugin[]
}
