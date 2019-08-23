import './index.css'

import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import * as api from 'src/api'

import LimitedUI from 'src/components/LimitedUI'
import EditBook from 'src/components/EditBook'
import Dialog from 'src/components/ui/Dialog'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { IsLoading, BooksMap, AlertDataKind } from 'src/store/types'
import { FetchBooksMap, fetchBooksMap } from 'src/store/actions/Books'
import { addAlert, AddAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers/index'

type Props = {
  book: api.Book
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

  private content = () => (
    <>
      <h2 className="card__title">{this.props.book.title}</h2>
      {
        this.props.isEditingUnlocked ?
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
        : null
      }
    </>
  )

  public render() {
    const { showConfirmationDialog, showEditBook } = this.state
    const { book, isEditingUnlocked } = this.props

    return (
      <div className={`card ${isEditingUnlocked ? 'card--editing' : ''}`}>
        {
          isEditingUnlocked ?
            <div className="card__content">
              {this.content()}
            </div>
          :
            <Link to={`books/${book.id}`} className="card__content">
              {this.content()}
            </Link>
        }
        {
          showConfirmationDialog ?
            <Dialog
              l10nId="book-delete-title"
              placeholder="Are you sure you want to delete this book?"
              $title={book.title}
              onClose={() => this.setState({ showConfirmationDialog: false })}
            >
              <div className="dialog__buttons">
                <Button
                  clickHandler={() => this.setState({ showConfirmationDialog: false })}
                >
                  <Localized id="book-delete-cancel">Cancel</Localized>
                </Button>
                <Button clickHandler={this.removeBookPermamently}>
                  <Localized id="book-delete-confirm">Confirm</Localized>
                </Button>
              </div>
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
