import * as React from 'react'
import Nestable from 'react-nestable'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { Link } from 'react-router-dom'


import * as api from 'src/api'
import { PartData, GroupData } from 'src/api/bookpart'
import { State } from 'src/store/reducers'
import { BooksMap } from 'src/store/types'

import Spinner from 'src/components/Spinner'
import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
  booksMap: {
    booksMap: BooksMap
  }
  drafts: api.Draft[]
}

type BookWithPartsAndDrafts = {
  id: string,
  name: string,
  parts: api.BookPart[],
  drafts: api.Draft[],
}

const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

class DraftsList extends React.Component<Props> {
  state: {
    isLoading: boolean
    books: Map<string, BookWithPartsAndDrafts>
  } = {
    isLoading: true,
    books: new Map(),
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.drafts !== this.props.drafts) {
      this.setState({ isLoading: true })
      this.fetchBooks()
    }
  }

  private fetchBooks = async () => {
    const { drafts, booksMap: { booksMap } } = this.props
    let books: Map<string, BookWithPartsAndDrafts> = new Map()

    for (let draft of drafts) {
      if (draft.books.length === 0) {
        if (books.has('empty')) {
          const entry = books.get('empty')!
          books.set('empty', {
            id: 'empty',
            name: '',
            parts: [],
            drafts: [...entry.drafts, draft],
          })
        } else {
          books.set('empty', {
            id: 'empty',
            name: '',
            parts: [],
            drafts: [draft],
          })
        }
      }

      for (let bookId of draft.books) {
        const book = booksMap.get(bookId)
        const bookParts = book ? (await book.parts()).parts! : []

        if (books.has(bookId)) {
          const entry = books.get(bookId)!
          books.set(bookId, {
            ...entry,
            drafts: [...entry.drafts, draft],
          })
        } else {
          books.set(bookId, {
            id: bookId,
            name: book ? book.title : "...",
            parts: bookParts,
            drafts: [draft],
          })
        }
      }
    }

    // Remove bookparts on which user can't work
    for (let data of books.values()) {
      let { id, parts, drafts } = data
      let trimmedParts: api.BookPart[] = []
      parts.forEach(part => {
        if (part.kind === 'module') {
          if (drafts.findIndex(d => d.module === part.id) >= 0) {
            trimmedParts.push(part)
          }
        } else if (part.kind === 'group') {
          const trimmedGroup = this.trimDraftsFromGroup(part, drafts)
          if (trimmedGroup) {
            trimmedParts.push(trimmedGroup)
          }
        }
      })
      books.set(id, {
        ...data,
        parts: trimmedParts,
      })
    }

    this.setState({ isLoading: false, books })
  }

  private trimDraftsFromGroup = (group: api.BookPart, drafts: api.Draft[]): api.BookPart | null => {
    let parts: api.BookPart[] = []
    group.parts!.forEach(p => {
      if (p.kind === 'module') {
        if (drafts.findIndex(d => d.module === p.id) >= 0) {
          parts.push(p)
        }
      } else if (p.kind === 'group') {
        const trimmedGroup = this.trimDraftsFromGroup(p, drafts)
        if (trimmedGroup) {
          parts.push(trimmedGroup)
        }
      }
    })
    return parts.length ? new api.BookPart({...group, parts: parts} as GroupData, group.book) : null
  }

  componentDidMount = () => {
    this.setState({ isLoading: true })
    this.fetchBooks()
  }

  public render() {
    const { isLoading, books } = this.state

    return (
      <div className="draftsList">
        {
          isLoading ?
            <Spinner />
          :
            books.size ?
              <ul className="list">
                {
                  Array.from(books.values()).map(b => (
                    <li key={b.id} className="list__item draftsList__book">
                      {
                        b.name ?
                          <>
                            <div className="draftsList__book-title">
                              {b.name}
                            </div>
                            <ul className="list">
                              <Nestable
                                isDisabled={true}
                                items={b.parts}
                                className="book-collection"
                                childrenProp="parts"
                                renderItem={this.renderItem}
                                renderCollapseIcon={this.renderCollapseIcon}
                                collapsed
                              />
                            </ul>
                          </>
                        :
                          <>
                            <div className="draftsList__book-title">
                              <Localized id="dashboard-drafts-section-not-assigned">
                                Not assigned to any book
                              </Localized>
                            </div>
                            <ul className="list">
                              {
                                b.drafts.map(d => (
                                  <li key={d.module} className="list__item">
                                    <Link
                                      to={`/drafts/${d.module}`}
                                      className="draftsList__draft-title"
                                    >
                                      {d.title}
                                    </Link>
                                  </li>
                                ))
                              }
                            </ul>
                          </>
                      }
                    </li>
                  ))
                }
              </ul>
            :
              <Localized id="dashboard-drafts-empty">
                You don't have any drafts.
              </Localized>
        }
      </div>
    )
  }

  private renderItem = ({ item, collapseIcon }: { item: PartData, index: number, collapseIcon: any, handler: any }) => {
  return (
      <div className={`bookpart__item bookpart__item--${item.kind}`}>
        {
          item.kind === 'group' ?
            <>
              <span className="bookpart__icon">
                {collapseIcon}
              </span>
              <div className="bookpart__title">
                {item.title}
              </div>
            </>
          :
            <Link
              to={`/drafts/${item.id}`}
              className="draftsList__draft-title"
            >
              {item.title}
            </Link>
        }
      </div>
    )
  }

  private renderCollapseIcon = ({isCollapsed}: {isCollapsed: boolean}) => {
    if (isCollapsed) {
      return <Icon name="arrow-right"/>
    }

    return <Icon name="arrow-down" />
  }
}

export default connect(mapStateToProps)(DraftsList)
