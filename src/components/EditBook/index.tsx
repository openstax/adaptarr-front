import * as React from 'react'
import { Trans } from 'react-i18next'
import { FilesError } from 'react-files'

import i18n from 'src/i18n'
import * as api from 'src/api'

import SuperSession from 'src/components/SuperSession'
import Spinner from 'src/components/Spinner'
import Dialog from 'src/components/ui/Dialog'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

type Props = {
  book: api.Book
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
    const { book } = this.props

    let payload = {
      title
    }

    ;(files.length ? book.replaceContent(files[0]) : book.update(payload))
      .then(() => {
        this.setState({ titleInput: '' })
        store.dispatch(addAlert('success', i18n.t("Book.updateSuccess")))
        this.setState({ isLoading: false })
        this.props.onSuccess()
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
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

  private onFilesError = (error: FilesError, _: File) => {
    store.dispatch(addAlert('error', error.message))
  }

  private superSessionSuccess = (_: Response) => {
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
                placeholder={i18n.t("Book.bookTitlePlaceholder")}
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
