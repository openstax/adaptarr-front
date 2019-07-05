import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import LimitedUI from 'src/components/LimitedUI'
import EditableText from 'src/components/EditableText'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import ModulesPicker from 'src/containers/ModulesPicker'

import { ModuleStatus } from 'src/store/types'

type Props = {
  book: api.Book
  item: api.BookPart
  collapseIcon: any
  isEditingUnlocked: boolean
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

  private updateGroupName = (name: string) => {
    if (!name.length || name === this.props.item.title) return

    this.props.item.update({ title: name })
      .then(() => {
        this.updateBook()
        store.dispatch(addAlert('success', 'book-group-change-title-alert-success', {from: this.props.item.title, to: name}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  private cancelEditBookName = () => {
    this.setState({ groupNameInput: this.props.item.title })
  }

  private handleChangeGroupName = (value: string) => {
    this.setState({ groupNameInput: value })
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

  componentDidUpdate(prevProps: Props) {
    const prevTitle = prevProps.item.title
    const title = this.props.item.title
    if (prevTitle !== title) {
      this.setState({ groupNameInput: this.props.item.title })
    }
  }

  componentDidMount() {
    this.setState({ groupNameInput: this.props.item.title })
  }

  public render() {
    const {
      showAddGroup,
      showRemoveGroup,
      showAddModule,
      groupNameInput,
    } = this.state
    const { isEditingUnlocked, collapseIcon, item } = this.props

    return (
      <>
        <span className="bookpart__icon">
          {collapseIcon}
        </span>
        <span className="bookpart__title">
          {
            isEditingUnlocked ?
              <EditableText
                text={item.title}
                onAccept={this.updateGroupName}
              />
            : item.title
          }
        </span>
        <span className="bookpart__info">
          {
            isEditingUnlocked ?
              <LimitedUI permissions="book:edit">
                <Button clickHandler={this.showAddModuleDialog}>
                  <Localized id="book-button-add-module">
                    Add module
                  </Localized>
                </Button>
                <Button clickHandler={this.showAddGroupDialog}>
                  <Localized id="book-button-add-group">
                    Add group
                  </Localized>
                </Button>
                <Button type="danger" clickHandler={this.showRemoveGroupDialog}>
                  <Localized id="book-button-remove">
                    Remove
                  </Localized>
                </Button>
              </LimitedUI>
            : null
          }
        </span>
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
                <div className="dialog__buttons">
                  <Localized id="book-add-group-confirm" attrs={{ value: true }}>
                    <input
                      type="submit"
                      value="Confirm"
                      disabled={groupNameInput.length <= 2}
                    />
                  </Localized>
                  <Button
                    type="danger"
                    clickHandler={this.closeAddGroupDialog}
                  >
                    <Localized id="book-add-group-cancel">Cancel</Localized>
                  </Button>
                </div>
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
              <div className="dialog__buttons">
                <Button clickHandler={this.handleRemoveGroup}>
                  <Localized id="book-remove-group-confirm">Delete</Localized>
                </Button>
                <Button
                  type="danger"
                  clickHandler={this.closeRemoveGroupDialog}
                >
                  <Localized id="book-remove-group-cancel">Cancel</Localized>
                </Button>
              </div>
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
      </>
    )
  }
}

export default Group