import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import * as api from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'

import { confirmDialog } from 'src/helpers'

import LimitedUI from 'src/components/LimitedUI'
import EditableText from 'src/components/EditableText'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import BeginProcess from 'src/containers/BeginProcess'
import ModulesPicker from 'src/containers/ModulesPicker'

interface GroupProps {
  book: api.Book
  item: api.BookPart
  collapseIcon: any
  isEditingUnlocked: boolean
  modulesMap: Map<string, api.Module>
  showStatsFor: api.Process | null
  afterAction: () => void
  onTitleClick: (num: number) => void
}

class Group extends React.Component<GroupProps> {
  state: {
    showAddGroup: boolean
    showAddModule: boolean
    groupNameInput: string
    showBeginProcess: boolean
    modules: api.Module[] | undefined
  } = {
    showAddGroup: false,
    showAddModule: false,
    groupNameInput: this.props.item.title,
    showBeginProcess: false,
    modules: undefined,
  }

  private getModStatuses = (group: api.BookPart = this.props.item) => {
    // Map<step name, number of modules in this step>
    const modStatuses: Map<string, number> = new Map()

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
    const modules: api.Module[] = []

    for (const part of this.props.item.parts!) {
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
      this.setState({ modules: undefined })
      await confirmDialog({
        title: 'book-begin-process-no-modules',
        buttons: {
          ok: 'book-begin-process-no-modules-ok',
        },
        buttonsPosition: 'center',
      })
    }
  }

  private closeBeginProcessDialog = () => {
    this.setState({ showBeginProcess: false, modules: undefined })
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
        store.dispatch(
          addAlert(
            'success',
            'book-group-change-title-alert-success',
            {
              from: this.props.item.title,
              to: name,
            }
          )
        )
      })
      .catch(e => {
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
      .catch(e => {
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

  private removeGroup = () => {
    const { item } = this.props

    item.delete()
      .then(() => {
        this.updateBook()
        store.dispatch(
          addAlert(
            'success',
            'book-remove-group-alert-success',
            { title: item.title }
          )
        )
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  private showRemoveGroupDialog = async () => {
    const res = await confirmDialog({
      title: 'book-remove-group-dialog-title',
      buttons: {
        cancel: 'book-remove-group-cancel',
        confirm: 'book-remove-group-confirm',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.removeGroup()
    }
  }

  private handleAddModule = (selectedModule: api.Module) => {
    const { book, item: targetGroup } = this.props

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
        store.dispatch(
          addAlert(
            'success',
            'book-group-add-module-alert-success',
            { title: selectedModule.title }
          )
        )
      })
      .catch(e => {
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

  private onTitleClick = () => {
    if (!this.props.isEditingUnlocked) {
      this.props.onTitleClick(this.props.item.number)
    }
  }

  componentDidUpdate(prevProps: GroupProps) {
    const prevTitle = prevProps.item.title
    const title = this.props.item.title
    if (prevTitle !== title) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ groupNameInput: this.props.item.title })
    }
  }

  public render() {
    const {
      showAddGroup,
      showAddModule,
      groupNameInput,
      showBeginProcess,
      modules,
    } = this.state
    const { isEditingUnlocked, collapseIcon, item, showStatsFor, book } = this.props
    const partsNotInProcess = item.parts!.some(p => p.kind === 'module' && !p.process)
    const modStatuses = this.getModStatuses()

    return (
      <>
        <span className="bookpart__icon">
          {collapseIcon}
        </span>
        <span className="bookpart__title" onClick={this.onTitleClick}>
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
              modStatuses.size
                ? <ModStatuses statuses={modStatuses} />
                : null
              : partsNotInProcess
                ? <Button clickHandler={this.showBeginProcessDialog}>
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
                  validation={{ minLength: 3 }}
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
          showAddModule ?
            <Dialog
              l10nId="book-group-add-module-dialog-title"
              placeholder="Select module or create a new one."
              size="medium"
              onClose={this.closeAddModuleDialog}
            >
              <ModulesPicker
                team={book.team}
                filterByTeam={book.team}
                onModuleClick={this.handleModuleClick}
              />
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
      </>
    )
  }
}

export default Group

const ModStatuses = ({ statuses }: { statuses: Map<string, number> }) => {
  const sts = Array.from(statuses.entries())
  return (
    // There is typescript error for returning array of JSX.Elements
    // https://stackoverflow.com/questions/46709773/typescript-react-rendering-
    // an-array-from-a-stateless-functional-component/53718997#53718997
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {
        sts.map(([stepName, counter]) => (
          <span key={stepName} className="bookpart__step">
            <Localized id="book-part-step-statistic" $step={stepName} $counter={counter}>
              {`{ $step }: { $counter }`}
            </Localized>
          </span>
        ))
      }
    </>
  )
}
