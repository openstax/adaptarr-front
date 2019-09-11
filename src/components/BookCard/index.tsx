import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Book } from 'src/api'

import { IsLoading, BooksMap, AlertDataKind } from 'src/store/types'
import { FetchBooksMap, fetchBooksMap } from 'src/store/actions/Books'
import { addAlert, AddAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers/index'

import confirmDialog from 'src/helpers/confirmDialog'

import LimitedUI from 'src/components/LimitedUI'
import EditBook from 'src/components/EditBook'
import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  book: Book
  booksMap: {
    isLoading: IsLoading
    booksMap: BooksMap
  }
  isEditingUnlocked: boolean
  fetchBooksMap: () => void
  addAlert: (kind: AlertDataKind, message: string) => void
}

export const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

export const mapDispatchToProps = (dispatch: FetchBooksMap | AddAlert) => {
  return {
    fetchBooksMap: () => dispatch(fetchBooksMap()),
    addAlert: (kind: AlertDataKind, message: string) => dispatch(addAlert(kind, message)),
  }
}

class BookCard extends React.Component<Props> {
  state: {
    showEditBook: boolean
  } = {
    showEditBook: false,
  }

  private removeBook = async () => {
    const res = await confirmDialog({
      title: 'book-delete-title',
      $title: this.props.book.title,
      buttons: {
        cancel: 'book-delete-cancel',
        confirm: 'book-delete-confirm',
      },
    })

    if (res === 'confirm') {
      this.removeBookPermamently()
    }
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

  private closeEditBook = () => {
    this.setState({ showEditBook: false })
  }

  private editBookSuccess = () => {
    this.props.fetchBooksMap()
    this.setState({ showEditBook: false })
  }

  public render() {
    const { showEditBook } = this.state
    const { book, isEditingUnlocked } = this.props

    return (
      <div className={`card ${isEditingUnlocked ? 'card--editing' : ''}`}>
        {
          isEditingUnlocked ?
            <div className="card__content">
              <h2 className="card__title">{book.title}</h2>
              <div className="card__buttons">
                <LimitedUI permissions="book:edit">
                  <Button clickHandler={this.showEditBook}>
                    <Localized id="book-card-edit">
                      Edit
                    </Localized>
                  </Button>
                  <Button type="danger" clickHandler={this.removeBook}>
                    <Localized id="book-card-remove">
                      Remove
                    </Localized>
                  </Button>
                </LimitedUI>
              </div>
            </div>
          :
            <Link to={`books/${book.id}`} className="card__content">
              <h2 className="card__title">{book.title}</h2>
            </Link>
        }
        {
          showEditBook ?
            <EditBook
              book={book}
              onClose={this.closeEditBook}
              onSuccess={this.editBookSuccess}
            />
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookCard)
