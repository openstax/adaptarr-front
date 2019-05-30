import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot, SlotPermission, StepSlot } from 'src/api/process'
import { StepSlotWithId } from '../Step'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

const PERMISSIONS: SlotPermission[] = ['view', 'edit', 'accept-changes', 'propose-changes']

type SlotProps = {
  slots: ProcessSlot[]
  slot: StepSlotWithId
  onChange: (slot: StepSlot) => any
  remove: (slot: StepSlot) => any
}

class Slot extends React.Component<SlotProps> {
  state: {
    slot: number | null
    permission: SlotPermission | null
  } = {
    slot: null,
    permission: null,
  }

  private updateStateWithProps = () => {
    const slot = this.props.slot
    this.setState({
      slot: slot.slot,
      permission: slot.permission,
    })
  }

  componentDidUpdate(prevProps: SlotProps) {
    const prevSlot = prevProps.slot
    const slot = this.props.slot
    
    if (JSON.stringify(prevSlot) !== JSON.stringify(slot)) {
      this.updateStateWithProps()
    }
  }

  componentDidMount() {
    this.updateStateWithProps()
  }

  public render() {
    const { slot, permission } = this.state
    const { slots } = this.props

    return (
      <div className="process-slot">
        <div className="process-form__title">
          <h3>
            <Localized id="process-form-step-slot-slot">
              Slot:
            </Localized>
          </h3>
          <div className="process-form__title-controls">
            <Button clickHandler={this.removeSlot} color="red">
              <Icon name="minus" />
            </Button>
          </div>
        </div>
        <label>
          <Select
            value={slot !== null && slots[slot] ? {value: slots[slot].id, label: slots[slot].name} : null}
            options={slots.map(s => {return {value: s.id, label: s.name}})}
            onChange={this.handleSlotChange}
          />
        </label>
        <label>
          <span>
            <Localized id="process-form-step-slot-permission">
              Permission:
            </Localized>
          </span>
          <Select
            value={permission ? {value: permission, label: permission} : null}
            options={PERMISSIONS.map(p => {
              return {
                value: p,
                label: p,
              }
            })}
            onChange={this.handlePermissionChange}
          />
        </label>
      </div>
    )
  }

  private removeSlot = () => {
    this.props.remove(this.props.slot)
  }

  private handleSlotChange = ({ value: slotIndex }: {value: number, label: string}) => {
    this.setState({ slot: slotIndex })
    this.props.onChange({
      ...this.props.slot,
      slot: slotIndex,
    })
  }

  private handlePermissionChange = ({ value: permission }: { value: SlotPermission, label: SlotPermission }) => {
    this.setState({ permission })
    this.props.onChange({
      ...this.props.slot,
      permission,
    })
  }
}

export default Slot
