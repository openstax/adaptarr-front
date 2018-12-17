import * as React from 'react'
import Nestable from 'react-nestable'
import { connect } from 'react-redux'
import { AxiosResponse } from 'axios'
import { Trans } from 'react-i18next'

import axios from 'src/config/axios'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import AdminUI from 'src/components/AdminUI'
import SuperSession from 'src/components/SuperSession'
import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import StackedBar from 'src/components/ui/StackedBar'
import Dialog from 'src/components/ui/Dialog'

import ModulesList from 'src/containers/ModulesList'

import * as types from 'src/store/types'
import { State } from 'src/store/reducers'

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

class Book extends React.Component<Props> {
  state: {
    isLoading: boolean,
    book: types.Book,
    showModuleDetails: types.ModuleShortInfo | undefined,
    showAddModule: boolean,
    showEditGroup: boolean,
    showAddGroup: boolean,
    showRemoveGroup: boolean,
    showSuperSession: boolean,
    groupNameValue: string,
    targetGroup: types.BookPart | null,
    selectedModule: types.ModuleShortInfo | null,
    showRemoveModule: boolean,
    targetModule: types.BookPart | null,
    titleInput: string,
  } = {
    isLoading: true,
    book: {
      id: 'loading',
      title: '...',
      parts: []
    },
    showModuleDetails: undefined,
    showAddModule: false,
    showEditGroup: false,
    showAddGroup: false,
    showRemoveGroup: false,
    showSuperSession: false,
    groupNameValue: '',
    targetGroup: null,
    selectedModule: null,
    showRemoveModule: false,
    targetModule: null,
    titleInput: '',
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

  private renderGroup = (item: types.BookPart, collapseIcon: any) => {
    const placeholder: types.ModuleStatus[] = ['ready', 'ready', 'done', 'translation', 'review', 'review']

    return (
      <React.Fragment>
        <span className="bookpart__title">
          {item.title}
        </span>
        <span className="bookpart__info">
          <AdminUI>
            <Button clickHandler={() => this.showEditGroupDialog(item)}>
              <Icon name="pencil" />
              Edit
            </Button>
            <Button color="green" clickHandler={() => this.showAddGroupDialog(item)}>
              <Icon name="plus" />
              Group
            </Button>
            <Button color="green" clickHandler={() => this.showAddModuleDialog(item)}>
              <Icon name="plus" />
              Module
            </Button>
            <Button color="red" clickHandler={() => this.showRemoveGroupDialog(item)}>
              <Icon name="minus" />
              Group
            </Button>
          </AdminUI>
          <span className="bookpart__status">
            <StackedBar data={placeholder}/>
          </span>
          <span className="bookpart__icon">
            {collapseIcon}
          </span>
        </span>
      </React.Fragment>
    )
  }

  private renderModule = (item: types.BookPart) => {
    const { modulesMap } = this.props.modulesMap
    const { teamMap } = this.props.team
    let assignedUser
    let moduleStatus = (
      <span className="module__status module__status--ready">
        ready
      </span>
    )

    if (item.id) {
      const mod = modulesMap.get(item.id)
      const assignee = mod ? mod.assignee : undefined
      assignedUser = assignee ? teamMap.get(assignee) : undefined
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

    return (
      <React.Fragment>
        <span 
          className="bookpart__title" 
          onClick={() => this.showModuleDetails(item)}
        >
          {item.title}
        </span>
        <span className="bookpart__info">
          <AdminUI>
            <Button color="red" clickHandler={() => this.showRemoveModuleDialog(item)}>
              <Icon name="minus" />
              Module
            </Button>
          </AdminUI>
          {
            assignedUser ?
              <Avatar size="small" user={assignedUser} />
            :
              <Button>
                Assign user
              </Button>
          }
          <span className="bookpart__status">
            { moduleStatus }
          </span>
        </span>
      </React.Fragment>
    )
  }

  private renderItem = ({ item, collapseIcon }: { item: types.BookPart, index: number, collapseIcon: any, handler: any }) => {
    return (
      <div className={`bookpart__item bookpart__item--${item.kind}`}>
        {
          item.kind === 'group' ?
            this.renderGroup(item, collapseIcon)
          : this.renderModule(item)
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
    const targetPosition = {
      parent: this.findParentWithinItems(newItems, realPathTo).number,
      index: realPathTo[realPathTo.length - 1]
    }
    axios.put(`/books/${bookId}/parts/${changedItem.number}`, targetPosition)
      .then(() => {
        this.fetchBook()
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
        } else {
          console.error(e.message)
        }
        this.fetchBook()
      })
  }

  private showEditGroupDialog = (target: types.BookPart) => {
    this.setState({ showEditGroup: true, targetGroup: target })
  }

  private closeEditGroupDialog = () => {
    this.setState({ showEditGroup: false, targetGroup: null, groupNameValue: '' })
  }

  private editGroup = () => {
    const { targetGroup, groupNameValue } = this.state
    if (groupNameValue.length === 0) return

    if (!targetGroup) return

    const bookId = this.props.match.params.id
    const payload = {
      title: groupNameValue,
    }

    axios.put(`books/${bookId}/parts/${targetGroup.number}`, payload)
      .then(() => {
        this.fetchBook()
        this.closeEditGroupDialog()
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
        } else {
          console.error(e.message)
          this.closeEditGroupDialog()
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

  private showRemoveGroupDialog = (target: types.BookPart) => {
    this.setState({ showRemoveGroup: true, targetGroup: target })
  }

  private closeRemoveGroupDialog = () => {
    this.setState({ showRemoveGroup: false, targetGroup: null })
  }

  private removeGroup = () => {
    const bookId = this.props.match.params.id
    const targetGroup = this.state.targetGroup

    if (!targetGroup) return

    axios.delete(`books/${bookId}/parts/${targetGroup.number}`)
      .then(() => {
        this.closeRemoveGroupDialog()
        this.fetchBook()
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
        } else {
          console.error(e.message)
          this.closeRemoveGroupDialog()
        }
      })
  }

  private showRemoveModuleDialog = (target: types.BookPart) => {
    this.setState({ showRemoveModule: true, targetModule: target })
  }

  private closeRemoveModuleDialog = () => {
    this.setState({ showRemoveModule: false, targetModule: null })
  }

  private removeModule = () => {
    const bookId = this.props.match.params.id
    const targetModule = this.state.targetModule

    if (!targetModule) return

    axios.delete(`books/${bookId}/parts/${targetModule.number}`)
      .then(() => {
        this.closeRemoveModuleDialog()
        this.fetchBook()
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
        } else {
          console.error(e.message)
          this.closeRemoveModuleDialog()
        }
      })
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
    if (this.state.selectedModule && this.state.showAddModule) {
      this.addModule()
    } else if (this.state.groupNameValue && this.state.showAddGroup) {
      this.addGroup()
    } else if (this.state.groupNameValue && this.state.showEditGroup) {
      this.editGroup()
    } else if (this.state.targetGroup && this.state.showRemoveGroup) {
      this.removeGroup()
    } else if (this.state.targetModule && this.state.showRemoveModule) {
      this.removeModule()
    }

    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    console.log('failure', e.message)
  }

  private updateGroupNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ groupNameValue: e.target.value })
  }

  private updateTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    this.setState({ titleInput: input.value })
  }

  private changeBookTitle = () => {
    const bookId = this.props.match.params.id
    const titleInput = this.state.titleInput

    if (!titleInput) return

    axios.put(`books/${bookId}`, {title: titleInput})
      .then(() => {
        this.setState({ 
          book: {...this.state.book, title: titleInput},
          titleInput: '',
        })
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
        } else {
          console.error(e.message)
        }
      })
  }

  componentDidMount () {
    this.fetchBook()
  }
  
  public render() {
    const { 
      isLoading, 
      book, 
      showModuleDetails, 
      showSuperSession, 
      showAddModule, 
      showEditGroup, 
      showAddGroup, 
      groupNameValue, 
      showRemoveGroup, 
      showRemoveModule, 
      titleInput,
    } = this.state

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
          showEditGroup ?
            <Dialog onClose={this.closeEditGroupDialog} i18nKey="Book.editGroupDialog">
              <form>
                <input 
                  type="text" 
                  value={groupNameValue}
                  placeholder="New title"
                  onChange={(e) => this.updateGroupNameValue(e)} />
                <Button 
                  color="green" 
                  clickHandler={this.editGroup}
                  isDisabled={!(groupNameValue.length > 0)}
                >
                  <Trans i18nKey="Buttons.confirm" />
                </Button>
                <Button 
                  color="red"
                  clickHandler={this.closeEditGroupDialog}
                >
                  <Trans i18nKey="Buttons.cancel" />
                </Button>
              </form>
            </Dialog>
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
        {
          showRemoveGroup ?
            <Dialog 
              onClose={this.closeRemoveGroupDialog} 
              i18nKey="Book.removeGroupDialog"
            >
              <Button 
                color="green" 
                clickHandler={this.removeGroup}
              >
                <Trans i18nKey="Buttons.delete" />
              </Button>
              <Button 
                color="red"
                clickHandler={this.closeRemoveGroupDialog}
              >
                <Trans i18nKey="Buttons.cancel" />
              </Button>
            </Dialog>
          : null
        }
        {
          showRemoveModule ?
            <Dialog 
              onClose={this.closeRemoveModuleDialog} 
              i18nKey="Book.removeModuleDialog"
            >
              <Button 
                color="green" 
                clickHandler={this.removeModule}
              >
                <Trans i18nKey="Buttons.delete" />
              </Button>
              <Button 
                color="red"
                clickHandler={this.closeRemoveModuleDialog}
              >
                <Trans i18nKey="Buttons.cancel" />
              </Button>
            </Dialog>
          : null
        }
        <Section>
          <Header title={book.title}>
            <AdminUI>
              <input type="text" value={this.state.titleInput} onChange={(e) => this.updateTitleInput(e)} placeholder="Change title" />
              <Button 
                isDisabled={!(titleInput.length > 0)}
                clickHandler={this.changeBookTitle}
              >
                <Icon name="plus"/>
              </Button>
            </AdminUI>
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
