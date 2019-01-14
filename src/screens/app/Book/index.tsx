import './index.css'

import * as React from 'react'
import Nestable from 'react-nestable'
import { History } from 'history'
import { connect } from 'react-redux'
import { AxiosResponse } from 'axios'
import { Trans } from 'react-i18next'

import i18n from 'src/i18n'
import axios from 'src/config/axios'

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
  addAlert: (kind: types.RequestInfoKind, message: string) => void
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
    book: types.Book
    showModuleDetails: types.ModuleShortInfo | undefined
    showEditBook: boolean
    disableDragging: boolean
  } = {
    isLoading: true,
    book: {
      id: 'loading',
      title: '...',
      parts: []
    },
    showModuleDetails: undefined,
    showEditBook: false,
    disableDragging: true,
  }

  private showModuleDetails = (item: types.BookPartModule) => {
    if (item.kind === 'module' && item.id) {
      const details = this.props.modules.modulesMap.get(item.id)
      this.setState({ showModuleDetails: details })
    }
  }

  private closeModuleDetails = () => {
    this.setState({ showModuleDetails: undefined })
  }

  private renderItem = ({ item, collapseIcon }: { item: types.BookPart | types.BookPartModule | types.BookPartGroup, index: number, collapseIcon: any, handler: any }) => {
    return (
      <div className={`bookpart__item bookpart__item--${item.kind}`}>
        {
          item.kind === 'group' ?
            <BookPartGroup
              item={(item as types.BookPartGroup)}
              bookId={this.props.match.params.id}
              collapseIcon={collapseIcon}
              afterAction={this.fetchBook}
            />
          : <BookPartModule
              item={(item as types.BookPartModule)}
              bookId={this.props.match.params.id}
              onModuleClick={this.showModuleDetails}
              onModuleRemove={this.fetchBook}
              onAssignUser={this.onAssignUser}
            />
        }
      </div>
    )
  }

  private onAssignUser = () => {
    // After update of assignee we could fetchBook and modulesMaps
    // or just update them. Updating is faster so there we go:
    const updatedBook = {
      ...this.state.book,
      parts: this.injectMoreInfo(this.state.book.parts[0])
    }
    this.setState({ book: updatedBook })
  }

  private renderCollapseIcon = ({isCollapsed}: {isCollapsed: boolean}) => {
    if (isCollapsed) {
      return <Icon name="arrow-right"/>
    }

    return <Icon name="arrow-down" />
  }

  private findParentWithinItems = (items: types.BookPart[], path: number[]) => {
    let pathToParent = [...path]
    pathToParent.pop() // remove last index because it's pointing to changedItem

    let parent: types.BookPart

    if (pathToParent.length === 0) {
      parent = this.state.book.parts[0]
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

  private handleOnMove = (newItems: types.BookPart[], changedItem: types.BookPart, realPathTo: number[]) => {
    // Do not move bookparts into modules
    // TODO: Create new part when user move module into module
    const parent: types.BookPart | types.Book = this.findParentWithinItems(newItems, realPathTo)

    if (typeof (parent as types.BookPart).number !== 'number') {
      console.log('You can not move items outside book.')
      return false
    } else if ((parent as types.BookPart).kind === 'module') {
      console.log('You can not move modules into modules.')
      return false
    }
    
    return true
  }

  private handlePositionChange = (newItems: types.BookPart[], changedItem: types.BookPart, realPathTo: number[]) => {
  
    const bookId = this.props.match.params.id
    const targetParent = this.findParentWithinItems(newItems, realPathTo)
    const targetPosition = {
      parent: targetParent.number,
      index: realPathTo[realPathTo.length - 1]
    }
    axios.put(`/books/${bookId}/parts/${changedItem.number}`, targetPosition)
      .then(() => {
        this.fetchBook()
        this.props.addAlert('success', i18n.t("Book.positionChangeSuccess", {item: changedItem.title, target: targetParent.title}))
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          this.props.addAlert('info', i18n.t("Admin.confirmSuperSession"))
        } else {
          this.props.addAlert('error', e.message)
        }
        this.fetchBook()
      })
  }

  private injectMoreInfo = (obj: types.BookPart): types.BookParts => {
    const { modulesMap } = this.props.modules
    const { teamMap } = this.props.team
    let allModStatuses: types.ModuleStatus[] = []

    const injectInfoToBookPart = (bp: types.BookPart): types.BookPart | types.BookPartModule | types.BookPartGroup => {
      if (bp.kind === 'module' && bp.id) {

        const mod = modulesMap.get(bp.id)
        const assignee = mod && mod.assignee && teamMap.get(mod.assignee) ? teamMap.get(mod.assignee) : undefined
        const status = mod && mod.status ? mod.status : 'ready'

        return {...bp, status, assignee}

      } else if (bp.kind === 'group') {

        const {parts, modStatuses} = injectInfoToParts(bp.parts ? bp.parts : [])
        allModStatuses = allModStatuses.concat(modStatuses)
        return {...bp, parts, modStatuses}

      } else {
        return bp
      }
    }

    const injectInfoToParts = (parts: types.BookPart[]): {parts: types.BookParts, modStatuses: types.ModuleStatus[]} => {
      let newParts: types.BookParts = []
      let modStatuses: types.ModuleStatus[] = []
      parts.forEach(p => {
        const newPart = injectInfoToBookPart(p)
        newParts.push(newPart)
        if ((newPart as types.BookPartModule).status) {
          modStatuses.push((newPart as types.BookPartModule).status)
        }
      })
      return {parts: newParts, modStatuses }
    }

    let res = injectInfoToBookPart(obj)

    // We are returning this as an array for react-nestable
    return [{...res, modStatuses: allModStatuses}]
  }

  private fetchBook = (id: string = this.props.match.params.id) => {
    axios.get(`books/${id}`)
      .then((res: AxiosResponse) => {
        this.setState({ book: res.data })
        axios.get(`books/${id}/parts`)
          .then((res: AxiosResponse) => {
            this.setState({
              isLoading: false,
              book: {
                ...this.state.book,
                parts: this.injectMoreInfo(res.data)
              }
            })
          })
          .catch((e: Error) => {
            this.setState({ isLoading: false })
            this.props.addAlert('error', i18n.t("Book.fetchError", {title: res.data.title, details: e.message}))
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
      showModuleDetails,
      disableDragging,
      showEditBook,
    } = this.state

    return (
      <div className="container container--splitted">
        {
          showEditBook ?
            <EditBook
              book={book}
              onClose={this.closeEditBook}
              onSuccess={this.handleEditBookSuccess}
            />
          : null
        }
        <Section>
          <Header title={book.title}>
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
                      <Trans i18nKey="Book.draggingLocked"/>
                      <Button
                        clickHandler={this.toggleDragging}
                      >
                        <Icon name="lock"/>
                      </Button>
                    </React.Fragment>
                  : 
                    <React.Fragment>
                      <Trans i18nKey="Book.draggingUnlocked"/>
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
              items={book.parts}
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
              <Header title={showModuleDetails.title}>
                <Button to={`/modules/${showModuleDetails.id}`}>
                  <Trans i18nKey="Buttons.goToModule"/>
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
