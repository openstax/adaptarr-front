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
  structure?: ProcessStructure | null
  onSubmit: (structure: ProcessStructure) => any
  onCancel: () => any
}

class ProcessForm extends React.Component<Props> {
  state: {
    name: string
    startingStep: number
    slots: ProcessSlot[]
    steps: ProcessStep[]
    errors: Set<string>
  } = {
    name: '',
    startingStep: 0,
    slots: [],
    steps: [],
    errors: new Set(),
  }

  private handleNameChange = (name: string) => {
    this.setState({ name }, () => {
      if (this.state.errors.size) {
        // We validate form every each change only if validation failed before.
        // This way user is able to see that errors, are updating when he make actions.
        this.validateForm()
      }
    })
  }

  private handleStartingStepChange = ({ value }: { value: number, label: string }) => {
    this.setState({ startingStep: value }, () => {
      if (this.state.errors.size) {
        this.validateForm()
      }
    })
  }

  private handleSlotsChange = (slots: ProcessSlot[]) => {
    this.setState({ slots }, () => {
      if (this.state.errors.size) {
        this.validateForm()
      }
    })
  }

  private handleStepsChange = (steps: ProcessStep[]) => {
    this.setState({ steps }, () => {
      if (this.state.errors.size) {
        this.validateForm()
      }
    })
  }

  private onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!this.validateForm()) return

    const { name, startingStep, slots, steps } = this.state

    this.props.onSubmit({
      start: startingStep,
      name,
      slots,
      steps,
    })
  }

  private updateStructure = () => {
    const s = this.props.structure
    if (s) {
      this.setState({
        name: s.name,
        start: s.start,
        slots: s.slots,
        steps: s.steps,
      })
    }
  }

  componentDidUpdate(prevProps: Props) {
    const prevS = prevProps.structure
    const s = this.props.structure
    if (JSON.stringify(prevS) !== JSON.stringify(s)) {
      this.updateStructure()
    }
  }

  componentDidMount() {
    this.updateStructure()
  }

  public render() {
    const { startingStep, slots, steps, errors, name } = this.state

    return (
      <form
        className="process-form"
        onSubmit={this.onSubmit}
      >
        <div className="controls">
          <Button
            clickHandler={this.onSubmit}
            color="green"
            isDisabled={errors.size > 0}
          >
            <Icon name="save" />
            {
              !this.props.structure ?
                <Localized id="process-form-create">
                  Create process
                </Localized>
              :
                <Localized id="process-form-new-version">
                  Create new version
                </Localized>
            }
          </Button>
          <Button clickHandler={this.props.onCancel} color="red">
            <Icon name="close" />
            <Localized id="process-form-cancel">
              Cancel
            </Localized>
          </Button>
        </div>
        {
          errors.size ?
            <ul className="process-form__errors">
              {
                [...errors].map(e => {
                  return <li key={e}><Localized id={e}>{e}</Localized></li>
                })
              }
            </ul>
          : null
        }
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
            slots={slots}
            onChange={this.handleSlotsChange}
          />
          <ProcessSteps
            steps={steps}
            slots={this.state.slots}
            onChange={this.handleStepsChange}
          />
        </div>
      </form>
    )
  }

  private validateForm = (): boolean => {
    // List with l10n ids for error messages.
    let errors: Set<string> = new Set()

    const { name, startingStep, slots, steps } = this.state

    // Validate that names for process, slots, links and step slots exists.
    if (!name.length) {
      errors.add('process-form-error-name')
    }

    slots.some(s => {
      if (!s.name.length) {
        errors.add('process-form-error-slot-name')
        return true
      }
      return false
    })

    steps.some(s => {
      if (!s.name.length) {
        errors.add('process-form-error-step-name')
      }
      return s.links.some(l => {
        if (!l.name.length) {
          errors.add('process-form-error-step-link-name')
          return true
        }
        return false
      })
    })

    // Validate that starting step exists
    if (!steps[startingStep]) {
      errors.add('process-form-error-starting-step')
    }

    // Validate that slots and steps have minimum length
    if (!slots.length) {
      errors.add('process-form-error-slots-min')
    }

    if (steps.length < 2) {
      errors.add('process-form-error-steps-min')
    }

    // Update state
    this.setState({ errors })

    if (!errors.size) return true
    return false
  }
}

export default ProcessForm
