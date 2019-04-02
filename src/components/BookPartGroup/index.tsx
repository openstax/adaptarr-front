import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import LimitedUI from 'src/components/LimitedUI'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import StackedBar from 'src/components/ui/StackedBar'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import ModulesPicker from 'src/containers/ModulesPicker'

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

  private handleEditBook = (e: React.FormEvent) => {
    e.preventDefault()
    
    const groupNameInput = this.state.groupNameInput

    if (!groupNameInput.length) {
      throw new Error("groupNameInput or groupNumber is undefined")
    }

    this.props.item.update({ title: groupNameInput })
      .then(() => {
        this.updateBook()
        store.dispatch(addAlert('success', 'book-group-change-title-alert-success', {from: this.props.item.title, to: groupNameInput}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', e.message))
      })
    this.closeEditGroupDialog()
  }

  private showEditBookDialog = () => {
    this.setState({ showEditGroup: true })
  }

  private closeEditGroupDialog = () => {
    this.setState({ showEditGroup: false })
  }

  private handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault()

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
        store.dispatch(addAlert('success', 'book-add-group-alert-success'))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', e.message))
      })
    this.closeAddGroupDialog()
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
        store.dispatch(addAlert('success', 'book-remove-group-alert-success', {title: item.title}))
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
    this.closeRemoveGroupDialog()
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
        store.dispatch(addAlert('success', 'book-group-add-module-alert-success', {title: selectedModule.title}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', e.message))
      })
    this.closeAddModuleDialog()
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
              l10nId="book-group-change-title-dialog-title"
              placeholder="Change chapter title."
              size="medium"
              onClose={this.closeEditGroupDialog}
            >
              <form onSubmit={this.handleEditBook}>
                <Input
                  l10nId="book-group-change-title-value"
                  value={this.props.item.title}
                  onChange={this.updateGroupNameInput}
                  autoFocus
                  validation={{minLength: 3}}
                />
                <Localized id="book-group-change-title-confirm" attrs={{ value: true }}>
                  <input
                    type="submit"
                    value="Confirm"
                    disabled={groupNameInput.length <= 2}
                  />
                </Localized>
                <Button
                  color="red"
                  clickHandler={this.closeEditGroupDialog}
                >
                  <Localized id="book-group-change-title-cancel">
                    Cancel
                  </Localized>
                </Button>
              </form>
            </Dialog>
          : null
        }
        {
          showAddGroup ?
            <Dialog
              l10nId="book-add-group-dialog-title"
              placeholder="Provide chapter title."
              size="medium"
              onClose={this.closeAddGroupDialog}
            >
              <form onSubmit={this.handleAddGroup}>
                <Input
                  l10nId="book-add-group-title"
                  onChange={this.updateGroupNameInput}
                  autoFocus
                  validation={{minLength: 3}}
                />
                <Localized id="book-add-group-confirm" attrs={{ value: true }}>
                  <input
                    type="submit"
                    value="Confirm"
                    disabled={groupNameInput.length <= 2}
                  />
                </Localized>
                <Button
                  color="red"
                  clickHandler={this.closeAddGroupDialog}
                >
                  <Localized id="book-add-group-cancel">Cancel</Localized>
                </Button>
              </form>
            </Dialog>
          : null
        }
        {
          showRemoveGroup ?
            <Dialog
              l10nId="book-remove-group-dialog-title"
              placeholder="Remove this group and all its contents?"
              size="medium"
              onClose={this.closeRemoveGroupDialog}
            >
              <Button 
                color="green" 
                clickHandler={this.handleRemoveGroup}
              >
                <Localized id="book-remove-group-confirm">Delete</Localized>
              </Button>
              <Button 
                color="red"
                clickHandler={this.closeRemoveGroupDialog}
              >
                <Localized id="book-remove-group-cancel">Cancel</Localized>
              </Button>
            </Dialog>
          : null
        }
        {
          showAddModule ?
            <Dialog
              l10nId="book-group-add-module-dialog-title"
              placeholder="Select module or create a new one."
              size="medium"
              onClose={this.closeAddModuleDialog}
            >
              <ModulesPicker onModuleClick={this.handleModuleClick}/>
            </Dialog>
          : null
        }
        <span className="bookpart__title">
          {this.props.item.title}
        </span>
        <span className="bookpart__info">
          <LimitedUI permissions="book:edit">
            <Button clickHandler={this.showEditBookDialog}>
              <Icon name="pencil"/>
              <Localized id="book-change-title">Edit</Localized>
            </Button>
            <Button color="green" clickHandler={this.showAddGroupDialog}>
              <Icon name="plus"/>
              <Localized id="book-add-group">Group</Localized>
            </Button>
            <Button color="red" clickHandler={this.showRemoveGroupDialog}>
              <Icon name="minus"/>
              <Localized id="book-remove-group">Group</Localized>
            </Button>
            <Button color="green" clickHandler={this.showAddModuleDialog}>
              <Icon name="plus"/>
              <Localized id="book-add-module">Module</Localized>
            </Button>
          </LimitedUI>
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