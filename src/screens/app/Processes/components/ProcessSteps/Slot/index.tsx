import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot, SlotPermission, StepSlot } from 'src/api/process'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

const PERMISSIONS: SlotPermission[] = ['View', 'Edit', 'AcceptChanges', 'ProposeChanges']

type SlotProps = {
  slots: ProcessSlot[]
  slot: StepSlot
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
        <label>
          <span>
            <Localized id="process-form-step-slot-slot">
              Slot:
            </Localized>
          </span>
          <Select
            value={slot ? slots[slot].name : null}
            options={slots.map(s => s.name)}
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
            value={permission}
            options={PERMISSIONS}
            onChange={this.handlePermissionChange}
            getOptionLabel={getOptionLabel}
          />
        </label>
        <Button clickHandler={this.removeSlot} color="red">
          <Icon name="close" />
          <Localized id="process-form-slot-remove">
            Remove slot
          </Localized>
        </Button>
      </div>
    )
  }

  private removeSlot = () => {
    this.props.remove(this.props.slot)
  }

  private handleSlotChange = (slotName: string) => {
    const slotIndex = this.props.slots.findIndex(s => s.name === slotName)
    this.setState({ slot: slotIndex })
    this.props.onChange({
      ...this.props.slot,
      slot: slotIndex,
    })
  }

  private handlePermissionChange = (permission: SlotPermission) => {
    this.setState({ permission })
    this.props.onChange({
      ...this.props.slot,
      permission,
    })
  }
}

export default Slot

function getOptionLabel(permission: SlotPermission) {
  return permission.split(/(?=[A-Z])/).join(' ')
}
