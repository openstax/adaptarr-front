import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Role from 'src/api/role'
import { ProcessSlot } from 'src/api/process'

import Slot from './Slot'

import Button from 'src/components/ui/Button'

import './index.css'

interface ProcessSlotsProps {
  slots: ProcessSlot[]
  roles: Role[]
  onChange: (slots: ProcessSlot[]) => any
}

interface ProcessSlotsState {
  slots: ProcessSlot[]
}

export default class ProcessSlots extends React.Component<ProcessSlotsProps> {
  // We use index as an id for ProcessSlot which makes it easier
  // to update and remove elements. Ids are ignored when creating Process.

  state: ProcessSlotsState = {
    slots: [],
  }

  private updateSlot = (slot: ProcessSlot) => {
    this.setState((prevState: ProcessSlotsState) => {
      const slots = [...prevState.slots]
      slots[slot.id] = slot

      this.props.onChange(slots)

      return { slots }
    })
  }

  private removeSlot = (slot: ProcessSlot) => {
    this.setState((prevState: ProcessSlotsState) => {
      let slots = [...prevState.slots]
      slots.splice(slot.id, 1)
      slots = slots.map((s, i) => ({ ...s, id: i }))

      this.props.onChange(slots)

      return { slots }
    })
  }

  private addEmptySlot = () => {
    this.setState((prevState: ProcessSlotsState) => {
      const slots = [
        ...prevState.slots,
        {
          id: prevState.slots.length,
          name: '',
          autofill: false,
          roles: [],
        },
      ]

      this.props.onChange(slots)

      return { slots }
    })
  }

  private updateSlots = () => {
    // Form expect indexes as an id.
    const slots = this.props.slots.map((s, i) => ({
      ...s,
      id: i,
    }))
    this.setState({ slots })
    this.props.onChange(slots)
  }

  componentDidUpdate(prevProps: ProcessSlotsProps) {
    const prevSlots = prevProps.slots
    const slots = this.props.slots
    if (JSON.stringify(prevSlots) !== JSON.stringify(slots)) {
      this.updateSlots()
    }
  }

  componentDidMount() {
    this.updateSlots()
  }

  public render() {
    return (
      <div className="process-slots">
        <h3>
          <Localized id="process-form-slot-title">
            List of slots:
          </Localized>
        </h3>
        {
          this.state.slots.map((s, i) => (
            <Slot
              key={i}
              slot={s}
              onChange={this.updateSlot}
              remove={this.removeSlot}
              roles={this.props.roles}
            />
          ))
        }
        <Button clickHandler={this.addEmptySlot}>
          <Localized id="process-form-slot-add">
            Add slot
          </Localized>
        </Button>
      </div>
    )
  }
}
