import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot } from 'src/api/process'

import Slot from './Slot'
import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  slots: ProcessSlot[]
  onChange: (slots: ProcessSlot[]) => any
}

export default class ProcessSlots extends React.Component<Props> {
  // We use index as an id for ProcessSlot which makes it easier
  // to update and remove elements. Ids are ignored when creating Process.

  state: {
    name: string
    slots: ProcessSlot[]
  } = {
    name: '',
    slots: [],
  }

  private updateSlot = (slot: ProcessSlot) => {
    let slots = [...this.state.slots]
    slots[slot.id] = slot
    this.setState({ slots })
    this.props.onChange(slots)
  }

  private removeSlot = (slot: ProcessSlot) => {
    let slots = [...this.state.slots]
    slots.splice(slot.id, 1)
    slots = slots.map((s, i) => {
      return {...s, id: i}
    })
    this.setState({ slots })
    this.props.onChange(slots)
  }

  private addEmptySlot = () => {
    const slots = [
      ...this.state.slots,
      {
        id: this.state.slots.length,
        name: '',
        autofill: false,
        roles: [],
      }
    ]
    this.setState({ slots })
    this.props.onChange(slots)
  }

  private updateSlots = () => {
    // Form expect indexes as an id.
    const slots = this.props.slots.map((s, i) => {
      return {
        ...s,
        id: i,
      }
    })
    this.setState({ slots })
    this.props.onChange(slots)
  }

  componentDidUpdate(prevProps: Props) {
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
          this.state.slots.map((s, i) => {
            return <Slot
              key={i}
              slot={s}
              onChange={this.updateSlot}
              remove={this.removeSlot}
            />
          })
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
