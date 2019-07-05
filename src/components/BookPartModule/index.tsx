import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import * as api from 'src/api'
import { ProcessStructure } from 'src/api/process'
import { addAlert } from 'src/store/actions/Alerts'

import LimitedUI from 'src/components/LimitedUI'
import EditableText from 'src/components/EditableText'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'

import BeginProcess from 'src/containers/BeginProcess'
import ProcessPreview from 'src/containers/ProcessPreview'
import UpdateSlots from 'src/containers/UpdateSlots'

import * as types from 'src/store/types'
import { State } from 'src/store/reducers'

import './index.css'

type Props = {
  item: api.BookPart
  modulesMap: types.ModulesMap
  processes: Map<number, api.Process>
  isEditingUnlocked: boolean
  onModuleClick: (item: api.BookPart) => any
  afterAction: () => any
}

const mapStateToProps = ({ modules: { modulesMap }, app: { processes } }: State) => ({
  modulesMap,
  processes,
})

class Module extends React.Component<Props> {
  state: {
    showRemoveModule: boolean
    showBeginProcess: boolean
    processStructure: ProcessStructure | null
    module: api.Module | undefined
  } = {
    showRemoveModule: false,
    showBeginProcess: false,
    processStructure: null,
    module: this.props.modulesMap.get(this.props.item.id!),
  }

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

  private showBeginProcessDialog = () => {
    this.setState({ showBeginProcess: true })
  }

  private closeBeginProcessDialog = () => {
    this.setState({ showBeginProcess: false })
  }

  private showProcessDetails = async () => {
    const processId = this.state.module!.process!.process
    const process = this.props.processes.get(processId)!
    const structure = await process.structure()
    this.setState({ processStructure: structure })
  }

  private closeProcessDetails = () => {
    this.setState({ processStructure: null })
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.item !== prevProps.item) {
      this.setState({ module: this.props.modulesMap.get(this.props.item.id!) })
    }
  }

  public render() {
    const { item, processes, isEditingUnlocked } = this.props
    const {
      showRemoveModule,
      showBeginProcess,
      processStructure,
      module: mod,
    } = this.state

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
          {item.title}
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
              mod && mod.process ?
                <Button
                  className="bookpart__process"
                  clickHandler={this.showProcessDetails}
                >
                  <Localized
                    id="book-in-process"
                    $name={processes.get(mod.process.process)!.name}
                  >
                    Process: [process name]
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
          showRemoveModule ?
            <Dialog
              l10nId="book-remove-module-title"
              placeholder="Are you sure?"
              size="medium"
              onClose={this.closeRemoveModuleDialog}
            >
              <div className="dialog__buttons">
                <Button clickHandler={this.removeModule}>
                  <Localized id="book-remove-module-confirm">
                    Delete
                  </Localized>
                </Button>
                <Button
                  type="danger"
                  clickHandler={this.closeRemoveModuleDialog}
                >
                  <Localized id="book-remove-module-cancel">
                    Cancel
                  </Localized>
                </Button>
              </div>
            </Dialog>
          : null
        }
        {
          showBeginProcess && mod ?
            <Dialog
              l10nId="book-begin-process-title"
              placeholder="Configure and begin process."
              size="medium"
              className="bookpart__item--module begin-process-dialog"
              onClose={this.closeBeginProcessDialog}
            >
              <BeginProcess
                module={mod}
                onClose={this.closeBeginProcessDialog}
              />
            </Dialog>
          : null
        }
        {
          processStructure ?
            <Dialog
              l10nId="book-process-preview-title"
              placeholder="Process details:"
              size="medium"
              onClose={this.closeProcessDetails}
            >
              <UpdateSlots
                module={this.state.module}
              />
              <ProcessPreview
                structure={processStructure}
              />
            </Dialog>
          : null
        }
      </>
    )
  }
}

export default connect(mapStateToProps)(Module)
