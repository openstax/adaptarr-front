import './index.css'

import * as React from 'react'
import Files, { FilesError, FilesRef } from 'react-files'
import { Trans } from 'react-i18next'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

type Props = {
  onFilesChange: (files: File[]) => any
  onFilesError: (error: FilesError, file: File) => any
  className?: string
  dropActiveClassName?: string
  accepts: string[]
  multiple?: boolean
  maxFiles?: number
  maxFileSize?: number
  minFileSize?: number
  clickable?: boolean
}

class FileUploader extends React.Component<Props> {
  state: {
    files: File[]
  } = {
    files: [],
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files })
    this.props.onFilesChange(files)
  }

  private filesRemoveOne = (file: File) => {
    const files = this.filesRef.current
    if (files) {
      files.removeFile(file)
    }
  }

  private filesRemoveAll = () => {
    const files = this.filesRef.current
    if (files) {
      files.removeFiles()
    }
  }

  filesRef: React.RefObject<FilesRef> = React.createRef()

  public render() {
    const files = this.state.files
    const { onFilesChange, onFilesError, ...otherProps } = this.props

    return (
      <div className="files-uploader">
      <Files
        ref={this.filesRef}
        onChange={this.onFilesChange}
        onError={onFilesError}
        {...otherProps}
      >
        <Trans i18nKey="Books.fileUploader"/>
      </Files>
      {
        files.length ?
          <React.Fragment>
            <Button color="red" clickHandler={() => this.filesRemoveAll()}>
              <Trans i18nKey="Buttons.removeAllFiles"/>
            </Button>
            <ul className="files__list">
              {
                files.map((file: File, index: number) => {
                  return (
                    <li key={file.name + index} className="files__file">
                      <span className="files__name">
                        {file.name}
                      </span>
                      <span
                        className="files__close"
                        onClick={() => this.filesRemoveOne(file)}
                      >
                        <Icon name="close"/>
                      </span>
                    </li>
                  )
                })
              }
            </ul>
          </React.Fragment>
        : null
      }
      </div>
    )
  }
}

export default FileUploader
