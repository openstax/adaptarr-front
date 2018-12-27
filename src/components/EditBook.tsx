import * as React from 'react'
import { Trans } from 'react-i18next'
import { FilesError } from 'react-files'

import axios from 'axios'

import SuperSession from 'src/components/SuperSession'
import Spinner from 'src/components/Spinner'
import Dialog from 'src/components/ui/Dialog'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { BookShortInfo } from 'src/store/types'

type Props = {
  book: BookShortInfo
  onClose: () => any
  onSuccess: () => any
}

class EditBook extends React.Component<Props> {

  state: {
    isLoading: boolean
    titleInput: string
    files: File[]
    showSuperSession: boolean
  } = {
    isLoading: false,
    titleInput: '',
    files: [],
    showSuperSession: false,
  }

  private editBook = () => {
    this.setState({ isLoading: true })

    const { titleInput: title, files } = this.state
    const book = this.props.book

    const config = files.length ?
    { headers: { 'Content-Type': 'multipart/form-data' } }
    : { headers: { 'Content-Type': 'application/json' } }

    let payload = {
      title
    }

    axios.put(`/api/v1/books/${book.id}`, files.length ? files[0] : payload, config)
      .then(() => {
        this.setState({ titleInput: '' })
        store.dispatch(addAlert('success', 'Book was updated successfully.'))
        this.setState({ isLoading: false })
        this.props.onSuccess()
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', 'You have to confirm this action.'))
        } else {
          store.dispatch(addAlert('error', e.message))
          this.setState({ isLoading: false })
          this.props.onClose()
        }
      })
  }

  private updateTitleInput = (val: string) => {
    this.setState({ titleInput: val })
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files })
  }

  private onFilesError = (error: FilesError, file: File) => {
    store.dispatch(addAlert('error', error.message))
  }

  private superSessionSuccess = (res: Response) => {
    this.editBook()
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    store.dispatch(addAlert('error', e.message))
    this.props.onClose()
  }

  public render() {
    const { isLoading, titleInput, showSuperSession, files } = this.state
    const bookTitle = this.props.book.title

    return (
      <React.Fragment>
        {
          showSuperSession ?
            <SuperSession
              onSuccess={this.superSessionSuccess}
              onFailure={this.superSessionFailure}
              onAbort={() => this.setState({ showSuperSession: false })}
            />
          : null
        }
        <Dialog
          i18nKey="Books.editBookDialog"
          size="medium"
          onClose={() => this.props.onClose()}
        >
          {
            !isLoading ?
            <React.Fragment>
              <Input
                value={bookTitle}
                onChange={this.updateTitleInput}
                placeholder="Book title"
                validation={{minLength: 3}}
              />
              <FilesUploader
                onFilesChange={this.onFilesChange}
                onFilesError={this.onFilesError}
                accepts={['.zip', '.rar']}
              />
              <Button
                color="green"
                isDisabled={titleInput.length === 0 && files.length === 0}
                clickHandler={this.editBook}
              >
                <Trans i18nKey="Buttons.confirm"/>
              </Button>
            </React.Fragment>
            : <Spinner/>
          }
        </Dialog>
      </React.Fragment>
    )
  }
}

export default EditBook
