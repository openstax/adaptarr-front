import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Process, { ProcessStructure } from 'src/api/process'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchProcesses } from 'src/store/actions/app'

import ProcessForm from './components/ProcessForm'
import ProcessesList from './components/ProcessesList'
import Header from 'src/components/Header'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

class Processes extends React.Component<{}> {
  state: {
    showForm: boolean
    structure: ProcessStructure | null
    process: Process | null
  } = {
    showForm: false,
    structure: null,
    process: null,
  }

  private showForm = () => {
    this.setState({ showForm: true, structure: null, process: null })
  }

  private closeForm = () => {
    this.setState({ showForm: false, structure: null, process: null })
  }

  private onProcessEdit = async (p: Process) => {
    const structure = await p.structure()
    this.setState({ showForm: true, structure, process: p })
  }

  private createProcess = (structure: ProcessStructure) => {
    if (!this.state.process) {
      Process.create(structure)
        .then(() => {
          this.closeForm()
          store.dispatch(addAlert('success', 'process-create-success', {name: structure.name}))
          store.dispatch(fetchProcesses())
        })
        .catch((e) => {
          store.dispatch(addAlert('error', 'process-create-error', {details: e.response.data.raw}))
        })
    } else {
      this.state.process.createVersion(structure)
        .then(() => {
          this.closeForm()
          store.dispatch(addAlert('success', 'process-create-version-success', {name: structure.name}))
          store.dispatch(fetchProcesses())
        })
        .catch((e) => {
          store.dispatch(addAlert('error', 'process-create-version-error', {details: e.response.data.raw}))
        })
    }
  }

  public render() {
    const { showForm, structure } = this.state
    
    return (
      <section className="section--wrapper">
        <Header l10nId="processes-view-title" title="Manage processes" />
        <div className="section__content processes">
          <div className="processes__create-new">
            {
              !showForm ?
                <Button
                  color="green"
                  clickHandler={this.showForm}
                >
                  <Icon name="plus" />
                  <Localized id="processes-view-add">
                    Add new process
                  </Localized>
                </Button>
              : null
            }
          </div>
          {
            showForm ?
              <ProcessForm
                structure={structure}
                onSubmit={this.createProcess}
                onCancel={this.closeForm}
              />
            :
              <ProcessesList
                onProcessEdit={this.onProcessEdit}
              />
          }
        </div>
      </section>
    )
  }
}

export default Processes
