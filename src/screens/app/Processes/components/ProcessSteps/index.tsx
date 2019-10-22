import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot, ProcessStep } from 'src/api/process'

import Step from './Step'
import Button from 'src/components/ui/Button'

import './index.css'

interface ProcessStepsProps {
  steps: ProcessStep[]
  slots: ProcessSlot[]
  onChange: (steps: ProcessStep[]) => any
}

interface ProcessStepsState {
  steps: ProcessStep[]
}

class ProcessSteps extends React.Component<ProcessStepsProps> {
  // We use index as an id for ProcessStep which makes it easier
  // to update and remove elements. Ids are ignored when creating Process.

  state: ProcessStepsState = {
    steps: [],
  }

  private updateStep = (step: ProcessStep) => {
    this.setState((prevState: ProcessStepsState) => {
      const steps = [...prevState.steps]
      steps[step.id] = step

      this.props.onChange(steps)

      return { steps }
    })
  }

  private removeStep = (step: ProcessStep) => {
    this.setState((prevState: ProcessStepsState) => {
      let steps = [...prevState.steps]
      steps.splice(step.id, 1)
      steps = steps.map((s, i) => ({ ...s, id: i }))

      this.props.onChange(steps)

      return { steps }
    })
  }

  private addEmptyStep = () => {
    this.setState((prevState: ProcessStepsState) => {
      const steps = [
        ...prevState.steps,
        {
          id: prevState.steps.length,
          name: '',
          slots: [],
          links: [],
        },
      ]
      this.props.onChange(steps)
      return { steps }
    })
  }

  private updateSteps = () => {
    // Form expect indexes as an id.
    const steps = this.props.steps.map((s, i) => ({
      ...s,
      id: i,
    }))
    this.setState({ steps })
    this.props.onChange(steps)
  }

  componentDidUpdate(prevProps: ProcessStepsProps) {
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
          this.state.steps.map((s, i) => (
            <Step
              key={i}
              slots={this.props.slots}
              steps={this.state.steps}
              step={s}
              onChange={this.updateStep}
              remove={this.removeStep}
            />
          ))
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
