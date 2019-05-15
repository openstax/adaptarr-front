import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot, ProcessStep, SlotPermission, Link } from 'src/api/process'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import './index.css'

type SlotProps = {
  link: Link,
  slots: ProcessSlot[]
  steps: ProcessStep[]
  step: ProcessStep
  onChange: (link: Link) => any
  remove: (slot: Link) => any
}

class LinkComp extends React.Component<SlotProps> {
  state: {
    name: string
    to: number | null
    slot: number | null
    stepsOptions: {value: number, label: string}[],
  } = {
    name: '',
    to: null,
    slot: null,
    stepsOptions: [],
  }

  private updateStateWithProps = () => {
    const { link, step } = this.props

    // Do not pass current step as an option for link target.
    let stepsOptions = this.props.steps.filter(s => s.id !== step.id)
      .map(s => {
        return { value: s.id, label: s.name }
      })
    
    this.setState({
      name: link.name,
      to: link.to,
      slot: link.slot,
      stepsOptions,
    })
  }

  componentDidUpdate(prevProps: SlotProps) {
    const { link: prevLink, steps: prevSteps } = prevProps
    const { link, steps } = this.props
    
    if (JSON.stringify(prevLink) !== JSON.stringify(link)) {
      this.updateStateWithProps()
    } else if (JSON.stringify(prevSteps) !== JSON.stringify(steps)) {
      this.updateStateWithProps()
    }
  }

  componentDidMount() {
    this.updateStateWithProps()
  }

  public render() {
    const { name, to, slot, stepsOptions } = this.state
    const { slots, steps } = this.props

    return (
      <div className="process-link">
        <div className="process-form__title">
          <h3>
            <Localized id="process-form-step-link-name">
              Link name:
            </Localized>
          </h3>
          <div className="process-form__title-controls">
            <Button clickHandler={this.removeLink} color="red">
              <Icon name="minus" />
            </Button>
          </div>
        </div>
        <label>
          <Input
            value={name}
            onChange={this.handleNameChange}
            validation={{ minLength: 1 }}
            trim={true}
          />
        </label>
        <label>
          <span>
            <Localized id="process-form-step-link-to">
              Next step:
            </Localized>
          </span>
          <Select
            value={to !== null && steps[to] ? {value: steps[to].id, label: steps[to].name} : null}
            options={stepsOptions}
            onChange={this.handleTargetStepChange}
          />
        </label>
        <label>
          <span>
            <Localized id="process-form-step-link-slot">
              Slot allowed to use this link:
            </Localized>
          </span>
          <Select
            value={slot !== null && slots[slot] ? {value: slots[slot].id, label: slots[slot].name} : null}
            options={slots.map(s => { return { value: s.id, label: s.name } })}
            onChange={this.handleSlotChange}
          />
        </label>
      </div>
    )
  }

  private removeLink = () => {
    this.props.remove(this.props.link)
  }

  private handleNameChange = (name: string) => {
    this.setState({ name })
    this.props.onChange({
      ...this.props.link,
      name,
    })
  }

  private handleTargetStepChange = ({ value: stepIndex }: { value: number, label: string }) => {
    this.setState({ to: stepIndex })
    this.props.onChange({
      ...this.props.link,
      to: stepIndex,
    })
  }

  private handleSlotChange = ({ value: slotIndex }: { value: number, label: string }) => {
    this.setState({ slot: slotIndex })
    this.props.onChange({
      ...this.props.link,
      slot: slotIndex,
    })
  }
}

export default LinkComp
