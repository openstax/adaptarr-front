import './index.css'

import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import * as api from 'src/api'

import AdminUI from 'src/components/AdminUI'
import EditBook from 'src/components/EditBook'
import Dialog from 'src/components/ui/Dialog'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { IsLoading, BooksMap, RequestInfoKind } from 'src/store/types'
import { FetchBooksMap, fetchBooksMap } from 'src/store/actions/Books'
import { addAlert, AddAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers/index'

type Props = {
  book: api.Book
  booksMap: {
    isLoading: IsLoading
    booksMap: BooksMap
  }
  fetchBooksMap: () => void
  addAlert: (kind: RequestInfoKind, message: string) => void
}

export const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

export const mapDispatchToProps = (dispatch: FetchBooksMap | AddAlert) => {
  return {
    fetchBooksMap: () => dispatch(fetchBooksMap()),
    addAlert: (kind: RequestInfoKind, message: string) => dispatch(addAlert(kind, message)),
  }
}

class BookCard extends React.Component<Props> {

  state: {
    showConfirmationDialog: boolean
    showEditBook: boolean
  } = {
    showConfirmationDialog: false,
    showEditBook: false,
  }

  private removeBook = () => {
    this.setState({ showConfirmationDialog: true })
  }

  private removeBookPermamently = () => {
    this.props.book.delete()
      .then(() => {
        this.props.fetchBooksMap()
        this.props.addAlert('success', 'book-delete-alert-success')
      })
      .catch((e) => {
        this.props.addAlert('error', e.message)
      })
  }

  private showEditBook = () => {
    this.setState({ showEditBook: true })
  }

  public render() {
    const { showConfirmationDialog, showEditBook } = this.state
    const { book } = this.props

    return (
      <div className="card">
        <Link to={`books/${book.id}`}>
          <h2 className="card__title">{book.title}</h2>
        </Link>
        <AdminUI>
          <Button clickHandler={this.showEditBook}>
            <Icon name="pencil"/>
          </Button>
          <Button clickHandler={this.removeBook} color="red">
            <Icon name="minus"/>
          </Button>
        </AdminUI>
        {
          showConfirmationDialog ?
            <Dialog
              title="book-delete-title"
              l20nArgs={{ title: book.title }}
              onClose={() => this.setState({ showConfirmationDialog: false })}
            >
              <Button 
                color="green" 
                clickHandler={this.removeBookPermamently}
              >
                <Localized id="book-delete-confirm">Confirm</Localized>
              </Button>
              <Button 
                color="red" 
                clickHandler={() => this.setState({ showConfirmationDialog: false })}
              >
                <Localized id="book-delete-cancel">Cancel</Localized>
              </Button>
            </Dialog>
          : null
        }
        {
          showEditBook ?
            <EditBook
              book={book}
              onClose={() => this.setState({ showEditBook: false })}
              onSuccess={() => {this.props.fetchBooksMap(), this.setState({ showEditBook: false })}}
            />
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookCard)
