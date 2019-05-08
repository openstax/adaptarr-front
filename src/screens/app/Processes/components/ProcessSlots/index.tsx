import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot } from 'src/api/process'

import Slot from './Slot'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
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
        role: null,
      }
    ]
    this.setState({ slots })
    this.props.onChange(slots)
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
          <Icon name="plus" />
          <Localized id="process-form-slot-add">
            Add slot
          </Localized>
        </Button>
      </div>
    )
  }
}
