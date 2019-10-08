import * as React from 'react'
import Files, { FilesError, FilesRef } from 'react-files'
import { Localized } from 'fluent-react/compat'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

interface FileUploaderProps {
  onFilesChange: (files: File[]) => any
  onFilesError: (error: FilesError, file: File) => any
  className?: string
  optional: boolean
  dropActiveClassName?: string
  accepts: string[]
  multiple?: boolean
  maxFiles?: number
  maxFileSize?: number
  minFileSize?: number
  clickable?: boolean
}

class FileUploader extends React.Component<FileUploaderProps> {
  state: {
    files: File[]
  } = {
    files: [],
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files })
    this.props.onFilesChange(files)
  }

  public filesRemoveOne = (file: File) => {
    const files = this.filesRef.current
    if (files) {
      files.removeFile(file)
    }
  }

  public filesRemoveAll = () => {
    const files = this.filesRef.current
    if (files) {
      files.removeFiles()
    }
  }

  filesRef: React.RefObject<FilesRef> = React.createRef()

  public render() {
    const files = this.state.files
    const { onFilesChange, onFilesError, optional, ...otherProps } = this.props
    const multiple = typeof otherProps.multiple === 'boolean' ?
      otherProps.multiple
      : otherProps.maxFiles !== 1

    return (
      <div className="files-uploader">
        <Files
          ref={this.filesRef}
          onChange={this.onFilesChange}
          onError={onFilesError}
          {...otherProps}
        >
          <Localized
            id="file-upload-select-files"
            $multiple={multiple.toString()}
            $optional={optional.toString()}
          >
          Drop files here or click to upload (optional).
          </Localized>
        </Files>
        {
          files.length ?
            <>
              {
                multiple ?
                  <Button type="danger" clickHandler={this.filesRemoveAll}>
                    <Localized id="file-upload-remove-all">
                    Remove all files
                    </Localized>
                  </Button>
                  : null
              }
              <ul className="files__list">
                {
                  files.map((file: File, index: number) => (
                    <FileItem
                      key={file.name + index}
                      file={file}
                      onClickRemove={this.filesRemoveOne}
                    />
                  ))
                }
              </ul>
            </>
            : null
        }
      </div>
    )
  }
}

export default FileUploader

interface FileItemProps {
  file: File
  onClickRemove: (file: File) => void
}

const FileItem = ({ file, onClickRemove }: FileItemProps) => {
  const onClick = () => {
    onClickRemove(file)
  }
  return (
    <li className="files__file">
      <span className="files__name">
        {file.name}
      </span>
      <span
        className="files__close"
        onClick={onClick}
      >
        <Icon name="close"/>
      </span>
    </li>
  )
}
