import * as React from 'react'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchProcesses } from 'src/store/actions/app'
import { Process } from 'src/api'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import './index.css'

type Props = {
  process: Process
  onProcessEdit: (process: Process) => any
}

class ProcessInfo extends React.Component<Props> {
  state: {
    name: string,
  } = {
    name: '',
  }

  componentDidUpdate(prevProps: Props) {
    const prevName = prevProps.process.name
    const name = this.props.process.name
    if (prevName !== name) {
      this.setState({ name: this.props.process.name })
    }
  }

  componentDidMount() {
    this.setState({ name: this.props.process.name })
  }

  public render() {
    return (
      <>
        <form
          className="processes__name"
          onSubmit={this.onSubmit}
        >
          <Input
            value={this.state.name}
            onChange={this.handleNameChange}
            trim={true}
          />
          {
            this.state.name !== this.props.process.name ?
              <div className="process__controls">
                <span
                  className="process__small-icon"
                  onClick={this.onSubmit}
                >
                  <Icon name="check" />
                </span>
                <span
                  className="process__small-icon"
                  onClick={this.cancelEdit}
                >
                  <Icon name="close" />
                </span>
              </div>
            : null
          }
        </form>
        <div className="processes__controls">
          <Button clickHandler={this.editProcess}>
            <Icon name="pencil" />
          </Button>
        </div>
      </>
    )
  }

  private editProcess = () => {
    this.props.onProcessEdit(this.props.process)
  }

  private handleNameChange = (name: string) => {
    this.setState({ name })
  }

  private onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (this.state.name.length) {
      this.props.process.update(this.state.name)
        .then(() => {
          store.dispatch(addAlert('success', 'process-update-name-success'))
          store.dispatch(fetchProcesses())
        })
        .catch((e) => {
          store.dispatch(addAlert('error', 'process-update-name-error', {details: e.response.data.raw}))
        })
    }
  }

  private cancelEdit = () => {
    this.setState({ name: this.props.process.name })
  }
}

export default ProcessInfo