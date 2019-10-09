import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import * as api from 'src/api'
import { ProcessStructure } from 'src/api/process'

import * as types from 'src/store/types'
import store from 'src/store'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/alerts'

import { confirmDialog } from 'src/helpers'

import LimitedUI from 'src/components/LimitedUI'
import EditableText from 'src/components/EditableText'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import BeginProcess from 'src/containers/BeginProcess'
import ProcessPreview from 'src/containers/ProcessPreview'
import UpdateSlots from 'src/containers/UpdateSlots'

import './index.css'

type ModuleProps = {
  item: api.BookPart
  modulesMap: types.ModulesMap
  processes: Map<number, api.Process>
  teams: Map<number, api.Team>
  isEditingUnlocked: boolean
  highlightText: string
  onModuleClick: (item: api.BookPart) => any
  afterAction: () => any
}

const mapStateToProps = ({ modules: { modulesMap }, app: { processes, teams } }: State) => ({
  modulesMap,
  processes,
  teams,
})

export type ModuleState = {
  showBeginProcess: boolean
  processStructure: ProcessStructure | null
  module: api.Module | undefined
  team: api.Team | null
}

class Module extends React.Component<ModuleProps> {
  state: ModuleState = {
    showBeginProcess: false,
    processStructure: null,
    module: this.props.modulesMap.get(this.props.item.id!),
    team: null,
  }

  private showRemoveModuleDialog = async () => {
    const res = await confirmDialog({
      title: 'book-remove-module-title',
      buttons: {
        cancel: 'book-remove-module-cancel',
        confirm: 'book-remove-module-confirm',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.removeModule()
    }
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
  }

  private showBeginProcessDialog = () => {
    this.setState({ showBeginProcess: true })
  }

  private closeBeginProcessDialog = () => {
    this.setState({ showBeginProcess: false })
  }

  private showProcessDetails = async () => {
    const { process: processId, version } = this.state.module!.process!
    const { processes } = this.props
    const process = await api.ProcessVersion.load(processId, version)
    const structure = await process.structure()
    const team = this.props.teams.get(processes.get(processId)!.team)
    if (!team) {
      console.error(`Couldn't find team for process: ${process.id}`)
      return
    }
    this.setState({ processStructure: structure, team })
  }

  private closeProcessDetails = () => {
    this.setState({ processStructure: null, team: null })
  }

  private showCancelProcess = async () => {
    const res = await confirmDialog({
      title: 'book-process-cancel-title',
      buttons: {
        cancel: 'book-process-cancel-button-cancel',
        cancelProcess: 'book-process-cancel-button',
      },
      showCloseButton: false,
    })

    if (res === 'cancelProcess') {
      this.cancelProcess()
    }
  }

  private cancelProcess = async () => {
    try {
      const { item } = this.props
      const { module: mod } = this.state

      const draft = await api.Draft.load(item.id!)
      await draft.cancelProcess()

      this.props.modulesMap.set(mod!.id, new api.Module({...mod!, process: null}))
      this.props.item.process = null
      store.dispatch(addAlert('success', 'book-process-cancel-success'))
      this.closeProcessDetails()
    } catch (e) {
      console.error(e)
      store.dispatch(addAlert('success', 'book-process-cancel-error', {details: e.toString()}))
    }
  }

  private afterBeginProcess = () => {
    this.props.afterAction()
  }

  componentDidUpdate(prevProps: ModuleProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ module: this.props.modulesMap.get(this.props.item.id!) })
    }
  }

  public render() {
    const { item, processes, isEditingUnlocked, highlightText } = this.props
    const {
      showBeginProcess,
      processStructure,
      module: mod,
      team,
    } = this.state

    let titleWithHighlights = ''
    if (highlightText) {
      const rgx = new RegExp(highlightText, 'gi')
      titleWithHighlights = item.title.replace(rgx, match => `<span class="highlight">${match}</span>`)
    }

    return (
      <>
        <span
          className="bookpart__title"
          onClick={() => this.props.onModuleClick(item)}
        >
          {
            // Currently only users with proper permissions in process can change module title.
            /* isEditingUnlocked ?
              <EditableText
                text={item.title}
                onAccept={this.updateModuleTitle}
              />
            : item.title */
          }
          {
            highlightText ?
              <span dangerouslySetInnerHTML={{__html: titleWithHighlights}}></span>
            : item.title
          }
        </span>
        <span className="bookpart__info">
          {
            isEditingUnlocked ?
              <LimitedUI permissions="module:edit">
                <Button
                  type="danger"
                  clickHandler={this.showRemoveModuleDialog}
                >
                  <Localized id="book-button-remove">Remove</Localized>
                </Button>
              </LimitedUI>
            : null
          }
          <LimitedUI permissions="editing-process:manage">
            {
              item.process ?
                <Button
                  className="bookpart__process"
                  clickHandler={this.showProcessDetails}
                >
                  <Localized
                    id="book-in-process"
                    $process={processes.get(item.process.process)!.name}
                    $step={item.process.step.name}
                  >
                    {`{ $step } in { $process }`}
                  </Localized>
                </Button>
              :
                <Button clickHandler={this.showBeginProcessDialog}>
                  <Localized id="book-begin-process">Begin process</Localized>
                </Button>
            }
          </LimitedUI>
        </span>
        {
          showBeginProcess && mod ?
            <Dialog
              l10nId="book-begin-process-title"
              placeholder="Configure and begin process"
              size="medium"
              className="bookpart__item--module begin-process-dialog"
              onClose={this.closeBeginProcessDialog}
            >
              <BeginProcess
                modules={[mod]}
                onClose={this.closeBeginProcessDialog}
                afterUpdate={this.afterBeginProcess}
              />
            </Dialog>
          : null
        }
        {
          processStructure && team ?
            <Dialog
              l10nId="book-process-preview-title"
              placeholder="Process details:"
              size="medium"
              onClose={this.closeProcessDetails}
            >
              <UpdateSlots
                module={this.state.module}
                team={team}
              />
              <ProcessPreview
                team={team}
                structure={processStructure}
              />
              <div className="dialog__buttons dialog__buttons--center">
                <Button clickHandler={this.showCancelProcess}>
                  <Localized id="book-process-cancel-button">
                    Cancel process
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

export default connect(mapStateToProps)(Module)
