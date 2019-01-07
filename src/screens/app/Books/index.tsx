import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { FilesError } from 'react-files'

import i18n from 'src/i18n'
import axios from 'src/config/axios'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import AdminUI from 'src/components/AdminUI'
import BookCard from 'src/components/BookCard'
import Spinner from 'src/components/Spinner'
import SuperSession from 'src/components/SuperSession'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import { IsLoading, BooksMap, BookShortInfo } from 'src/store/types'
import { FetchBooksMap, fetchBooksMap } from 'src/store/actions/Books'
import { State } from 'src/store/reducers/index'

type Props = {
  booksMap: {
    isLoading: IsLoading
    booksMap: BooksMap
  }
  fetchBooksMap: () => void
}

export const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

export const mapDispatchToProps = (dispatch: FetchBooksMap) => {
  return {
    fetchBooksMap: () => dispatch(fetchBooksMap()),
  }
}

class Books extends React.Component<Props> {

  state: {
    titleInput: string,
    showSuperSession: boolean,
    showAddBook: boolean,
    files: File[],
  } = {
    titleInput: '',
    showSuperSession: false,
    showAddBook: false,
    files: [],
  }

  private listOfBookCards = (booksMap: BooksMap) => {
    let books: BookShortInfo[] = []

    // Create new array because we can't render list
    booksMap.forEach(book => {
      books.push(book)
    })

    return books.map((book: BookShortInfo) => {
      return <BookCard key={book.id} book={book}/>
    })
  }

  private addBook = () => {
    const { titleInput: title, files } = this.state

    const config = files.length ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}

    const paylaod = {
      title
    }

    let data = new FormData()
    data.append('title', title)
    if (files.length) {
      data.append('file', files[0])
    }

    axios.post('books', files.length ? data : paylaod, config)
      .then(() => {
        this.props.fetchBooksMap()
        this.setState({ titleInput: '' })
        store.dispatch(addAlert('success', i18n.t("Book.bookAddSuccess")))
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
        } else {
          store.dispatch(addAlert('error', e.message))
        }
      })
    this.closeAddBookDialog()
  }

  private showAddBookDialog = ()  => {
    this.setState({ showAddBook: true })
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

  private superSessionSuccess = (res: Response) => {
    this.addBook()
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    store.dispatch(addAlert('error', e.message))
  }

  private closeSuperSession = () => {
    this.setState({ showSuperSession: false })
  }

  public render() {
    const { isLoading, booksMap } = this.props.booksMap
    const { titleInput, showSuperSession, showAddBook } = this.state

    return (
      <Section>
        <Header i18nKey="Books.title">
          <AdminUI>
            <Button 
              color="green"
              clickHandler={this.showAddBookDialog}
            >
              <Icon name="plus"/>
            </Button>
          </AdminUI>
        </Header>
        {
          showSuperSession ?
            <SuperSession 
              onSuccess={this.superSessionSuccess} 
              onFailure={this.superSessionFailure}
              onAbort={this.closeSuperSession}/>
          : null
        }
        {
          showAddBook ?
            <Dialog 
              size="medium"
              onClose={this.closeAddBookDialog}
              i18nKey="Books.addBookDialog"
            >
              <Input 
                value={this.state.titleInput} 
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
                isDisabled={titleInput.length === 0}
                clickHandler={this.addBook}
              >
                <Icon name="plus"/>
              </Button>
            </Dialog>
          : null
        }
        {
          !isLoading ?
            <div className="section__content">
              {
                booksMap.size > 0 ?
                  this.listOfBookCards(booksMap)
                : <Trans i18nKey="Books.noBooksFound" />
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
