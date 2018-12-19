declare module 'react-files' {
  import * as React from 'react'

  export type FilesError = { code: 1 | 2 | 3 | 4, message: string }

  export interface FilesRef extends Files {
    removeFile: (file: File) => void
    removeFiles: () => void
  }

  export interface FilesProps {
    className?: string
    dropActiveClassName?: string
    onChange: (files: File[]) => any
    onError: (error: FilesError, file: File) => any
    accepts: string[]
    multiple?: boolean
    maxFiles?: number
    maxFileSize?: number
    minFileSize?: number
    clickable?: boolean
    ref?: React.RefObject<FilesRef>
  }

  export default class Files extends React.Component<FilesProps> {}
}
