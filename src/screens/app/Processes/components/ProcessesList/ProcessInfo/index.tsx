import * as React from 'react'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchProcesses } from 'src/store/actions/app'
import { Process } from 'src/api'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import LimitedUI from 'src/components/LimitedUI'

import './index.css'

type Props = {
  process: Process
  onProcessEdit: (process: Process) => any
  onProcessPreview: (process: Process) => any
}

class ProcessInfo extends React.Component<Props> {
  state: {
    name: string,
    focused: boolean,
  } = {
    name: '',
    focused: false,
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

  nameRef: React.RefObject<HTMLSpanElement> = React.createRef()

  public render() {
    return (
      <>
        <form
          className="processes__name"
          onSubmit={this.onSubmit}
        >
          <span
            className="process__content-editable"
            contentEditable
            onInput={this.handleNameChange}
            onKeyDown={this.onKeyDown}
            dangerouslySetInnerHTML={{ __html: this.props.process.name }}
            ref={this.nameRef}
          ></span>
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
          <LimitedUI permissions="editing-process:edit">
            <Button clickHandler={this.editProcess}>
              <Icon name="pencil" />
            </Button>
          </LimitedUI>
          <Button clickHandler={this.previewProcess}>
            <Icon name="eye" />
          </Button>
        </div>
      </>
    )
  }

  private editProcess = () => {
    this.props.onProcessEdit(this.props.process)
  }

  private previewProcess = () => {
    this.props.onProcessPreview(this.props.process)
  }

  private handleNameChange = (e: React.FormEvent<HTMLSpanElement>) => {
    const name = e.currentTarget.innerText
    this.setState({ name })
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        this.onSubmit()
        break
      case 'Escape':
        this.cancelEdit()
        break
      default:
        return
    }
  }

  private onSubmit = () => {
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
    this.nameRef.current!.innerText = this.props.process.name
  }
}

export default ProcessInfo