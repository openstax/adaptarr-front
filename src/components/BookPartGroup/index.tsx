import * as React from 'react'
import { Trans } from 'react-i18next'

import i18n from 'src/i18n'
import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import AdminUI from 'src/components/AdminUI'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import StackedBar from 'src/components/ui/StackedBar'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import ModulesList from 'src/containers/ModulesList'

import { ModuleStatus } from 'src/store/types'

type Props = {
  book: api.Book
  item: api.BookPart
  collapseIcon: any
  afterAction: () => any
}

class Group extends React.Component<Props> {

  state: {
    showEditGroup: boolean
    showAddGroup: boolean
    showRemoveGroup: boolean
    showAddModule: boolean
    groupNameInput: string
  } = {
    showEditGroup: false,
    showAddGroup: false,
    showRemoveGroup: false,
    showAddModule: false,
    groupNameInput: '',
  }

  private getModStatuses = (group: api.BookPart = this.props.item): ModuleStatus[] => {
    let modStatuses: ModuleStatus[] = []

    group.parts!.forEach(part => {
      // TODO: push real module status
      if (part.kind === 'module') {
        modStatuses.push('ready')
      } else if (part.kind === 'group') {
        modStatuses = modStatuses.concat(this.getModStatuses(part))
      }
    })

    return modStatuses
  }

  private updateGroupNameInput = (val: string) => {
    this.setState({ groupNameInput: val })
  }

  private updateBook = () => {
    this.props.afterAction()
  }

  private handleEditBook = () => {
    const groupNameInput = this.state.groupNameInput

    if (!groupNameInput.length) {
      throw new Error("groupNameInput or groupNumber is undefined")
    }

    this.props.item.update({ title: groupNameInput })
      .then(() => {
        this.updateBook()
        this.closeEditGroupDialog()
        store.dispatch(addAlert('success', i18n.t("Book.titleChangeSuccess")))
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
        } else {
          store.dispatch(addAlert('error', e.message))
          this.closeEditGroupDialog()
        }
      })
  }

  private showEditBookDialog = () => {
    this.setState({ showEditGroup: true })
  }

  private closeEditGroupDialog = () => {
    this.setState({ showEditGroup: false })
  }

  private handleAddGroup = () => {
    const groupNameInput = this.state.groupNameInput
    const { book, item: group } = this.props

    if (!groupNameInput.length) {
      throw new Error("groupNameInput is undefined")
    }

    const payload = {
      title: groupNameInput,
      parent: this.props.item.number,
      index: group.parts ? group.parts.length : 0,
      parts: [],
    }

    book.createPart(payload)
      .then(() => {
        this.updateBook()
        this.closeAddGroupDialog()
        store.dispatch(addAlert('success', i18n.t("Book.groupAddSuccess")))
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
        } else {
          store.dispatch(addAlert('error', e.message))
          this.closeAddGroupDialog()
        }
      })
  }

  private showAddGroupDialog = () => {
    this.setState({ showAddGroup: true })
  }

  private closeAddGroupDialog = () => {
    this.setState({ showAddGroup: false })
  }

  private handleRemoveGroup = () => {
    const { item } = this.props
    
    item.delete()
      .then(() => {
        this.updateBook()
        this.closeRemoveGroupDialog()
        store.dispatch(addAlert('success', i18n.t("Book.groupRemoveSuccess", {title: item.title})))
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
        } else {
          store.dispatch(addAlert('error', e.message))
          this.closeRemoveGroupDialog()
        }
      })
  }

  private showRemoveGroupDialog = () => {
    this.setState({ showRemoveGroup: true })
  }

  private closeRemoveGroupDialog = () => {
    this.setState({ showRemoveGroup: false })
  }

  private handleAddModule = (selectedModule: api.Module) => {
    const { book, item: targetGroup} = this.props

    if (!targetGroup || !selectedModule) {
      throw new Error("targetGroup or selectedModule is undefined")
    }

    const payload = {
      module: selectedModule.id,
      parent: targetGroup.number,
      index: targetGroup.parts ? targetGroup.parts.length : 0,
    }

    book.createPart(payload)
      .then(() => {
        this.updateBook()
        this.closeAddModuleDialog()
        store.dispatch(addAlert('success', i18n.t("Book.moduleAddSuccess", {title: selectedModule.title})))
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
        } else {
          store.dispatch(addAlert('error', e.message))
          this.closeAddModuleDialog()
        }
      })
  }

  private handleModuleClick = (mod: api.Module) => {
    this.handleAddModule(mod)
  }

  private showAddModuleDialog = () => {
    this.setState({ showAddModule: true })
  }

  private closeAddModuleDialog = () => {
    this.setState({ showAddModule: false })
  }

  public render() {
    const {
      showEditGroup,
      showAddGroup,
      showRemoveGroup,
      showAddModule,
      groupNameInput,
    } = this.state

    const modStatuses = this.getModStatuses()

    return (
      <React.Fragment>
        {
          showEditGroup ?
            <Dialog
              size="medium"
              onClose={this.closeEditGroupDialog}
              i18nKey="Book.editGroupDialog"
            >
              <form>
                <Input 
                  value={this.props.item.title}
                  placeholder={i18n.t("Book.placeholderChangeGroupTitle")}
                  onChange={this.updateGroupNameInput}
                  autoFocus
                  validation={{minLength: 3}}
                />
                <Button 
                  color="green" 
                  clickHandler={this.handleEditBook}
                  isDisabled={groupNameInput.length <= 2}
                >
                  <Trans i18nKey="Buttons.confirm"/>
                </Button>
                <Button 
                  color="red"
                  clickHandler={this.closeEditGroupDialog}
                >
                  <Trans i18nKey="Buttons.cancel"/>
                </Button>
              </form>
            </Dialog>
          : null
        }
        {
          showAddGroup ?
            <Dialog
              size="medium"
              onClose={this.closeAddGroupDialog}
              i18nKey="Book.addGroupDialog"
            >
              <form>
                <Input
                  placeholder="Title"
                  onChange={this.updateGroupNameInput}
                  autoFocus
                  validation={{minLength: 3}}
                />
                <Button 
                  color="green" 
                  clickHandler={this.handleAddGroup}
                  isDisabled={groupNameInput.length <= 2}
                >
                  <Trans i18nKey="Buttons.confirm"/>
                </Button>
                <Button 
                  color="red"
                  clickHandler={this.closeAddGroupDialog}
                >
                  <Trans i18nKey="Buttons.cancel"/>
                </Button>
              </form>
            </Dialog>
          : null
        }
        {
          showRemoveGroup ?
            <Dialog
              size="medium"
              onClose={this.closeRemoveGroupDialog}
              i18nKey="Book.removeGroupDialog"
            >
              <Button 
                color="green" 
                clickHandler={this.handleRemoveGroup}
              >
                <Trans i18nKey="Buttons.delete"/>
              </Button>
              <Button 
                color="red"
                clickHandler={this.closeRemoveGroupDialog}
              >
                <Trans i18nKey="Buttons.cancel"/>
              </Button>
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
              <ModulesList onModuleClick={this.handleModuleClick}/>
            </Dialog>
          : null
        }
        <span className="bookpart__title">
          {this.props.item.title}
        </span>
        <span className="bookpart__info">
          <AdminUI>
            <Button clickHandler={this.showEditBookDialog}>
              <Icon name="pencil"/>
              <Trans i18nKey="Buttons.edit"/>
            </Button>
            <Button color="green" clickHandler={this.showAddGroupDialog}>
              <Icon name="plus"/>
              <Trans i18nKey="Buttons.group"/>
            </Button>
            <Button color="red" clickHandler={this.showRemoveGroupDialog}>
              <Icon name="minus"/>
              <Trans i18nKey="Buttons.group"/>
            </Button>
            <Button color="green" clickHandler={this.showAddModuleDialog}>
              <Icon name="plus"/>
              <Trans i18nKey="Buttons.module"/>
            </Button>
          </AdminUI>
          {
            modStatuses.length ?
              <span className="bookpart__status">
                <StackedBar data={modStatuses}/>
              </span>
            : null
          }
          <span className="bookpart__icon">
            {this.props.collapseIcon}
          </span>
        </span>
      </React.Fragment>
    )
  }
}

export default Group