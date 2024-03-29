import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'

import * as api from 'src/api'
import { addAlert } from 'src/store/actions/alerts'

import store from 'src/store'
import { BooksMap, IsLoading } from 'src/store/types'
import { FetchBooksMap, fetchBooksMap } from 'src/store/actions/books'
import { fetchModulesMap } from 'src/store/actions/modules'
import { State } from 'src/store/reducers/index'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import LimitedUI from 'src/components/LimitedUI'
import BookCard from 'src/components/BookCard'
import Spinner from 'src/components/Spinner'
import TeamSelector from 'src/components/TeamSelector'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import './index.css'

interface BooksProps {
  booksMap: {
    isLoading: IsLoading
    booksMap: BooksMap
  }
  selectedTeams: number[]
  fetchBooksMap: () => void
  fetchModulesMap: () => void
}

export const mapStateToProps = ({ app: { selectedTeams }, booksMap }: State) => ({
  booksMap,
  selectedTeams,
})

export const mapDispatchToProps = (dispatch: FetchBooksMap) => ({
  fetchBooksMap: () => dispatch(fetchBooksMap()),
  fetchModulesMap: () => dispatch(fetchModulesMap()),
})

interface BooksState {
  titleInput: string
  showAddBook: boolean
  files: File[]
  uploading: boolean
  isEditingUnlocked: boolean
  team: api.Team | null
}

class Books extends React.Component<BooksProps> {
  state: BooksState = {
    titleInput: '',
    showAddBook: false,
    files: [],
    uploading: false,
    isEditingUnlocked: false,
    team: null,
  }

  private addBook = (e: React.FormEvent) => {
    e.preventDefault()

    const { titleInput: title, files, team } = this.state

    if (!team) return

    this.setState({ uploading: true })

    api.Book.create(title, team.id, files[0])
      .then(() => {
        this.props.fetchBooksMap()
        this.props.fetchModulesMap()
        this.setState({ titleInput: '', team: null, files: [] })
        store.dispatch(addAlert('success', 'book-list-add-book-alert-success'))
        this.closeAddBookDialog()
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
        this.closeAddBookDialog()
      })
  }

  private showAddBookDialog = () => {
    this.setState({ showAddBook: true, uploading: false })
  }

  private closeAddBookDialog = () => {
    this.setState({ showAddBook: false })
  }

  private updateTitleInput = (val: string) => {
    this.setState({ titleInput: val })
  }

  private onTeamChange = (team: api.Team) => {
    this.setState({ team })
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files })
  }

  private onFilesError = (error: FilesError, file: File) => {
    store.dispatch(addAlert('error', error.message))
  }

  private toggleEditing = () => {
    this.setState((prevState: BooksState) => ({ isEditingUnlocked: !prevState.isEditingUnlocked }))
  }

  public render() {
    const { booksMap: { isLoading, booksMap }, selectedTeams } = this.props
    const { titleInput, showAddBook, uploading, isEditingUnlocked, team } = this.state

    return (
      <Section>
        <Header l10nId="book-list-view-title" title="Books">
          <LimitedUI permissions="book:edit">
            <Button clickHandler={this.toggleEditing}>
              {
                isEditingUnlocked ?
                  <Icon size="medium" name="unlock" />
                  : <Icon size="medium" name="lock" />
              }
            </Button>
            {
              isEditingUnlocked ?
                <Button clickHandler={this.showAddBookDialog}>
                  <Icon size="medium" name="plus"/>
                </Button>
                : null
            }
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
                      validation={{ minLength: 3 }}
                    />
                    <TeamSelector
                      permission="book:edit"
                      onChange={this.onTeamChange}
                    />
                    <FilesUploader
                      onFilesChange={this.onFilesChange}
                      onFilesError={this.onFilesError}
                      accepts={['.zip', '.rar']}
                      optional={true}
                      multiple={false}
                    />
                    <div className="dialog__buttons">
                      <Button clickHandler={this.closeAddBookDialog}>
                        <Localized id="book-list-add-book-cancel">
                          Cancel
                        </Localized>
                      </Button>
                      <Localized id="book-list-add-book-confirm" attrs={{ value: true }}>
                        <input
                          type="submit"
                          value="Confirm"
                          disabled={titleInput.length === 0 || !team}
                        />
                      </Localized>
                    </div>
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
                  Array.from(booksMap.values()).map((book: api.Book) => {
                    if (!selectedTeams.includes(book.team)) return null
                    return (
                      <BookCard
                        key={book.id}
                        book={book}
                        isEditingUnlocked={isEditingUnlocked}
                      />
                    )
                  })
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
