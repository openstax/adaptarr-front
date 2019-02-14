import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import * as api from 'src/api'
import sortArrayByTitle from 'src/helpers/sortArrayByTitle'
import { State } from 'src/store/reducers'
import { BooksMap } from 'src/store/types'

import Button from 'src/components/ui/Button'

type Props = {
  modules: {
    assignedToMe: api.Module[]
  }
  booksMap: {
    booksMap: BooksMap
  }
  drafts: api.Draft[]
  onCreateDraft: (mod: api.Module) => any
}

type BooksWithModules = {
  books: api.Book[]
  modules: api.Module[]
}

const mapStateToProps = ({ modules, booksMap }: State) => {
  return {
    modules,
    booksMap,
  }
}

class AssignedToMe extends React.Component<Props> {

  state: {
    booksWithModules: Map<string, BooksWithModules> | undefined
  } = {
    booksWithModules: undefined,
  }

  private sortModulesByBooksName = async () => {
    const { modules: { assignedToMe }, booksMap: { booksMap } } = this.props

    let modulesByBooks: Map<string, BooksWithModules> = new Map()

    for (const mod of assignedToMe) {
      const booksIds = await mod.books()
      const books = booksIds.map(bookId => booksMap.get(bookId)!)

      let booksName = books.length ? '' : 'Not assigned to any book'
      books.forEach((b, i) => {
        if (i === books.length - 1) {
          booksName += b.title
        } else {
          booksName += b.title + ', '
        }
      })

      const booksWithModules = modulesByBooks.get(booksName)

      if (booksWithModules) {
        // Update modules list for this books
        let mods = booksWithModules.modules
        if (!mods.some(m => m.id === mod.id)) {
          // If this modules is not on the list for this books then add it
          mods.push(mod)
        }
        modulesByBooks.set(booksName, {books: booksWithModules.books, modules: mods.sort(sortArrayByTitle)})
      } else {
        // Create entry for this books
        modulesByBooks.set(booksName, {books, modules: [mod]})
      }
    }

    this.setState({ booksWithModules: modulesByBooks })
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.modules.assignedToMe !== this.props.modules.assignedToMe) {
      this.sortModulesByBooksName()
    }
  }

  componentDidMount = () => {
    this.sortModulesByBooksName()
  }
  
  public render() {
    const { booksWithModules } = this.state
    const { drafts } = this.props

    return (
      <div className="modulesList">
        {
          booksWithModules ?
            <ul className="list">
              {
                Array.from(booksWithModules.entries()).map(([booksName, data]) => (
                  <li key={booksName} className="list__item modulesList__book">
                    <strong>{booksName}</strong>
                    {
                      data.modules.length ?
                        <ul className="list">
                          {
                            data.modules.map(mod => (
                              <li key={mod.id} className="list__item">
                                <span className="list__title">
                                  {mod.title}
                                </span>
                                <span className="list__buttons">
                                  {
                                   drafts.some(draft => draft.module === mod.id) ?
                                      <Button 
                                        to={`/modules/${mod.id}`}
                                      >
                                        <Trans i18nKey="Buttons.viewDraft" />
                                      </Button>
                                    :
                                      <Button
                                        color="green"
                                        clickHandler={() => this.props.onCreateDraft(mod)}
                                      >
                                        <Trans i18nKey="Buttons.newDraft" />
                                      </Button>
                                  }
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
          : <Trans i18nKey="AssignedToMe.noAssigned"/>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(AssignedToMe)
