import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Process, { ProcessStructure } from 'src/api/process'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import ProcessForm from './components/ProcessForm'
import Load from 'src/components/Load'
import Header from 'src/components/Header'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

type Props = {
  processes: Process[],
}

async function loader() {
  const processes = await Process.all()
  return { processes }
}

class Processes extends React.Component<Props> {
  state: {
    showForm: boolean
  } = {
    showForm: false,
  }

  private toggleForm = () => {
    this.setState({ showForm: !this.state.showForm })
  }

  private createProcess = (structure: ProcessStructure) => {
    Process.create(structure)
      .then(() => {
        this.setState({ showForm: false })
        store.dispatch(addAlert('success', 'process-create-success', {name: structure.name}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'process-create-error', {details: e.response.data.error}))
      })
  }

  public render() {
    const { showForm } = this.state
    
    return (
      <section className="section--wrapper">
        <Header l10nId="processes-view-title" title="Manage processes" />
        <div className="section__content processes">
          <div className="processes__create-new">
            {
              !showForm ?
                <Button
                  color="green"
                  clickHandler={this.toggleForm}
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
                onSubmit={this.createProcess}
                onCancel={this.toggleForm}
              />
            : null
          }
          <h2>
            <Localized id="processes-view-list">
              Current processes:
            </Localized>
          </h2>
          <ul className="processes__list">
            {
              this.props.processes.map(p => {
                return <li key={p.id} className="processes__process-name">{p.name}</li>
              })
            }
          </ul>
        </div>
      </section>
    )
  }
}

export default Load(loader, [], '')(Processes)
