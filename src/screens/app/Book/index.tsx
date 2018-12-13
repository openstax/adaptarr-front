import * as React from 'react'
import Nestable from 'react-nestable'
import { connect } from 'react-redux'
import { AxiosResponse } from 'axios'
import { Trans } from 'react-i18next'

import axios from '../../../config/axios'

import Section from '../../../components/Section'
import Header from '../../../components/Header'
import Spinner from '../../../components/Spinner'
import AdminUI from '../../../components/AdminUI'
import SuperSession from '../../../components/SuperSession'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import Icon from '../../../components/ui/Icon'
import StackedBar from '../../../components/ui/StackedBar'
import Dialog from '../../../components/ui/Dialog'

import ModulesList from '../../../containers/ModulesList'

import * as types from '../../../store/types'
import { State } from '../../../store/reducers'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  team: {
    teamMap: types.TeamMap
  }
  modulesMap: {
    modulesMap: types.ModulesMap
  }
}

const mapStateToProps = ({ team, modulesMap }: State) => {
  return {
    team,
    modulesMap,
  }
}

// Nested component is adding `parts: []` to every item and we do not want that
const listWithoutEmptyParts = (arr: types.BookPart[]): types.BookPart[] => {
  const removeEmptyPartsFromItem = (item: types.BookPart): types.BookPart => {
    if (item.kind !== 'group') {
      const newItem = Object.assign({}, {...item})
      delete newItem.parts
      return newItem
    }
  
    return item
  }
  
  return arr.map((item: types.BookPart) => {
    if (item.parts && item.parts.length > 0) {
      return {
        ...item,
        parts: listWithoutEmptyParts(item.parts)
      }
    } else {
      return removeEmptyPartsFromItem(item)
    }
  })
}

class Book extends React.Component<Props> {
  state: {
    isLoading: boolean,
    book: types.Book,
    showModuleDetails: types.ModuleShortInfo | undefined,
    showAddModule: boolean,
    showAddGroup: boolean,
    showSuperSession: boolean,
    groupNameValue: string,
    targetGroup: types.BookPart | null,
    selectedModule: types.ModuleShortInfo | null
  } = {
    isLoading: true,
    book: {
      id: 'loading',
      title: '...',
      parts: []
    },
    showModuleDetails: undefined,
    showAddModule: false,
    showAddGroup: false,
    showSuperSession: false,
    groupNameValue: '',
    targetGroup: null,
    selectedModule: null,
  }

  private showModuleDetails = (item: types.BookPart) => {
    if (item.kind === 'module' && item.id) {
      const details = this.props.modulesMap.modulesMap.get(item.id)
      this.setState({ showModuleDetails: details })
    }
  }

  private closeModuleDetails = () => {
    this.setState({ showModuleDetails: undefined })
  }

  private renderItem = ({ item, collapseIcon }: { item: types.BookPart, index: number, collapseIcon: any, handler: any }) => {
    const { modulesMap } = this.props.modulesMap
    const { teamMap } = this.props.team
    let user
    let moduleStatus = (
      <span className="module__status module__status--ready">
        ready
      </span>
    )
    const placeholder: types.ModuleStatus[] = ['ready', 'ready', 'done', 'translation', 'review', 'review']

    if (item.kind === 'module' && item.id) {
      const mod = modulesMap.get(item.id)
      const assigne = mod ? mod.assignee : undefined
      user = assigne ? teamMap.get(assigne) : undefined
      if (mod && mod.status) {
        moduleStatus = (
          <span 
            className={`module__status module__status--${mod.status}`}
          >
            {mod.status}
          </span>
        )
      }
    }

    let classes = ['bookpart__item', `bookpart__item--${item.kind}`]
    return (
      <div className={classes.join(' ')}>
        <span 
          className="bookpart__title" 
          onClick={() => this.showModuleDetails(item)}
        >
          {item.title}
        </span>
        <span className="bookpart__info">
          {
            item.kind === 'group' ?
              <AdminUI>
                <Button color="green" clickHandler={() => this.showAddGroupDialog(item)}>
                  <Icon name="plus" />
                  Add group
                </Button>
                <Button color="green" clickHandler={() => this.showAddModuleDialog(item)}>
                  <Icon name="plus" />
                  Add module
                </Button>
              </AdminUI>
            : null
          }
          <span className="bookpart__status">
            {
              item.kind === 'group' ?
                <StackedBar data={placeholder}/>
              : moduleStatus
            }
          </span>
          {
            item.kind === 'module' && user ?
              <Avatar size="small" user={user} />
            : null
          }
          {
            item.kind === 'group' ?
              <span className="bookpart__icon">
                {collapseIcon}
              </span>
            : null
          }
        </span>
      </div>
    )
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

    let parent: types.BookPart | types.Book

    if (pathToParent.length === 0) {
      parent = this.state.book
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
    console.log(parent)
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
    this.setState({
      book: {
        ...this.state.book,
        parts: listWithoutEmptyParts(newItems),
      }
    })
  }

  private showAddGroupDialog = (target: types.BookPart) => {
    this.setState({ showAddGroup: true, targetGroup: target })
  }

  private closeAddGroupDialog = () => {
    this.setState({ showAddGroup: false, groupNameValue: '', targetGroup: null })
  }

  private addGroup = () => {
    const { targetGroup, groupNameValue } = this.state
    if (groupNameValue.length === 0) return
    console.log('addGroup to:', targetGroup)

    if (targetGroup) {
      const bookId = this.props.match.params.id
      const payload = {
        title: this.state.groupNameValue,
        parent: targetGroup.number,
        index: targetGroup.parts ? targetGroup.parts.length : 0,
        parts: [],
      }

      axios.post(`books/${bookId}/parts`, payload)
        .then(() => {
          this.closeAddGroupDialog()
          this.fetchBook()
        })
        .catch((e) => {
          if (e.request.status === 403) {
            this.setState({ showSuperSession: true })
          } else {
            console.error(e.message)
            this.closeAddGroupDialog()
          }
        })
      }
  }

  private showAddModuleDialog = (target: types.BookPart) => {
    this.setState({ showAddModule: true, targetGroup: target })
  }

  private closeAddModuleDialog = () => {
    this.setState({ showAddModule: false, targetGroup: null, selectedModule: null })
  }

  private handleModuleClick = (mod: types.ModuleShortInfo) => {
    this.setState({ selectedModule: mod }, this.addModule)
  }

  private addModule = () => {
    const { targetGroup, selectedModule } = this.state
    console.log('addModule to:', targetGroup)

    if (targetGroup && selectedModule) {
      const bookId = this.props.match.params.id
      const payload = {
        module: selectedModule.id,
        parent: targetGroup.number,
        index: targetGroup.parts ? targetGroup.parts.length : 0,
      }

      axios.post(`books/${bookId}/parts`, payload)
        .then(() => {
          this.closeAddModuleDialog()
          this.fetchBook()
        })
        .catch((e) => {
          if (e.request.status === 403) {
            this.setState({ showSuperSession: true })
          } else {
            console.error(e.message)
            this.closeAddModuleDialog()
          }
        })
    }
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
                parts: [res.data]
              }
            })
          })
          .catch((e: Error) => {
            console.error(e.message)
            this.setState({ isLoading: false })
          })
      })
      .catch((e: ErrorEvent) => {
        console.error(e.message)
        this.setState({ isLoading: false })
      })
  }

  private superSessionSuccess = () => {
    if (this.state.selectedModule) {
      this.addModule()
    } else if (this.state.groupNameValue) {
      this.addGroup()
    }
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    console.log('failure', e.message)
  }

  private updateGroupNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ groupNameValue: e.target.value })
  }

  componentDidMount () {
    this.fetchBook()
  }
  
  public render() {
    const { isLoading, book, showModuleDetails, showSuperSession, showAddModule, showAddGroup, groupNameValue } = this.state

    return (
      <div className="container container--splitted">
        {
          showSuperSession ?
            <SuperSession 
              onSuccess={this.superSessionSuccess} 
              onFailure={this.superSessionFailure}
              onAbort={() => this.setState({ showSuperSession: false })}/>
          : null
        }
        {
          showAddGroup ?
            <Dialog onClose={this.closeAddGroupDialog} i18nKey="Book.addGroupDialog">
              <form>
                <input 
                  type="text" 
                  value={groupNameValue}
                  placeholder="Title"
                  onChange={(e) => this.updateGroupNameValue(e)} />
                <Button 
                  color="green" 
                  clickHandler={this.addGroup}
                  isDisabled={!(groupNameValue.length > 0)}
                >
                  <Trans i18nKey="Buttons.confirm" />
                </Button>
                <Button 
                  color="red"
                  clickHandler={this.closeAddGroupDialog}
                >
                  <Trans i18nKey="Buttons.cancel" />
                </Button>
              </form>
            </Dialog>
          : null
        }
        {
          showAddModule ?
            <Dialog 
              size="medium"
              onClose={this.closeAddModuleDialog} 
              i18nKey="Book.addModuleDialog"
            >
              <ModulesList onModuleClick={this.handleModuleClick} />
            </Dialog>
          : null
        }
        <Section>
          <Header title={book.title}>
            <div className="book__status">
              <StackedBar data={['ready', 'ready', 'done', 'translation', 'review', 'review']} />
            </div>
          </Header>
          {
          !isLoading ?
            <Nestable
              isDisabled={false}
              items={book.parts}
              className="book-collection"
              childrenProp="parts"
              renderItem={this.renderItem}
              renderCollapseIcon={this.renderCollapseIcon}
              onMove={this.handleOnMove}
              onChange={this.handlePositionChange}
            />
            : <Spinner />
          }
        </Section>
        {
          showModuleDetails ?
            <Section>
              <Header title={showModuleDetails.title}>
                <Button size="small" clickHandler={this.closeModuleDetails}>
                  <Icon name="close" />
                </Button>
              </Header>
              <div className="section__content">
                {JSON.stringify(showModuleDetails)}
              </div>
            </Section>
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Book)
