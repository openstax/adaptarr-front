import './index.css'

import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import axios from 'src/config/axios'

import AdminUI from 'src/components/AdminUI'
import SuperSession from 'src/components/SuperSession'
import EditBook from 'src/components/EditBook'
import Dialog from 'src/components/ui/Dialog'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { IsLoading, BooksMap, BookShortInfo, RequestInfoKind } from 'src/store/types'
import { FetchBooksMap, fetchBooksMap } from 'src/store/actions/Books'
import { addAlert, AddAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers/index'

type Props = {
  book: BookShortInfo
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
    showSuperSession: boolean
    showConfirmationDialog: boolean
    showEditBook: boolean
  } = {
    showSuperSession: false,
    showConfirmationDialog: false,
    showEditBook: false,
  }

  private removeBook = () => {
    this.setState({ showConfirmationDialog: true })
  }

  private removeBookPermamently = () => {
    axios.delete(`books/${this.props.book.id}`)
      .then(() => {
        this.props.fetchBooksMap()
        this.props.addAlert('success', 'Book was deleted successfully.')
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          this.props.addAlert('info', 'You have to confirm this action.')
        } else {
          this.props.addAlert('error', e.message)
        }
      })
  }

  private showEditBook = () => {
    this.setState({ showEditBook: true })
  }

  private superSessionSuccess = () => {
    this.removeBookPermamently()
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    this.props.addAlert('error', e.message)
  }

  public render() {
    const { showSuperSession, showConfirmationDialog, showEditBook } = this.state
    const { book } = this.props

    return (
      <div className="card">
        {
          showSuperSession ?
            <SuperSession 
              onSuccess={this.superSessionSuccess} 
              onFailure={this.superSessionFailure}
              onAbort={() => this.setState({ showSuperSession: false })}/>
          : null
        }
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
              title={`Are you sure you want to delete ${book.title}?`}
              onClose={() => this.setState({ showConfirmationDialog: false })}
            >
              <Button 
                color="green" 
                clickHandler={this.removeBookPermamently}
              >
                <Trans i18nKey="Buttons.confirm" />
              </Button>
              <Button 
                color="red" 
                clickHandler={() => this.setState({ showConfirmationDialog: false })}
              >
                <Trans i18nKey="Buttons.cancel" />
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
