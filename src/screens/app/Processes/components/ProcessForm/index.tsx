import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot, ProcessStep, ProcessStructure } from 'src/api/process'

import ProcessSlots from '../ProcessSlots'
import ProcessSteps from '../ProcessSteps'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'
import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
  onSubmit: (structure: ProcessStructure) => any
  onCancel: () => any
}

class ProcessForm extends React.Component<Props> {
  state: {
    name: string
    startingStep: number
    slots: ProcessSlot[]
    steps: ProcessStep[]
  } = {
    name: '',
    startingStep: 0,
    slots: [],
    steps: [],
  }

  private handleNameChange = (name: string) => {
    this.setState({ name })
  }

  private handleStartingStepChange = ({ value }: { value: number, label: string }) => {
    this.setState({ startingStep: value })
  }

  private handleSlotsChange = (slots: ProcessSlot[]) => {
    this.setState({ slots })
  }

  private handleStepsChange = (steps: ProcessStep[]) => {
    this.setState({ steps })
  }

  private onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const { name, startingStep, slots, steps } = this.state

    this.props.onSubmit({
      start: startingStep,
      name,
      slots,
      steps,
    })
  }

  public render() {
    const { startingStep, steps } = this.state

    return (
      <form
        className="process-form"
        onSubmit={this.onSubmit}
      >
        <div className="controls">
          <Button clickHandler={this.onSubmit} color="green">
            <Icon name="save" />
            <Localized id="process-form-create">
              Create process
            </Localized>
          </Button>
          <Button clickHandler={this.props.onCancel} color="red">
            <Icon name="close" />
            <Localized id="process-form-cancel">
              Cancel
            </Localized>
          </Button>
        </div>
        <label>
          <span>
            <Localized id="process-form-process-name">
              Process name
            </Localized>
          </span>
          <Input
            value={name}
            onChange={this.handleNameChange}
            validation={{ minLength: 1 }}
          />
        </label>
        <label>
          <span>
            <Localized id="process-form-process-starting-step">
              Starting step
            </Localized>
          </span>
          <Select
            value={startingStep >= 0 && steps[startingStep] ? {value: startingStep, label: steps[startingStep].name} : null}
            options={steps.map((s, i) => {
              return {
                value: i,
                label: s.name,
              }
            })}
            onChange={this.handleStartingStepChange}
          />
        </label>
        <div className="process-form__split">
          <ProcessSlots
            onChange={this.handleSlotsChange}
          />
          <ProcessSteps
            slots={this.state.slots}
            onChange={this.handleStepsChange}
          />
        </div>
      </form>
    )
  }
}

export default ProcessForm
