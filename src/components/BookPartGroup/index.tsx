import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import LimitedUI from 'src/components/LimitedUI'
import EditableText from 'src/components/EditableText'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import BeginProcess from 'src/containers/BeginProcess'
import ModulesPicker from 'src/containers/ModulesPicker'

type Props = {
  book: api.Book
  item: api.BookPart
  collapseIcon: any
  isEditingUnlocked: boolean
  modulesMap: Map<string, api.Module>
  showStatsFor: api.Process | null
  afterAction: () => any
}

class Group extends React.Component<Props> {
  state: {
    showAddGroup: boolean
    showRemoveGroup: boolean
    showAddModule: boolean
    groupNameInput: string
    showBeginProcess: boolean
    modules: api.Module[] | undefined
    showNoModules: boolean
  } = {
    showAddGroup: false,
    showRemoveGroup: false,
    showAddModule: false,
    groupNameInput: '',
    showBeginProcess: false,
    modules: undefined,
    showNoModules: false,
  }

  private getModStatuses = (group: api.BookPart = this.props.item) => {
    // Map<step name, number of modules in this step>
    let modStatuses: Map<string, number> = new Map()

    if (!this.props.showStatsFor) return modStatuses

    for (const part of group.parts!) {
      if (part.kind === 'module') {
        if (part.process && part.process.process === this.props.showStatsFor.id) {
          let counter = 1
          if (modStatuses.has(part.process.step.name)) {
            counter = modStatuses.get(part.process.step.name)! + 1
          }
          modStatuses.set(part.process.step.name, counter)
        }
      } else if (part.kind === 'group') {
        const map = this.getModStatuses(part)

        for (let [stepName, counter] of map.entries()) {
          if (modStatuses.has(stepName)) {
            counter += modStatuses.get(stepName)!
          }
          modStatuses.set(stepName, counter)
        }
      }
    }

    return modStatuses
  }

  private showBeginProcessDialog = async () => {
    let modules: api.Module[] = []

    for (let part of this.props.item.parts!) {
      if (part.kind === 'module') {
        const mod = await part.module()
        if (mod && !mod.process) {
          modules.push(mod)
        }
      }
    }

    if (modules.length) {
      this.setState({ showBeginProcess: true, modules })
    } else {
      this.setState({ showNoModules: true, modules: undefined })
    }
  }

  private closeBeginProcessDialog = () => {
    this.setState({ showBeginProcess: false, modules: undefined })
  }

  private closeNoModules = () => {
    this.setState({ showNoModules: false })
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

  private afterBeginProcess = () => {
    this.props.afterAction()
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
      showBeginProcess,
      modules,
      showNoModules,
    } = this.state
    const { isEditingUnlocked, collapseIcon, item, showStatsFor } = this.props
    const partsNotInProcess = item.parts!.some(p => p.kind === 'module' && !p.process)
    const modStatuses = this.getModStatuses()

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
          {
            showStatsFor ?
              modStatuses.size ?
                Array.from(modStatuses.entries()).map(([stepName, counter]) => {
                  return (
                      <span key={stepName} className="bookpart__step">
                        <Localized id="book-part-step-statistic" $step={stepName} $counter={counter}>
                          {`{ $step }: { $counter }`}
                        </Localized>
                      </span>
                    )
                })
              : null
            : partsNotInProcess ?
                <Button clickHandler={this.showBeginProcessDialog}>
                  <Localized id="book-begin-process">Begin process</Localized>
                </Button>
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
                  <Button clickHandler={this.closeAddGroupDialog}>
                    <Localized id="book-add-group-cancel">Cancel</Localized>
                  </Button>
                  <Localized id="book-add-group-confirm" attrs={{ value: true }}>
                    <input
                      type="submit"
                      value="Confirm"
                      disabled={groupNameInput.length <= 2}
                    />
                  </Localized>
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
              showCloseButton={false}
            >
              <div className="dialog__buttons">
                <Button clickHandler={this.closeRemoveGroupDialog}>
                  <Localized id="book-remove-group-cancel">Cancel</Localized>
                </Button>
                <Button
                  type="danger"
                  clickHandler={this.handleRemoveGroup}
                >
                  <Localized id="book-remove-group-confirm">Delete</Localized>
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
        {
          showBeginProcess && modules ?
            <Dialog
              l10nId="book-begin-process-title"
              placeholder="Configure and begin process"
              size="medium"
              className="bookpart__item--module begin-process-dialog"
              onClose={this.closeBeginProcessDialog}
            >
              <BeginProcess
                modules={modules}
                onClose={this.closeBeginProcessDialog}
                afterUpdate={this.afterBeginProcess}
              />
            </Dialog>
          : null
        }
        {
          showNoModules ?
            <Dialog
              l10nId="book-begin-process-no-modules"
              placeholder="All modules in this chapter are already assigned to the process."
              size="medium"
              onClose={this.closeNoModules}
            >
              <div className="dialog__buttons dialog__buttons--center">
                <Button clickHandler={this.closeNoModules}>
                  <Localized id="book-begin-process-no-modules-ok">
                    Ok
                  </Localized>
                </Button>
              </div>
            </Dialog>
          : null
        }
      </>
    )
  }
}

export default Group
