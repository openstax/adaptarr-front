import * as React from 'react'
import Nestable from 'react-nestable'
import { History } from 'history'
import { connect } from 'react-redux'
import { AxiosResponse } from 'axios'
import { Trans } from 'react-i18next'

import axios from 'src/config/axios'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import AdminUI from 'src/components/AdminUI'
import SuperSession from 'src/components/SuperSession'
import EditBook from 'src/components/EditBook'
import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import StackedBar from 'src/components/ui/StackedBar'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import ModulesList from 'src/containers/ModulesList'
import UsersList from 'src/containers/UsersList'
import ModulePreview from 'src/containers/ModulePreview'

import * as types from 'src/store/types'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/Alerts'
import { setAssigneeInModulesMap } from 'src/store/actions/Modules'

type DialogActions = 'editGroup' | 'addGroup' | 'removeGroup' | 'addModule' | 'removeModule' | 'assignUser' | 'assignUser' | undefined

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
  setAssigneeInModulesMap: (moduleId: string, assignee: number | null) => void
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
    setAssigneeInModulesMap: (moduleId: string, assignee: number | null) => dispatch(setAssigneeInModulesMap(moduleId, assignee))
  }
}

class Book extends React.Component<Props> {
  state: {
    isLoading: boolean,
    book: types.Book,
    showModuleDetails: types.ModuleShortInfo | undefined,
    showDialog: boolean,
    showEditBook: boolean,
    dialogAction: DialogActions
    showSuperSession: boolean,
    groupNameValue: string,
    targetGroup: types.BookPart | null,
    selectedModule: types.ModuleShortInfo | null,
    userToAssign: types.User | null,
    assignAction: 'assign' | 'remove',
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
    showDialog: false,
    showEditBook: false,
    dialogAction: undefined,
    showSuperSession: false,
    groupNameValue: '',
    targetGroup: null,
    selectedModule: null,
    userToAssign: null,
    assignAction: 'assign',
    targetModule: null,
    titleInput: '',
  }

  private showModuleDetails = (item: types.BookPart) => {
    if (item.kind === 'module' && item.id) {
      const details = this.props.modules.modulesMap.get(item.id)
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
            <Button clickHandler={() => this.showActionsDialog(item, 'editGroup')}>
              <Icon name="pencil" />
              <Trans i18nKey="Buttons.edit" />
            </Button>
            <Button color="green" clickHandler={() => this.showActionsDialog(item, 'addGroup')}>
              <Icon name="plus" />
              <Trans i18nKey="Buttons.group" />
            </Button>
            <Button color="red" clickHandler={() => this.showActionsDialog(item, 'removeGroup')}>
              <Icon name="minus" />
              <Trans i18nKey="Buttons.group" />
            </Button>
            <Button color="green" clickHandler={() => this.showActionsDialog(item, 'addModule')}>
              <Icon name="plus" />
              <Trans i18nKey="Buttons.module" />
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
    const { modulesMap } = this.props.modules
    const { teamMap } = this.props.team
    let assignedUser: types.User | undefined
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
            <Button
              color="red"
              clickHandler={() => this.showActionsDialog(item, 'removeModule')}
            >
              <Icon name="minus" />
              <Trans i18nKey="Buttons.module" />
            </Button>
          </AdminUI>
          {
            assignedUser ?
              <React.Fragment>
                <Avatar size="small" user={assignedUser} />
                <Button
                  clickHandler={() => this.handleUserClick((assignedUser as types.User), 'remove', item)}
                >
                  <Trans i18nKey="Buttons.unassign" />
                </Button>
                <Button clickHandler={() => this.showActionsDialog(item, 'assignUser')}>
                  <Trans i18nKey="Buttons.assignOther" />
                </Button>
              </React.Fragment>
            :
              <Button clickHandler={() => this.showActionsDialog(item, 'assignUser')}>
                <Trans i18nKey="Buttons.assign" />
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
    const targetParent = this.findParentWithinItems(newItems, realPathTo)
    const targetPosition = {
      parent: targetParent.number,
      index: realPathTo[realPathTo.length - 1]
    }
    axios.put(`/books/${bookId}/parts/${changedItem.number}`, targetPosition)
      .then(() => {
        this.fetchBook()
        this.props.addAlert('success', `${changedItem.title} was moved to ${targetParent.title}.`)
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          this.props.addAlert('info', 'You have to confirm this action.')
        } else {
          this.props.addAlert('error', e.message)
        }
        this.fetchBook()
      })
  }

  private showActionsDialog = (target: types.BookPart, dialogAction: DialogActions) => {
    let newState: {
      showDialog: boolean
      dialogAction: DialogActions
      targetModule?: types.BookPart
      targetGroup?: types.BookPart
      groupNameValue?: string
    } = {
      showDialog: true,
      dialogAction,
    }

    if (dialogAction === 'addGroup' || dialogAction === 'removeGroup' || dialogAction === 'editGroup') {
      newState.groupNameValue = target.title,
      newState.targetGroup = target
    } else if (dialogAction === 'addModule') {
      newState.targetGroup = target
    } else if (dialogAction === 'removeModule') {
      newState.targetModule = target
    } else if (dialogAction === 'assignUser') {
      newState.targetModule = target
    }

    this.setState({...newState})
  }

  private editGroup = () => {
    const { targetGroup, groupNameValue } = this.state
    if (groupNameValue.length === 0) return

    if (!targetGroup) {
      return this.props.addAlert('error', `targetGroup: ${targetGroup}`)
    }

    const bookId = this.props.match.params.id
    const payload = {
      title: groupNameValue,
    }

    axios.put(`books/${bookId}/parts/${targetGroup.number}`, payload)
      .then(() => {
        this.fetchBook()
        this.closeActionsDialog()
        this.props.addAlert('success', `Group title was change from ${targetGroup.title} to ${groupNameValue}.`)
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          this.props.addAlert('info', 'You have to confirm this action.')
        } else {
          this.props.addAlert('error', e.message)
          this.closeActionsDialog()
        }
      })
    
  }

  private addGroup = () => {
    const { targetGroup, groupNameValue } = this.state
    if (!groupNameValue.length) return

    if (!targetGroup) {
      return this.props.addAlert('error', `targetGroup: ${targetGroup}`)
    }

    const bookId = this.props.match.params.id
    const payload = {
      title: this.state.groupNameValue,
      parent: targetGroup.number,
      index: targetGroup.parts ? targetGroup.parts.length : 0,
      parts: [],
    }

    axios.post(`books/${bookId}/parts`, payload)
      .then(() => {
        this.closeActionsDialog()
        this.fetchBook()
        this.props.addAlert('success', `New group was added successfully.`)
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          this.props.addAlert('info', 'You have to confirm this action.')
        } else {
          this.props.addAlert('error', e.message)
          this.closeActionsDialog()
        }
      })
    
  }

  private removeGroup = () => {
    const bookId = this.props.match.params.id
    const targetGroup = this.state.targetGroup

    if (!targetGroup) {
      return this.props.addAlert('error', `targetGroup: ${targetGroup}`)
    }

    axios.delete(`books/${bookId}/parts/${targetGroup.number}`)
      .then(() => {
        this.closeActionsDialog()
        this.fetchBook()
        this.props.addAlert('success', `Group ${targetGroup.title} was removed successfully.`)
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          this.props.addAlert('info', 'You have to confirm this action.')
        } else {
          this.props.addAlert('error', e.message)
          this.closeActionsDialog()
        }
      })
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
          this.closeActionsDialog()
          this.fetchBook()
          this.props.addAlert('success', `${selectedModule.title} was added to the group.`)
        })
        .catch((e) => {
          if (e.request.status === 403) {
            this.setState({ showSuperSession: true })
            this.props.addAlert('info', 'You have to confirm this action.')
          } else {
            this.props.addAlert('error', e.message)
            this.closeActionsDialog()
          }
        })
    } else {
      console.error('targetGroup:', targetGroup, 'selectedModule:', selectedModule)
    }
  }

  private removeModule = () => {
    const bookId = this.props.match.params.id
    const targetModule = this.state.targetModule

    if (!targetModule) {
      return console.error('targetModule:', targetModule)
    }

    axios.delete(`books/${bookId}/parts/${targetModule.number}`)
      .then(() => {
        this.closeActionsDialog()
        this.fetchBook()
        this.props.addAlert('success', `Module ${targetModule.title} was removed successfully.`)
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          this.props.addAlert('info', 'You have to confirm this action.')
        } else {
          this.props.addAlert('error', e.message)
          this.closeActionsDialog()
        }
      })
  }

  private handleUserClick = (user: types.User, action: 'assign' | 'remove', targetModule?: types.BookPart) => {
    let newState: {
      userToAssign: types.User
      assignAction: 'assign' | 'remove'
      targetModule?: types.BookPart
    } = {
      userToAssign: user,
      assignAction: action,
    }

    if (targetModule) {
      newState.targetModule = targetModule
    }

    this.setState({ ...newState }, this.assignUser)
  }

  private assignUser = () => {
    const { userToAssign: user, assignAction, targetModule } = this.state

    if (!targetModule || !user) {
      return this.props.addAlert('error', 'Target module or user are undefined.')
    }

    const payload = {
      assignee: assignAction === 'assign' ? user.id : null
    }

    axios.put(`modules/${targetModule.id}`, payload)
      .then(() => {
        if (assignAction === 'assign') {
          this.props.addAlert('success', `${user.name} was assigned to ${targetModule.title}.`)
        } else if (assignAction === 'remove') {
          this.props.addAlert('success', `${user.name} was unassigned from ${targetModule.title}.`)
        }     
        this.closeActionsDialog()
        if (targetModule.id) {
          this.props.setAssigneeInModulesMap(targetModule.id, payload.assignee)
        }
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          this.props.addAlert('info', 'You have to confirm this action.')
        } else {
          this.props.addAlert('error', e.message)
          this.closeActionsDialog()
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
            this.setState({ isLoading: false })
            this.props.addAlert('error', `Couldn't load parts for: ${res.data.title}. Details: ${e.message}`)
          })
      })
      .catch(() => {
        this.props.history.push('/404')
      })
  }

  private superSessionSuccess = () => {
    const dialogAction = this.state.dialogAction
    if (this.state.selectedModule && dialogAction === 'addModule') {
      this.addModule()
    } else if (this.state.targetModule && dialogAction === 'removeModule') {
      this.removeModule()
    } else if (this.state.groupNameValue && dialogAction === 'addGroup') {
      this.addGroup()
    } else if (this.state.groupNameValue && dialogAction === 'editGroup') {
      this.editGroup()
    } else if (this.state.targetGroup && dialogAction === 'removeGroup') {
      this.removeGroup()
    } else if (this.state.targetModule && dialogAction === 'assignUser') {
      this.assignUser()
    }

    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    this.props.addAlert('error', e.message)
  }

  private updateGroupNameValue = (val: string) => {
    this.setState({ groupNameValue: val })
  }

  private showEditBook = () => {
    this.setState({ showEditBook: true })
  }

  private actionsDialog = () => {
    const { dialogAction, groupNameValue, targetModule } = this.state
    let titlei18nKey = ''
    let body

    switch (dialogAction){
      case 'addGroup':
        titlei18nKey = 'Book.addGroupDialog'
        body = (
          <form>
            <Input
              placeholder="Title"
              onChange={this.updateGroupNameValue}
              autoFocus
              validation={{minLength: 3}}
            />
            <Button 
              color="green" 
              clickHandler={this.addGroup}
              isDisabled={!(groupNameValue.length > 0)}
            >
              <Trans i18nKey="Buttons.confirm" />
            </Button>
            <Button 
              color="red"
              clickHandler={this.closeActionsDialog}
            >
              <Trans i18nKey="Buttons.cancel" />
            </Button>
          </form>
        )
        break
      case 'editGroup':
      titlei18nKey = 'Book.editGroupDialog'
        body = (
          <form>
            <Input 
              value={groupNameValue}
              placeholder="New title"
              onChange={this.updateGroupNameValue}
              autoFocus
              validation={{minLength: 3}}
            />
            <Button 
              color="green" 
              clickHandler={this.editGroup}
              isDisabled={!(groupNameValue.length > 0)}
            >
              <Trans i18nKey="Buttons.confirm" />
            </Button>
            <Button 
              color="red"
              clickHandler={this.closeActionsDialog}
            >
              <Trans i18nKey="Buttons.cancel" />
            </Button>
          </form>
        )
        break
      case 'removeGroup':
        titlei18nKey = 'Book.removeGroupDialog'
        body = (
          <React.Fragment>
            <Button 
              color="green" 
              clickHandler={this.removeGroup}
            >
              <Trans i18nKey="Buttons.delete" />
            </Button>
            <Button 
              color="red"
              clickHandler={this.closeActionsDialog}
            >
              <Trans i18nKey="Buttons.cancel" />
            </Button>
          </React.Fragment>
        )
        break
      case 'addModule':
        titlei18nKey = 'Book.addModuleDialog'
        body = (
          <ModulesList onModuleClick={this.handleModuleClick}/>
        )
        break
      case 'removeModule':
        titlei18nKey = 'Book.removeModuleDialog'
        body = (
          <React.Fragment>
            <Button 
              color="green" 
              clickHandler={this.removeModule}
            >
              <Trans i18nKey="Buttons.delete" />
            </Button>
            <Button 
              color="red"
              clickHandler={this.closeActionsDialog}
            >
              <Trans i18nKey="Buttons.cancel" />
            </Button>
          </React.Fragment>
        )
        break
      case 'assignUser':
        titlei18nKey = 'Book.removeModuleDialog'
        body = (
          <React.Fragment>
            <UsersList
              mod={targetModule}
              onUserClick={this.handleUserClick}
            />
          </React.Fragment>
        )
        break
    }

    return (
      <Dialog
        size="medium"
        onClose={() => this.closeActionsDialog()}
        i18nKey={titlei18nKey}
      >
        {body}
      </Dialog>
    )
  }

  private closeActionsDialog = () => {
    this.setState({ 
      showDialog: false,
      dialogAction: undefined,
      groupNameValue: '',
      targetGroup: null,
      targetModule: null,
      selctedModule: null,
      userToAssign: null,
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
      showDialog,
      titleInput,
      showEditBook,
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
          showDialog ?
            this.actionsDialog()
          : null
        }
        {
          showEditBook ?
            <EditBook
            book={book}
            onClose={() => this.setState({ showEditBook: false })}
            onSuccess={() => {this.fetchBook(), this.setState({ showEditBook: false })}}
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
