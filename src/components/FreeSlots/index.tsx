import * as React from 'react'
import Nestable from 'react-nestable'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import BookPart, { GroupData, PartData } from 'src/api/bookpart'
import Process, { FreeSlot } from 'src/api/process'
import { TeamID } from 'src/api/team'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { State } from 'src/store/reducers'
import { BooksMap } from 'src/store/types'

import { confirmDialog } from 'src/helpers'

import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

export type FreeSlotsProps = {
  booksMap: BooksMap
  selectedTeams: number[]
  onUpdate: (freeSlots: FreeSlot[]) => any
}

const mapStateToProps = ({ app: { selectedTeams }, booksMap: { booksMap } }: State) => {
  return {
    booksMap,
    selectedTeams,
  }
}

export type FreeSlotsState = {
  freeSlots: FreeSlot[]
  selectedSlot: FreeSlot | null
  isLoading: boolean
  books: Map<string, BookWithPartsAndFreeSlots>
}

type BookWithPartsAndFreeSlots = {
  id: string
  name: string
  team: TeamID | null
  parts: BookPart[]
  freeSlots: FreeSlot[]
}

class FreeSlots extends React.Component<FreeSlotsProps> {
  state: FreeSlotsState = {
    freeSlots: [],
    selectedSlot: null,
    isLoading: true,
    books: new Map(),
  }

  private fetchBooksAndFreeSlots = async () => {
    const freeSlots = await Process.freeSlots()
    const { booksMap } = this.props
    let books: Map<string, BookWithPartsAndFreeSlots> = new Map()

    for (let freeSlot of freeSlots) {
      if (freeSlot.draft.books.length === 0) {
        if (books.has('empty')) {
          const entry = books.get('empty')!
          books.set('empty', {
            id: 'empty',
            name: '',
            team: null,
            parts: [],
            freeSlots: [...entry.freeSlots, freeSlot],
          })
        } else {
          books.set('empty', {
            id: 'empty',
            name: '',
            team: null,
            parts: [],
            freeSlots: [freeSlot],
          })
        }
      }

      for (let bookId of freeSlot.draft.books) {
        const book = booksMap.get(bookId)

        if (books.has(bookId)) {
          const entry = books.get(bookId)!
          books.set(bookId, {
            ...entry,
            freeSlots: [...entry.freeSlots, freeSlot],
          })
        } else {
          const bookParts = book ? (await book.parts()).parts! : []
          books.set(bookId, {
            id: bookId,
            name: book ? book.title : "...",
            team: book ? book.team : null,
            parts: bookParts,
            freeSlots: [freeSlot],
          })
        }
      }
    }

    // Remove bookparts on which user can't work
    for (let data of books.values()) {
      let { id, parts, freeSlots } = data
      let trimmedParts: BookPart[] = []
      parts.forEach(part => {
        if (part.kind === 'module') {
          if (freeSlots.find(s => s.draft.module === part.id)) {
            trimmedParts.push(part)
          }
        } else if (part.kind === 'group') {
          const trimmedGroup = this.trimFreeSlotsFromGroup(part, freeSlots)
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

  private trimFreeSlotsFromGroup = (group: BookPart, freeSlots: FreeSlot[]): BookPart | null => {
    let parts: BookPart[] = []
    group.parts!.forEach(p => {
      if (p.kind === 'module') {
        if (freeSlots.find(s => s.draft.module === p.id)) {
          parts.push(p)
        }
      } else if (p.kind === 'group') {
        const trimmedGroup = this.trimFreeSlotsFromGroup(p, freeSlots)
        if (trimmedGroup) {
          parts.push(trimmedGroup)
        }
      }
    })
    return parts.length ? new BookPart({...group, parts: parts} as GroupData, group.book) : null
  }

  private showConfirmDialog = async (slot: FreeSlot) => {
    const res = await confirmDialog({
      title: 'free-slots-confirm-title',
      content: <div className="free-slots__dialog-content">
                <Localized id="free-slots-confirm-info">
                  You will be assigned to given draft and process manager will be
                  informed that you are willing to work on this task.
                </Localized>
              </div>,
      buttons: {
        cancel: 'free-slots-cancel',
        confirm: 'free-slots-confirm',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.takeSlot(slot)
    }
  }

  componentDidMount = () => {
    this.fetchBooksAndFreeSlots()
  }

  public render() {
    const { selectedTeams } = this.props
    const { isLoading, books } = this.state

    return (
      <div className="free-slots">
        {
          isLoading ?
            <Spinner />
          :
            books.size ?
              <ul className="list">
                {
                  Array.from(books.values()).map(b => {
                    if (b.team && !selectedTeams.includes(b.team)) return null

                    return (
                      <li key={b.id} className="list__item freeSlotsList__book">
                        {
                          b.name ?
                            <>
                              <div className="freeSlotsList__book-title">
                                {b.name}
                              </div>
                              <ul className="list">
                                <NestableCustomized
                                  parts={b.parts}
                                  freeSlots={b.freeSlots}
                                  onTakeSlot={this.showConfirmDialog}
                                />
                              </ul>
                            </>
                          :
                            <>
                              <div className="freeSlotsList__book-title">
                                <Localized id="free-slots-not-assigned">
                                  Not assigned to any book
                                </Localized>
                              </div>
                              <ul className="list free-slots__list">
                                {
                                  b.freeSlots.map(slot => (
                                    <li key={slot.id} className="list__item free-slots__item">
                                      <div className="free-slots__top-bar">
                                        <span className="free-slots__draft">
                                          {slot.draft.title}
                                        </span>
                                        <Button to={`/drafts/${slot.draft.module}`}>
                                          <Localized id="free-slots-view-draft">
                                            View draft
                                          </Localized>
                                        </Button>
                                      </div>
                                      <div className="free-slots__bottom-bar">
                                        <Button clickHandler={() => this.showConfirmDialog(slot)}>
                                          <span className="free-slots__name">
                                            {slot.name}
                                          </span>
                                          <Localized id="free-slots-take-slot">
                                            Take slot
                                          </Localized>
                                        </Button>
                                      </div>
                                    </li>
                                  ))
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
              <Localized id="free-slots-not-avaible">
                There are no free slots for you to take.
              </Localized>
        }
      </div>
    )
  }

  private takeSlot = (slot: FreeSlot) => {
    Process.takeSlot({ draft: slot.draft.module, slot: slot.id })
      .then(() => {
        store.dispatch(addAlert('success', 'free-slots-success', {
          slot: slot.name,
          draft: slot.draft.title,
        }))
        let books = this.state.books
        for (let [bookId, book] of books) {
          const index = book.freeSlots.findIndex(s => {
            return s.id === slot.id && s.draft.module === slot.draft.module
          })
          if (index >= 0) {
            book.freeSlots.splice(index, 1)
            break
          }
        }


        const freeSlots = this.state.freeSlots.filter(fs => fs.id !== slot.id)
        this.setState({ books, freeSlots })
        this.props.onUpdate(freeSlots)
      })
      .catch(e => {
        const details = e.response.data.error
        store.dispatch(addAlert('error', 'free-slots-error', {details: details ? details : 'none'}))
      })
  }
}

export default connect(mapStateToProps)(FreeSlots)

type NestableProps = {
  parts: BookPart[]
  freeSlots: FreeSlot[]
  onTakeSlot: (slot: FreeSlot) => void
}

const NestableCustomized = ({ parts, freeSlots, onTakeSlot }: NestableProps) => {
  const renderItem = ({ item, collapseIcon }: { item: PartData, index: number, collapseIcon: any, handler: any }) => {
    const slot = item.kind === 'module' ? freeSlots.find(s => s.draft.module === item.id) : null
    // "slot" may not be found because when user will take slot we are updating freeSlots
    // instead of fetching new list from the server.
    if (item.kind === 'module' && !slot) return null
    return (
        <div className={`bookpart__item bookpart__item--${item.kind} freeSlotsList__item--${item.kind}`}>
          {
            item.kind === 'group' ?
              <>
                <span className="bookpart__icon">
                  {collapseIcon}
                </span>
                <div
                  className="bookpart__title"
                  onClick={() => nestable.current!.toggleCollapseGroup(item.number)}
                >
                  {item.title}
                </div>
              </>
            :
              <>
                <div className="free-slots__top-bar">
                  <span className="free-slots__draft">
                    {slot!.draft.title}
                  </span>
                  <Button to={`/drafts/${slot!.draft.module}`}>
                    <Localized id="free-slots-view-draft">
                      View draft
                    </Localized>
                  </Button>
                </div>
                <div className="free-slots__bottom-bar">
                  <Button clickHandler={() => onTakeSlot(slot!)}>
                    <span className="free-slots__name">
                      {slot!.name}
                    </span>
                    <Localized id="free-slots-take-slot">
                      Take slot
                    </Localized>
                  </Button>
                </div>
              </>
          }
        </div>
      )
    }

  const renderCollapseIcon = ({isCollapsed}: {isCollapsed: boolean}) => {
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
