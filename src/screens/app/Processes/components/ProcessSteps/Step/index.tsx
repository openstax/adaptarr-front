import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessStep, StepSlot, Link, ProcessSlot } from 'src/api/process'

import Slot from '../Slot'
import LinkComp from '../Link'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import './index.css'

type StepProps = {
  slots: ProcessSlot[]
  steps: ProcessStep[]
  step: ProcessStep
  onChange: (step: ProcessStep) => any
  remove: (step: ProcessStep) => any
}

export interface StepSlotWithId extends StepSlot {
  id: number
}

class Step extends React.Component<StepProps> {
  state: {
    name: string
    slots: StepSlotWithId[],
    links: Link[],
  } = {
    name: '',
    slots: [{
      id: 0,
      slot: 0,
      permission: 'view',
    }],
    links: [],
  }

  private updateSlot = (slot: StepSlotWithId) => {
    let slots = [...this.state.slots]
    slots[slot.id] = slot
    this.setState({ slots })
    this.props.onChange({
      ...this.props.step,
      slots,
    })
  }

  private removeSlot = (slot: StepSlotWithId) => {
    let slots = [...this.state.slots]
    slots.splice(slot.id, 1)
    slots = slots.map((s, i) => {
      return {...s, id: i}
    })
    this.setState({ slots })
    this.props.onChange({
      ...this.props.step,
      slots,
    })
  }

  private updateLink = (link: Link, index: number) => {
    let links = [...this.state.links]
    links[index] = link
    this.setState({ links })
    this.props.onChange({
      ...this.props.step,
      links,
    })
  }

  private removeLink = (index: number) => {
    let links = [...this.state.links]
    links.splice(index, 1)
    this.setState({ links })
    this.props.onChange({
      ...this.props.step,
      links,
    })
  }

  private addEmptySlot = () => {
    const slots = [
      ...this.state.slots,
      {
        id: this.state.slots.length,
        slot: 0,
        permission: 'view',
      } as StepSlotWithId
    ]
    this.setState({ slots })
    this.props.onChange({
      ...this.props.step,
      slots,
    })
  }

  private addEmptyLink = () => {
    const links = [
      ...this.state.links,
      {
        name: '',
        to: 0,
        slot: 0,
      }
    ]
    this.setState({ links })
    this.props.onChange({
      ...this.props.step,
      links,
    })
  }

  private updateStateWithProps = () => {
    const step = this.props.step
    this.setState({
      name: step.name,
      slots: step.slots,
      links: step.links,
    })
  }

  componentDidUpdate(prevProps: StepProps) {
    const prevStep = prevProps.step
    const step = this.props.step
    
    if (JSON.stringify(prevStep) !== JSON.stringify(step)) {
      this.updateStateWithProps()
    }
  }

  componentDidMount() {
    this.updateStateWithProps()
  }

  public render() {
    const { name, slots, links } = this.state
    const { slots: processSlots, steps: processSteps } = this.props

    return (
      <div className="process-step">
        <div className="process-form__title">
          <h3>
            <Localized id="process-form-step-name">
              Step name:
            </Localized>
          </h3>
          <div className="process-form__title-controls">
            <Button clickHandler={this.removeStep} color="red">
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
        <h3>
          <Localized id="process-form-step-slots">
            Step slots:
          </Localized>
        </h3>
        <div className="process-step__slots">
          {
            slots.map((s, i) => {
              return <Slot
                key={i}
                slots={this.props.slots}
                slot={s}
                onChange={this.updateSlot}
                remove={this.removeSlot}
              />
            })
          }
          <Button clickHandler={this.addEmptySlot}>
            <Icon name="plus" />
            <Localized id="process-form-step-slots-add">
              Add slot
            </Localized>
          </Button>
        </div>
        <h3>
          <Localized id="process-form-step-links">
            Step links:
          </Localized>
        </h3>
        <div className="process-step__links">
          {
            links.map((l, i) => {
              return <LinkComp
                key={i}
                link={l}
                steps={processSteps}
                slots={processSlots}
                onChange={(link) => this.updateLink(link, i)}
                remove={() => this.removeLink(i)}
              />
            })
          }
          <Button clickHandler={this.addEmptyLink}>
            <Icon name="plus" />
            <Localized id="process-form-step-links-add">
              Add link
            </Localized>
          </Button>
        </div>
      </div>
    )
  }

  private removeStep = () => {
    this.props.remove(this.props.step)
  }

  private handleNameChange = (name: string) => {
    this.setState({ name })
    this.props.onChange({
      ...this.props.step,
      name,
    })
  }
}

export default Step
