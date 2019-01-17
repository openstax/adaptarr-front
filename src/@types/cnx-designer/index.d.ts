declare module 'cnx-designer' {
  import { Value, Operation } from 'slate'
  import { Plugin } from 'slate-react'

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
    serialize(value: Value): string
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
}
