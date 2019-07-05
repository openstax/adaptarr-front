import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessStep, ProcessSlot } from 'src/api/process'

import Step from './Step'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
  steps: ProcessStep[]
  slots: ProcessSlot[]
  onChange: (steps: ProcessStep[]) => any
}

class ProcessSteps extends React.Component<Props> {
  // We use index as an id for ProcessStep which makes it easier
  // to update and remove elements. Ids are ignored when creating Process.

  state: {
    steps: ProcessStep[]
  } = {
    steps: [],
  }

  private updateStep = (step: ProcessStep) => {
    let steps = [...this.state.steps]
    steps[step.id] = step
    this.setState({ steps })
    this.props.onChange(steps)
  }

  private removeStep = (step: ProcessStep) => {
    let steps = [...this.state.steps]
    steps.splice(step.id, 1)
    steps = steps.map((s, i) => {
      return {...s, id: i}
    })
    this.setState({ steps })
    this.props.onChange(steps)
  }

  private addEmptyStep = () => {
    const steps = [
      ...this.state.steps,
      {
        id: this.state.steps.length,
        name: '',
        slots: [],
        links: [],
      }
    ]
    this.setState({ steps })
    this.props.onChange(steps)
  }

  private updateSteps = () => {
    // Form expect indexes as an id.
    const steps = this.props.steps.map((s, i) => {
      return {
        ...s,
        id: i,
      }
    })
    this.setState({ steps })
    this.props.onChange(steps)
  }

  componentDidUpdate(prevProps: Props) {
    const prevSteps = prevProps.steps
    const steps = this.props.steps
    if (JSON.stringify(prevSteps) !== JSON.stringify(steps)) {
      this.updateSteps()
    }
  }

  componentDidMount() {
    this.updateSteps()
  }

  public render() {
    return (
      <div className="process-steps">
        <h3>
          <Localized id="process-form-step-title">
            List of steps:
          </Localized>
        </h3>
        {
          this.state.steps.map((s, i) => {
            return <Step
              key={i}
              slots={this.props.slots}
              steps={this.state.steps}
              step={s}
              onChange={this.updateStep}
              remove={this.removeStep}
            />
          })
        }
        <Button clickHandler={this.addEmptyStep}>
          <Localized id="process-form-step-add">
            Add step
          </Localized>
        </Button>
      </div>
    )
  }
}

export default ProcessSteps
