declare module 'cnx-designer' {
  import * as React from 'react'
  import {
    Block,
    Data,
    Node,
    Operation,
    Range,
    Value,
    Path,
    ValueJSON,
  } from 'slate'
  import { Plugin } from 'slate-react'
  import { List } from 'immutable'

  type SerializeOptions = {
    title?: string
    language?: string
  }

  export class CNXML {
    constructor(args: {documentRules: any[], glossaryRules: any[]})
    deserialize(html: string, options?: {}): {language: string, document: Value, glossary: Value}
    serialize(documentValue: Value, glossaryValue: Value | null, options: SerializeOptions): string
  }

  export class APIError extends Error {
    status: number
    statusText: string
  }

  export type PersistDBData = {
    database: {
      name: string
      version: number
      objectStores: {
        indexes: {[key: string]: {
          name: string
          keyPath: IDBKeyPath
          multiEntry: boolean
          unique: boolean
        }}
        keyPath: IDBKeyPath,
        autoIncrement: boolean
      }
    }
    remove: {[key: string]: Object}
    insert: {[key: string]: Object[]}
  }

  export class PersistDB {
    static open(): Promise<PersistDB>
    static load(id: string): Promise<DocumentDB>
    export(): Promise<PersistDBData>
    import(database: PersistDBData): Promise<void>
    openDocument(id: string): Promise<DocumentDB>
    dirty(): Promise<{}[]>
    discard(id: string): Promise<void>
  }

  export class DocumentDB {
    id: string
    dirty: boolean
    version: string | null

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
    insertMediaAlt(): EditorAug
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
    getActiveMedia(value: Value): Block | null
    getActiveSubfigure(value: Value): Block | null
    getActiveDefinition(value: Value): Block | null
    getActiveDefinitionMeaning(value: Value): Block | null
    getActiveQuotation(value: Value): Block | null

    // From slate-core, but not included in @types/slate for some reason
    isVoid(node: Node): boolean
    unwrapChildrenByPath(path: Path): EditorAug
    moveAnchorToEndOfNode(node: Node): EditorAug

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

  export type TextOptions = {
    code?: {
      inlines: string[],
    },
    preformat?: {
      inlines: string[],
    },
    term?: {
      inlines: string[],
    },
  }

  export type MediaOptions = {
    inlines?: string[]
    mediaUrl?: (name: string) => string
  }

  export function Document(options?: {
    content?: string[],
    document_content?: string[],
    marks?: string[],
    media?: MediaOptions,
    text?: TextOptions,
    list?: any,
  }): Plugin[]

  export function Glossary(options?: {
    content?: string[],
    glossary_content?: string[],
    marks?: string[],
    list?: any,
    text?: TextOptions,
  }): Plugin[]
}
