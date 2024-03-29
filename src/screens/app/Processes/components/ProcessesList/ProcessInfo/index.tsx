import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Process } from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { fetchProcesses } from 'src/store/actions/app'
import { State } from 'src/store/reducers'
import { TeamsMap } from 'src/store/types'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import LimitedUI from 'src/components/LimitedUI'

import './index.css'

interface ProcessInfoProps {
  process: Process
  teams: TeamsMap
  onProcessEdit: (process: Process) => any
  onProcessPreview: (process: Process) => any
}

const mapStateToProps = ({ app: { teams } }: State) => ({
  teams,
})

interface ProcessInfoState {
  name: string
}

class ProcessInfo extends React.Component<ProcessInfoProps> {
  state: ProcessInfoState = {
    name: this.props.process.name,
  }

  componentDidUpdate(prevProps: ProcessInfoProps) {
    const prevName = prevProps.process.name
    const name = this.props.process.name
    if (prevName !== name) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ name: this.props.process.name })
    }
  }

  nameRef: React.RefObject<HTMLSpanElement> = React.createRef()

  public render() {
    const { process, teams } = this.props

    return (
      <>
        <div className="processes__name-wrapper">
          <form
            className="processes__name"
            onSubmit={this.onSubmit}
          >
            <span
              className="process__content-editable"
              contentEditable
              onInput={this.handleNameChange}
              onKeyDown={this.onKeyDown}
              dangerouslySetInnerHTML={{ __html: process.name }}
              ref={this.nameRef}
            />
            {
              this.state.name !== process.name ?
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
          <span className="processes__team">
            <Localized
              id="processes-team"
              $team={teams.has(process.team) ? teams.get(process.team)!.name : '...'}
            >
              Team: ...
            </Localized>
          </span>
        </div>
        <div className="processes__controls">
          <LimitedUI team={this.props.process.team} permissions="editing-process:edit">
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
      break
    }
  }

  private onSubmit = () => {
    if (this.state.name.length) {
      this.props.process.updateName(this.state.name)
        .then(() => {
          store.dispatch(addAlert('success', 'process-update-name-success'))
          store.dispatch(fetchProcesses())
        })
        .catch(e => {
          store.dispatch(
            addAlert(
              'error',
              'process-update-name-error',
              { details: e.response.data.raw }
            )
          )
        })
    }
  }

  private cancelEdit = () => {
    this.setState({ name: this.props.process.name })
    this.nameRef.current!.innerText = this.props.process.name
  }
}

export default connect(mapStateToProps)(ProcessInfo)
