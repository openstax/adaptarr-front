import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Process, { ProcessStructure } from 'src/api/process'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchProcesses } from 'src/store/actions/app'

import ProcessForm from './components/ProcessForm'
import ProcessesList from './components/ProcessesList'
import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ProcessPreview from 'src/containers/ProcessPreview'

class Processes extends React.Component<{}> {
  state: {
    showForm: boolean
    structure: ProcessStructure | null
    process: Process | null
    showPreview: boolean
  } = {
    showForm: false,
    structure: null,
    process: null,
    showPreview: false,
  }

  private showForm = () => {
    this.setState({ showForm: true, showPreview: false, structure: null, process: null })
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

  private closePreview = () => {
    this.setState({ showPreview: false, structure: null, process: null })
  }

  private onShowPreview = async (p: Process) => {
    const structure = await p.structure()
    this.setState({ showPreview: true, structure, process: p })
  }

  public render() {
    const { showForm, structure, showPreview, process } = this.state

    return (
      <div className={`container ${showPreview ? 'container--splitted' : ''}`}>
        <Section>
          <Header l10nId="processes-view-title" title="Manage processes" />
          <div className="section__content processes">
            {
              showForm ?
                <ProcessForm
                  structure={structure}
                  onSubmit={this.createProcess}
                  onCancel={this.closeForm}
                />
              :
                <>
                  <ProcessesList
                    onProcessEdit={this.onProcessEdit}
                    onShowPreview={this.onShowPreview}
                    activePreview={process ? process.id : undefined}
                  />
                  <div className="processes__create-new">
                    <Button clickHandler={this.showForm}>
                      <Localized id="processes-view-add">
                        Add new process
                      </Localized>
                    </Button>
                  </div>
                </>
            }
          </div>
        </Section>
        {
          showPreview && structure ?
            <Section>
              <Header
                l10nId="processes-view-preview"
                title="Process preview"
              >
                <Button clickHandler={this.closePreview} className="close-button">
                  <Icon name="close" />
                </Button>
              </Header>
              <div className="section__content">
                <ProcessPreview structure={structure} />
              </div>
            </Section>
          : null
        }
      </div>
    )
  }
}

export default Processes
