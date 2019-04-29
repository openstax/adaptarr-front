import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'

import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import LimitedUI from 'src/components/LimitedUI'
import BookCard from 'src/components/BookCard'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import { IsLoading, BooksMap } from 'src/store/types'
import { FetchBooksMap, fetchBooksMap } from 'src/store/actions/Books'
import { fetchModulesMap } from 'src/store/actions/Modules'
import { State } from 'src/store/reducers/index'

type Props = {
  booksMap: {
    isLoading: IsLoading
    booksMap: BooksMap
  }
  fetchBooksMap: () => void
  fetchModulesMap: () => void
}

export const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

export const mapDispatchToProps = (dispatch: FetchBooksMap) => {
  return {
    fetchBooksMap: () => dispatch(fetchBooksMap()),
    fetchModulesMap: () => dispatch(fetchModulesMap()),
  }
}

class Books extends React.Component<Props> {

  state: {
    titleInput: string
    showAddBook: boolean
    files: File[]
    uploading: boolean
  } = {
    titleInput: '',
    showAddBook: false,
    files: [],
    uploading: false,
  }

  private addBook = (e: React.FormEvent) => {
    e.preventDefault()

    const { titleInput: title, files } = this.state

    this.setState({ uploading: true })

    api.Book.create(title, files[0])
      .then(() => {
        this.props.fetchBooksMap()
        this.props.fetchModulesMap()
        this.setState({ titleInput: '' })
        store.dispatch(addAlert('success', 'book-list-add-book-alert-success'))
        this.closeAddBookDialog()
      })
      .catch((e) => {
        store.dispatch(addAlert('error', e.message))
        this.closeAddBookDialog()
      })
  }

  private showAddBookDialog = ()  => {
    this.setState({ showAddBook: true, uploading: false })
  }

  private closeAddBookDialog = () => {
    this.setState({ showAddBook: false })
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

  public render() {
    const { isLoading, booksMap } = this.props.booksMap
    const { titleInput, showAddBook, uploading } = this.state

    return (
      <Section>
        <Header l10nId="book-list-view-title" title="Books">
          <LimitedUI permissions="book:edit">
            <Button
              color="green"
              clickHandler={this.showAddBookDialog}
            >
              <Icon name="plus"/>
            </Button>
          </LimitedUI>
        </Header>
        {
          showAddBook ?
            <Dialog
              l10nId="book-list-add-book-dialog-title"
              placeholder="Add new book"
              size="medium"
              onClose={this.closeAddBookDialog}
            >
              {
                uploading ?
                  <Spinner />
                :
                  <form onSubmit={this.addBook}>
                    <Input
                      l10nId="book-list-add-book-title"
                      value={this.state.titleInput}
                      onChange={this.updateTitleInput}
                      validation={{minLength: 3}}
                    />
                    <FilesUploader
                      onFilesChange={this.onFilesChange}
                      onFilesError={this.onFilesError}
                      accepts={['.zip', '.rar']}
                    />
                    <Localized id="book-list-add-book-confirm" attrs={{ value: true }}>
                      <input type="submit" value="Confirm" disabled={titleInput.length === 0} />
                    </Localized>
                  </form>
              }
            </Dialog>
          : null
        }
        {
          !isLoading ?
            <div className="section__content books">
              {
                booksMap.size > 0 ?
                  Array.from(booksMap.values()).map((book: api.Book) => (
                    <BookCard key={book.id} book={book}/>
                  ))
                : <Localized id="book-list-empty">
                  No books found.
                </Localized>
              }
            </div>
          :
            <Spinner/>
        }
      </Section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Books)
