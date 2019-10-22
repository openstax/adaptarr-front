import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { Link, ProcessSlot, ProcessStep, SlotPermission } from 'src/api/process'

import Slot from '../Slot'
import LinkComp from '../Link'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

import './index.css'

interface StepProps {
  slots: ProcessSlot[]
  steps: ProcessStep[]
  step: ProcessStep
  onChange: (step: ProcessStep) => any
  remove: (step: ProcessStep) => any
}

export interface StepSlotWithId {
  id: number
  slot: number
  permission: SlotPermission
}

interface StepState {
  name: string
  slots: StepSlotWithId[],
  links: Link[],
}

class Step extends React.Component<StepProps> {
  state: StepState = {
    name: '',
    slots: [{
      id: 0,
      slot: 0,
      permission: 'view',
    }],
    links: [],
  }

  private updateSlot = (slot: StepSlotWithId) => {
    this.setState((prevState: StepState) => {
      const slots = [...prevState.slots]
      slots[slot.id] = slot

      this.props.onChange({
        ...this.props.step,
        slots,
      })

      return { slots }
    })
  }

  private removeSlot = (slot: StepSlotWithId) => {
    this.setState((prevState: StepState) => {
      let slots = [...prevState.slots]
      slots.splice(slot.id, 1)
      slots = slots.map((s, i) => ({ ...s, id: i }))

      this.props.onChange({
        ...this.props.step,
        slots,
      })

      return { slots }
    })
  }

  private updateLink = (link: Link, index: number) => {
    this.setState((prevState: StepState) => {
      const links = [...prevState.links]
      links[index] = link

      this.props.onChange({
        ...this.props.step,
        links,
      })

      return { links }
    })
  }

  private removeLink = (index: number) => {
    this.setState((prevState: StepState) => {
      const links = [...prevState.links]
      links.splice(index, 1)

      this.props.onChange({
        ...this.props.step,
        links,
      })

      return { links }
    })
  }

  private addEmptySlot = () => {
    this.setState((prevState: StepState) => {
      const slots = [
        ...prevState.slots,
        {
          id: prevState.slots.length,
          slot: 0,
          permission: 'view',
        } as StepSlotWithId,
      ]

      this.props.onChange({
        ...this.props.step,
        slots,
      })

      return { slots }
    })
  }

  private addEmptyLink = () => {
    this.setState((prevState: StepState) => {
      const links = [
        ...prevState.links,
        {
          name: '',
          to: null, // When adding empty link we do not want to select origin as a target
          slot: 0,
        } as unknown as Link,
      ]

      this.props.onChange({
        ...this.props.step,
        links,
      })

      return { links }
    })
  }

  private updateStateWithProps = () => {
    const step = this.props.step
    // step.slots will be StepSlotWithId[] or StepSlot[] depends
    // if we are editing exsiting process or creating new one.
    // We need id to easier updating so we are just adding it.
    const slots: StepSlotWithId[] = step.slots.map(
      (s: StepSlotWithId, i) => ({ ...s, id: s.id || i })
    )
    this.setState({
      name: step.name,
      slots,
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
    const { slots: processSlots, steps: processSteps, step } = this.props

    return (
      <div className="process-step">
        <div className="process-form__title">
          <h3>
            <Localized id="process-form-step-name">
              Step name:
            </Localized>
          </h3>
          <div className="process-form__title-controls">
            <Button type="danger" clickHandler={this.removeStep}>
              <Localized id="process-form-remove">
                Remove
              </Localized>
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
            slots.map((s, i) => (
              <Slot
                key={i}
                slots={this.props.slots}
                slot={s}
                onChange={this.updateSlot}
                remove={this.removeSlot}
              />
            ))
          }
          <Button clickHandler={this.addEmptySlot}>
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
              const onChange = (link: Link) => {
                this.updateLink(link, i)
              }
              const onRemoveLink = () => {
                this.removeLink(i)
              }
              return (
                <LinkComp
                  key={i}
                  link={l}
                  step={step}
                  steps={processSteps}
                  slots={processSlots}
                  stepSlots={slots}
                  onChange={onChange}
                  remove={onRemoveLink}
                />
              )
            })
          }
          <Button clickHandler={this.addEmptyLink}>
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
