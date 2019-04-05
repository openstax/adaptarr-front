import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import LimitedUI from 'src/components/LimitedUI'
import ModuleStatus from 'src/components/ModuleStatus'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Avatar from 'src/components/ui/Avatar'

import UsersList from 'src/containers/UsersList'

import * as types from 'src/store/types'
import { State } from 'src/store/reducers'
import { setAssigneeInModulesMap } from 'src/store/actions/Modules'

type Props = {
  item: api.BookPart
  modulesMap: types.ModulesMap
  onModuleClick: (item: api.BookPart) => any
  afterAction: () => any
  setAssigneeInModulesMap: (moduleId: string, assignee: number | null) => void
}

type AssignActions = 'assign' | 'remove'

const mapStateToProps = ({ modules: { modulesMap } }: State) => ({
  modulesMap,
})

const mapDispatchToProps = (dispatch: any) => {
  return {
    setAssigneeInModulesMap: (moduleId: string, assignee: number | null) => dispatch(setAssigneeInModulesMap(moduleId, assignee))
  }
}

class Module extends React.Component<Props> {

  state: {
    showAssignUser: boolean
    showRemoveModule: boolean
    userToAssign?: api.User
    assignAction?: AssignActions
  } = {
    showAssignUser: false,
    showRemoveModule: false,
  }

  module: api.Module | undefined = this.props.modulesMap.get(this.props.item.id!)

  private showRemoveModuleDialog = () => {
    this.setState({ showRemoveModule: true })
  }

  private closeRemoveModuleDialog = () => {
    this.setState({ showRemoveModule: false })
  }

  private removeModule = () => {
    const { item: targetModule } = this.props

    if (!targetModule) {
      return console.error('targetModule:', targetModule)
    }

    targetModule.delete()
      .then(() => {
        this.props.afterAction()
        store.dispatch(addAlert('success', 'book-remove-module-alert-success', { title: targetModule.title }))
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
    this.closeRemoveModuleDialog()
  }

  private showAssignUserDialog = () => {
    this.setState({ showAssignUser: true })
  }

  private closeAssignUserDialog = () => {
    this.setState({ showAssignUser: false })
  }

  private handleUserClick = (user: api.User) => {
    this.assignUser(user)
  }

  private assignUser = (user: api.User | null) => {
    const targetModule = this.props.item
    const assignee = user ? user.id : null

    if (!targetModule || !this.module) {
      return store.dispatch(addAlert('error', 'book-assign-user-alert-error'))
    }

    this.module.assign(user)
      .then(() => {
        this.props.setAssigneeInModulesMap((targetModule.id as string), assignee)
        this.props.afterAction()
        if (user) {
          store.dispatch(addAlert('success', 'book-assign-user-alert-success', { user: user.name, module: targetModule.title }))
        } else {
          store.dispatch(addAlert('success', 'book-unassign-user-alert-success', { module: targetModule.title }))
        }
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
    this.closeAssignUserDialog()
  }

  private unassignUser = () => {
    this.assignUser(null)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.item !== prevProps.item) {
      this.module = this.props.modulesMap.get(this.props.item.id!)
    }
  }

  public render() {
    const item = this.props.item
    const { showRemoveModule, showAssignUser } = this.state

    return (
      <React.Fragment>
        {
          showRemoveModule ?
            <Dialog
              l10nId="book-remove-module-title"
              placeholder="Are you sure?"
              size="medium"
              onClose={this.closeAssignUserDialog}
            >
              <Button 
                color="green" 
                clickHandler={this.removeModule}
              >
                <Localized id="book-remove-module-confirm">
                  Delete
                </Localized>
              </Button>
              <Button 
                color="red"
                clickHandler={this.closeRemoveModuleDialog}
              >
                <Localized id="book-remove-module-cancel">
                  Cancel
                </Localized>
              </Button>
            </Dialog>
          : null
        }
        {
          showAssignUser ?
            <Dialog
              l10nId="book-assign-user-title"
              placeholder="Select user from a list to assign them."
              size="medium"
              onClose={this.closeAssignUserDialog}
            >
              <UsersList
                mod={item}
                onUserClick={this.handleUserClick}
              />
            </Dialog>
          : null
        }
        <span 
          className="bookpart__title" 
          onClick={() => this.props.onModuleClick(item)}
        >
          {item.title}
        </span>
        <span className="bookpart__info">
          <LimitedUI permissions="module:edit">
            <Button
              color="red"
              clickHandler={this.showRemoveModuleDialog}
            >
              <Icon name="minus" />
              <Localized id="book-remove-module">Module</Localized>
            </Button>
          </LimitedUI>
          {
            this.module && this.module.assignee ?
              <React.Fragment>
                <Avatar size="small" user={this.module.assignee} />
                <Button
                  clickHandler={this.unassignUser}
                >
                  <Localized id="book-unassign-user">Unassign</Localized>
                </Button>
                <Button clickHandler={this.showAssignUserDialog}>
                  <Localized id="book-assign-different-user">
                    Assign other user
                  </Localized>
                </Button>
              </React.Fragment>
              :
              <Button clickHandler={this.showAssignUserDialog}>
                <Localized id="book-assign-user">Assign user</Localized>
              </Button>
          }
          <span className="bookpart__status">
            <ModuleStatus status={/*item.status*/'ready'} />
          </span>
        </span>
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Module)
