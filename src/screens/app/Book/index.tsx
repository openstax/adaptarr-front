import './index.css'

import * as React from 'react'
import Nestable from 'react-nestable'
import { History } from 'history'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import * as api from 'src/api'
import { PartData, GroupData, ModuleData } from 'src/api/bookpart'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import AdminUI from 'src/components/AdminUI'
import EditBook from 'src/components/EditBook'
import BookPartGroup from 'src/components/BookPartGroup'
import BookPartModule from 'src/components/BookPartModule'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ModulePreview from 'src/containers/ModulePreview'

import * as types from 'src/store/types'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/Alerts'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  history: History
  team: {
    teamMap: types.TeamMap
  }
  modules: {
    modulesMap: types.ModulesMap
  }
  addAlert: (kind: types.RequestInfoKind, message: string, args?: object) => void
}

const mapStateToProps = ({ team, modules }: State) => {
  return {
    team,
    modules,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addAlert: (kind: types.RequestInfoKind, message: string) => dispatch(addAlert(kind, message)),
  }
}

class Book extends React.Component<Props> {
  state: {
    isLoading: boolean
    book?: api.Book
    parts: api.BookPart[]
    showModuleDetails: api.Module | undefined
    showEditBook: boolean
    disableDragging: boolean
  } = {
    isLoading: true,
    parts: [],
    showModuleDetails: undefined,
    showEditBook: false,
    disableDragging: true,
  }

  private showModuleDetails = (item: api.BookPart) => {
    if (item.kind === 'module' && item.id) {
      const details = this.props.modules.modulesMap.get(item.id)
      this.setState({ showModuleDetails: details })
    }
  }

  private closeModuleDetails = () => {
    this.setState({ showModuleDetails: undefined })
  }

  private renderItem = ({ item, collapseIcon }: { item: PartData, index: number, collapseIcon: any, handler: any }) => {
    return (
      <div className={`bookpart__item bookpart__item--${item.kind}`}>
        {
          item.kind === 'group' ?
            <BookPartGroup
              item={new api.BookPart((item as GroupData), this.state.book!)}
              book={this.state.book!}
              collapseIcon={collapseIcon}
              afterAction={this.fetchBook}
            />
          : <BookPartModule
              item={new api.BookPart((item as ModuleData), this.state.book!)}
              onModuleClick={this.showModuleDetails}
              afterAction={this.fetchBook}
            />
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

  private findParentWithinItems = (items: api.BookPart[], path: number[]) => {
    let pathToParent = [...path]
    pathToParent.pop() // remove last index because it's pointing to changedItem

    let parent: api.BookPart

    if (pathToParent.length === 0) {
      parent = this.state.parts[0]
    } else {
      parent = items[pathToParent[0]]
      pathToParent.shift()

      // If there are still some indexes then process them
      if (pathToParent.length > 0) {
        pathToParent.forEach(index => {
          if (parent && parent.parts && parent.parts[index]) {
            parent = parent.parts[index]
          } else {
            throw new Error(`Couldn't find parent for item at path: ${JSON.stringify(path)}`)
          }
        })
      }
    }

    return parent
  }

  private handleOnMove = (newItems: api.BookPart[], changedItem: api.BookPart, realPathTo: number[]) => {
    // Do not move bookparts into modules
    // TODO: Create new part when user move module into module
    const parent: api.BookPart | api.Book = this.findParentWithinItems(newItems, realPathTo)

    if (typeof (parent as api.BookPart).number !== 'number') {
      console.log('You can not move items outside book.')
      return false
    } else if ((parent as api.BookPart).kind === 'module') {
      console.log('You can not move modules into modules.')
      return false
    }

    return true
  }

  private handlePositionChange = (newItems: api.BookPart[], changedItem: api.BookPart, realPathTo: number[]) => {

    const targetParent = this.findParentWithinItems(newItems, realPathTo)
    const targetPosition = {
      parent: targetParent.number,
      index: realPathTo[realPathTo.length - 1]
    }
    changedItem.update(targetPosition)
      .then(() => {
        this.fetchBook()
        this.props.addAlert('success', 'book-part-moving-alert-success', {item: changedItem.title, target: targetParent.title})
      })
      .catch(e => {
        this.props.addAlert('error', e.message)
        this.fetchBook()
      })
  }

  private fetchBook = (id: string = this.props.match.params.id) => {
    api.Book.load(id)
      .then(book => {
        this.setState({ book })
        return book.parts()
          .then(parts => {
            this.setState({ isLoading: false, parts: [parts] })
          })
          .catch(e => {
            this.setState({ isLoading: false })
            this.props.addAlert('error', 'book-fetch-error', {title: book.title, details: e.message})
          })
      })
      .catch(() => {
        this.props.history.push('/404')
      })
  }

  private showEditBook = () => {
    this.setState({ showEditBook: true })
  }

  private closeEditBook = () => {
    this.setState({ showEditBook: false })
  }

  private handleEditBookSuccess = () => {
    this.setState({ showEditBook: false })
    this.fetchBook()
  }

  private toggleDragging = () => {
    this.setState({ disableDragging: !this.state.disableDragging })
  }

  componentDidMount () {
    this.fetchBook()
  }

  public render() {
    const {
      isLoading,
      book,
      parts,
      showModuleDetails,
      disableDragging,
      showEditBook,
    } = this.state

    const title = book ? book.title : 'Loading'
    const titleKey = book ? 'book-view-title' : 'book-view-title-loading'

    return (
      <div className="container container--splitted">
        {
          showEditBook ?
            <EditBook
              book={book!}
              onClose={this.closeEditBook}
              onSuccess={this.handleEditBookSuccess}
            />
          : null
        }
        <Section>
          <Header l10nId={titleKey} title={title}>
            <AdminUI>
              <Button
                clickHandler={this.showEditBook}
              >
                <Icon name="pencil"/>
              </Button>
              <div className="lock-swiping">
                {
                  disableDragging ?
                    <React.Fragment>
                      <Localized id="book-part-moving-locked">
                        Moving modules is locked.
                      </Localized>
                      <Button
                        clickHandler={this.toggleDragging}
                      >
                        <Icon name="lock"/>
                      </Button>
                    </React.Fragment>
                  :
                    <React.Fragment>
                      <Localized id="book-part-moving-unlocked">
                        Now you can move modules.
                      </Localized>
                      <Button
                        clickHandler={this.toggleDragging}
                      >
                        <Icon name="unlock"/>
                      </Button>
                    </React.Fragment>
                }
              </div>
            </AdminUI>
          </Header>
          {
            !isLoading ?
              <Nestable
                isDisabled={disableDragging}
                items={parts}
                className="book-collection"
                childrenProp="parts"
                renderItem={this.renderItem}
                renderCollapseIcon={this.renderCollapseIcon}
                onMove={this.handleOnMove}
                onChange={this.handlePositionChange}
                collapsed
              />
            : <Spinner />
          }
        </Section>
        {
          showModuleDetails ?
            <Section>
              <Header l10nId="module-view-title" title={showModuleDetails.title}>
                <Button to={`/modules/${showModuleDetails.id}`}>
                  <Localized id="module-go-to">
                    Go to module
                  </Localized>
                </Button>
                <Button size="small" clickHandler={this.closeModuleDetails}>
                  <Icon name="close" />
                </Button>
              </Header>
              <div className="section__content">
                <ModulePreview moduleId={showModuleDetails.id}/>
              </div>
            </Section>
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Book)
