import * as React from 'react'
import Nestable, { RenderItem } from 'react-nestable'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { Link } from 'react-router-dom'

import * as api from 'src/api'
import { GroupData, PartData } from 'src/api/bookpart'

import { State } from 'src/store/reducers'
import { BooksMap } from 'src/store/types'

import ModuleLabels from 'src/components/ModuleLabels'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

interface DraftsListProps {
  booksMap: {
    booksMap: BooksMap
  }
  drafts: api.Draft[]
  selectedTeams: number[]
}

type BookWithPartsAndDrafts = {
  id: string,
  name: string,
  parts: api.BookPart[],
  drafts: api.Draft[],
}

const mapStateToProps = ({ app: { selectedTeams }, booksMap }: State) => ({
  booksMap,
  selectedTeams,
})

interface DraftsListState {
  isLoading: boolean
  books: Map<string, BookWithPartsAndDrafts>
}

class DraftsList extends React.Component<DraftsListProps> {
  state: DraftsListState = {
    isLoading: true,
    books: new Map(),
  }

  componentDidUpdate = (prevProps: DraftsListProps) => {
    if (prevProps.drafts !== this.props.drafts) {
      this.fetchBooks()
    }
  }

  private fetchBooks = async () => {
    this.setState({ isLoading: true })
    const { drafts, booksMap: { booksMap } } = this.props
    const books: Map<string, BookWithPartsAndDrafts> = new Map()

    for (const draft of drafts) {
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

      for (const bookId of draft.books) {
        const book = booksMap.get(bookId)

        if (books.has(bookId)) {
          const entry = books.get(bookId)!
          books.set(bookId, {
            ...entry,
            drafts: [...entry.drafts, draft],
          })
        } else {
          const bookParts = book ? (await book.parts()).parts! : []
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
    for (const data of books.values()) {
      const { id, parts, drafts } = data
      const trimmedParts: api.BookPart[] = []
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
    const parts: api.BookPart[] = []
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
    return parts.length ? new api.BookPart({ ...group, parts } as GroupData, group.book) : null
  }

  componentDidMount = () => {
    this.fetchBooks()
  }

  public render() {
    const { isLoading, books } = this.state
    const { selectedTeams, booksMap: { booksMap } } = this.props

    return (
      <div className="draftsList">
        {
          isLoading
            ? <Spinner />
            :
            books.size ?
              <ul className="list">
                {
                  Array.from(books.values()).map(b => {
                    if (booksMap.has(b.id)) {
                      if (!selectedTeams.includes(booksMap.get(b.id)!.team)) return null
                    }

                    return (
                      <li key={b.id} className="list__item draftsList__book">
                        {
                          b.name ?
                            <>
                              <div className="draftsList__book-title">
                                {b.name}
                              </div>
                              <ul className="list">
                                <NestableCustomized parts={b.parts} />
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
                                  b.drafts.map(d => {
                                    if (!selectedTeams.includes(d.team)) return null

                                    return (
                                      <li key={d.module} className="list__item">
                                        <Link
                                          to={`/drafts/${d.module}`}
                                          className="draftsList__draft-title"
                                        >
                                          {d.title}
                                        </Link>
                                      </li>
                                    )
                                  })
                                }
                              </ul>
                            </>
                        }
                      </li>
                    )
                  })
                }
              </ul>
              :
              <Localized id="dashboard-drafts-empty">
                There are no drafts to display
              </Localized>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(DraftsList)

const NestableCustomized = ({ parts }: { parts: api.BookPart[] }) => {
  const renderItem = ({ item, collapseIcon }: RenderItem<PartData>) => {
    const toggleGroup = () => {
      nestable.current!.toggleCollapseGroup(item.number)
    }

    return (
      <div className={`bookpart__item bookpart__item--${item.kind}`}>
        {
          item.kind === 'group' ?
            <>
              <span className="bookpart__icon">
                {collapseIcon}
              </span>
              <div
                className="bookpart__title"
                onClick={toggleGroup}
              >
                {item.title}
              </div>
            </>
            :
            <>
              <Link
                to={`/drafts/${item.id}/edit`}
                className="draftsList__draft-title"
              >
                {item.title}
              </Link>
              <ModuleLabels module={item.id} />
              <Button to={`/drafts/${item.id}`}>
                <Localized id="dashboard-drafts-details">
                  Details
                </Localized>
              </Button>
            </>
        }
      </div>
    )
  }

  const renderCollapseIcon = ({ isCollapsed }: {isCollapsed: boolean}) => {
    if (isCollapsed) {
      return <Icon name="arrow-right"/>
    }
    return <Icon name="arrow-down" />
  }

  const nestable = React.createRef<Nestable>()

  return (
    <Nestable
      ref={nestable}
      isDisabled={true}
      items={parts}
      className="book-collection"
      childrenProp="parts"
      renderItem={renderItem}
      renderCollapseIcon={renderCollapseIcon}
    />
  )
}
