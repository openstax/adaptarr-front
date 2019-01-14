import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import i18n from 'src/i18n'
import axios from 'src/config/axios'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import AdminUI from 'src/components/AdminUI'
import ModuleStatus from 'src/components/ModuleStatus'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Avatar from 'src/components/ui/Avatar'

import UsersList from 'src/containers/UsersList'

import { BookPartModule, User } from 'src/store/types'
import { setAssigneeInModulesMap } from 'src/store/actions/Modules'

type Props = {
  item: BookPartModule
  bookId: string
  onModuleClick: (item: BookPartModule) => any
  onModuleRemove: () => any
  onAssignUser: () => any
  setAssigneeInModulesMap: (moduleId: string, assignee: number | null) => void
}

type AssignActions = 'assign' | 'remove'

const mapDispatchToProps = (dispatch: any) => {
  return {
    setAssigneeInModulesMap: (moduleId: string, assignee: number | null) => dispatch(setAssigneeInModulesMap(moduleId, assignee))
  }
}

class Module extends React.Component<Props> {

  state: {
    showSuperSession: boolean
    showAssignUser: boolean
    showRemoveModule: boolean
    userToAssign?: User
    assignAction?: AssignActions
  } = {
    showSuperSession: false,
    showAssignUser: false,
    showRemoveModule: false,
  }

  private showRemoveModuleDialog = () => {
    this.setState({ showRemoveModule: true })
  }

  private closeRemoveModuleDialog = () => {
    this.setState({ showRemoveModule: false })
  }

  private removeModule = () => {
    const { bookId, item: targetModule} = this.props

    if (!targetModule) {
      return console.error('targetModule:', targetModule)
    }

    axios.delete(`books/${bookId}/parts/${targetModule.number}`)
      .then(() => {
        this.closeRemoveModuleDialog()
        this.props.onModuleRemove()
        store.dispatch(addAlert('success', i18n.t("Book.moduleRemoveSuccess", {title: targetModule.title})))
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
        } else {
          store.dispatch(addAlert('error', e.message))
          this.closeRemoveModuleDialog()
        }
      })
  }

  private showAssignUserDialog = () => {
    this.setState({ showAssignUser: true })
  }

  private closeAssignUserDialog = () => {
    this.setState({ showAssignUser: false })
  }

  private handleUserClick = (user: User) => {
    this.assignUser(user)
  }

  private assignUser = (user: User | null) => {
    const targetModule = this.props.item
    const assignee = user ? user.id : null

    if (!targetModule) {
      return store.dispatch(addAlert('error', i18n.t("User.assignError")))
    }

    axios.put(`modules/${targetModule.id}`, { assignee })
      .then(() => {
        this.closeAssignUserDialog()
        this.props.setAssigneeInModulesMap((targetModule.id as string), assignee)
        this.props.onAssignUser()
        if (user) {
          store.dispatch(addAlert('success', i18n.t("User.assignSuccess", {user: user.name, module: targetModule.title})))
        } else {
          store.dispatch(addAlert('success', i18n.t("User.unassignSuccess", {module: targetModule.title})))
        }
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
        } else {
          store.dispatch(addAlert('error', e.message))
          this.closeAssignUserDialog()
        }
      })
  }

  private unassignUser = () => {
    this.assignUser(null)
  }

  public render() {
    const item = this.props.item
    const { showRemoveModule, showAssignUser } = this.state

    return (
      <React.Fragment>
        {
          showRemoveModule ?
            <Dialog
              size="medium"
              onClose={this.closeAssignUserDialog}
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
        {
          showAssignUser ?
            <Dialog
              size="medium"
              onClose={this.closeAssignUserDialog}
              i18nKey="Book.assignUserDialog"
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
          <AdminUI>
            <Button
              color="red"
              clickHandler={this.showRemoveModuleDialog}
            >
              <Icon name="minus" />
              <Trans i18nKey="Buttons.module" />
            </Button>
          </AdminUI>
          {
            item.assignee ?
              <React.Fragment>
                <Avatar size="small" user={item.assignee} />
                <Button
                  clickHandler={this.unassignUser}
                >
                  <Trans i18nKey="Buttons.unassign" />
                </Button>
                <Button clickHandler={this.showAssignUserDialog}>
                  <Trans i18nKey="Buttons.assignOther" />
                </Button>
              </React.Fragment>
            :
              <Button clickHandler={this.showAssignUserDialog}>
                <Trans i18nKey="Buttons.assign" />
              </Button>
          }
          <span className="bookpart__status">
            <ModuleStatus status={item.status}/>
          </span>
        </span>
      </React.Fragment>
    )
  }
}

export default connect(null, mapDispatchToProps)(Module)
