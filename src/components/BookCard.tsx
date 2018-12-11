import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import axios from '../config/axios'

import AdminUI from './AdminUI'
import SuperSession from './SuperSession'
import Dialog from './ui/Dialog'
import Button from './ui/Button'
import Icon from './ui/Icon'

import { IsLoading, BooksMap, BookShortInfo } from '../store/types'
import { FetchBooksMap, fetchBooksMap } from '../store/actions/Books'
import { State } from '../store/reducers/index'

type Props = {
  book: BookShortInfo
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

class BookCard extends React.Component<Props> {

  state: {
    showSuperSession: boolean,
    showConfirmationDialog: boolean,
  } = {
    showSuperSession: false,
    showConfirmationDialog: false,
  }

  private removeBook = () => {
    this.setState({ showConfirmationDialog: true })
  }

  private removeBookPermamently = () => {
    axios.delete(`books/${this.props.book.id}`)
      .then(() => {
        this.props.fetchBooksMap()
      })
      .catch(() => {
        this.setState({ showSuperSession: true })
      })
  }

  private superSessionSuccess = () => {
    this.removeBookPermamently()
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    console.log('failure', e.message)
  }

  public render() {
    const { showSuperSession, showConfirmationDialog } = this.state
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
          <Button clickHandler={this.removeBook} color="red">
            <Icon name="minus" />
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
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookCard)
