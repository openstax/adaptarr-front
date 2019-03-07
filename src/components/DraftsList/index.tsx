import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import * as api from 'src/api'
import sortArrayByTitle from 'src/helpers/sortArrayByTitle'
import { State } from 'src/store/reducers'
import { BooksMap } from 'src/store/types'

import Button from 'src/components/ui/Button'

type Props = {
  booksMap: {
    booksMap: BooksMap
  }
  drafts: api.Draft[]
  onDraftDeleteClick: (draft: api.Draft) => any
}

type BooksWithDrafts = {
  books: api.Book[]
  drafts: api.Draft[]
}

const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

class DraftsList extends React.Component<Props> {

  state: {
    booksWithDrafts: Map<string | null, BooksWithDrafts> | undefined
  } = {
    booksWithDrafts: undefined,
  }

  private sortDraftsByBooksName = async () => {
    const { drafts, booksMap: { booksMap } } = this.props

    let draftsByBooks: Map<string | null, BooksWithDrafts> = new Map()

    for (const draft of drafts) {
      const booksIds = await draft.books()
      const books = booksIds.map(bookId => booksMap.get(bookId)!)

      let booksName = books.length ? '' : null
      books.forEach((b, i) => {
        if (i === books.length - 1) {
          booksName += b.title
        } else {
          booksName += b.title + ', '
        }
      })

      const booksWithDrafts = draftsByBooks.get(booksName)

      if (booksWithDrafts) {
        // Update drafts list for this books
        let drfts = booksWithDrafts.drafts
        if (!drfts.some(d => d.module === draft.module)) {
          // If this draft is not on the list for this books then add it
          drfts.push(draft)
        }
        draftsByBooks.set(booksName, {books: booksWithDrafts.books, drafts: drfts.sort(sortArrayByTitle)})
      } else {
        // Create entry for this books
        draftsByBooks.set(booksName, {books, drafts: [draft]})
      }
    }

    this.setState({ booksWithDrafts: draftsByBooks })
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.drafts !== this.props.drafts) {
      this.sortDraftsByBooksName()
    }
  }

  componentDidMount = () => {
    this.sortDraftsByBooksName()
  }
  
  public render() {
    const { booksWithDrafts } = this.state

    return (
      <div className="draftsList">
        {
          booksWithDrafts ?
            <ul className="list">
              {
                Array.from(booksWithDrafts.entries()).map(([booksName, data]) => (
                  <li key={booksName || ''} className="list__item draftsList__book">
                    <strong>
                      { booksName
                        ? booksName
                        : <Localized id="dashboard-drafts-section-not-assigned">
                          Not assigned to any book
                        </Localized>
                      }
                    </strong>
                    {
                      data.drafts.length ?
                        <ul className="list">
                          {
                            data.drafts.map(draft => (
                              <li key={draft.module} className="list__item">
                                <span className="list__title">
                                  {draft.title}
                                </span>
                                <span className="list__buttons">
                                <Button 
                                  to={`/drafts/${draft.module}`}
                                >
                                  <Localized id="dashboard-drafts-view">
                                    View draft
                                  </Localized>
                                </Button>
                                <Button
                                  color="red"
                                  clickHandler={() => this.props.onDraftDeleteClick(draft)}
                                >
                                  <Localized id="dashboard-drafts-delete">
                                    Delete
                                  </Localized>
                                </Button>
                              </span>
                              </li>
                            ))
                          }
                        </ul>
                      : null
                    }
                  </li>
                ))
              }
            </ul>
          : <Localized id="dashboard-drafts-empty">
            You don't have any drafts.
          </Localized>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(DraftsList)
