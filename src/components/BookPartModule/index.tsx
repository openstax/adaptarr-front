import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import LimitedUI from 'src/components/LimitedUI'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'

import BeginProcess from 'src/containers/BeginProcess'

import * as types from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  item: api.BookPart
  modulesMap: types.ModulesMap
  processes: Map<number, api.Process>
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
    module: api.Module | undefined
  } = {
    showRemoveModule: false,
    showBeginProcess: false,
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

  componentDidUpdate(prevProps: Props) {
    if (this.props.item !== prevProps.item) {
      this.setState({ module: this.props.modulesMap.get(this.props.item.id!) })
    }
  }

  public render() {
    const { item, processes } = this.props
    const { showRemoveModule, showBeginProcess, module: mod } = this.state

    return (
      <React.Fragment>
        {
          showRemoveModule ?
            <Dialog
              l10nId="book-remove-module-title"
              placeholder="Are you sure?"
              size="medium"
              onClose={this.closeRemoveModuleDialog}
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
          showBeginProcess && mod ?
            <Dialog
              l10nId="book-begin-process-title"
              placeholder="Configure and begin process."
              size="medium"
              onClose={this.closeBeginProcessDialog}
            >
              <BeginProcess
                module={mod}
                onClose={this.closeBeginProcessDialog}
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
            mod && mod.process ?
                <span className="bookpart__process">
                  <Localized
                    id="book-in-process"
                    $name={processes.get(mod.process.process)!.name}
                  >
                    Process: [process name]
                  </Localized>
                </span>
              :
                <Button clickHandler={this.showBeginProcessDialog}>
                  <Localized id="book-begin-process">Begin process</Localized>
                </Button>
          }
        </span>
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps)(Module)
