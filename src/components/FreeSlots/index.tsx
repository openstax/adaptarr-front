import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Process, { FreeSlot } from 'src/api/process'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  onUpdate: (freeSlots: FreeSlot[]) => any
}

class FreeSlots extends React.Component<Props> {
  state: {
    freeSlots: FreeSlot[]
  } = {
    freeSlots: [],
  }

  private fetchFreeSlots = async () => {
    const freeSlots = await Process.freeSlots()
    this.setState({ freeSlots })
  }

  componentDidMount = () => {
    this.fetchFreeSlots()
  }
  public render() {
    return (
      <div className="free-slots">
        {
          this.state.freeSlots.length ?
            <ul className="list free-slots__list">
              {
                this.state.freeSlots.map(slot => {
                  return (
                    <li key={`${slot.id}-${slot.draft.module}`} className="list__item free-slots__item">
                      <div className="free-slots__info">
                        <span className="free-slots__name">
                          <strong>
                            <Localized id="free-slots-slot-name">
                              Slot name:
                            </Localized>
                          </strong>
                          {slot.name}
                        </span>
                        <span className="free-slots__draft">
                          <strong>
                            <Localized id="free-slots-draft-title">
                              Draft title:
                            </Localized>
                          </strong>
                          {slot.draft.title}
                        </span>
                      </div>
                      <Button clickHandler={() => this.takeSlot(slot)}>
                        <Localized id="free-slots-take-slot">
                          Take slot
                        </Localized>
                      </Button>
                    </li>
                  )
                })
              }
            </ul>
          :
            <Localized id="free-slots-not-avaible">
              There are no free slots for you to take.
            </Localized>
        }
      </div>
    )
  }

  private takeSlot = (slot: FreeSlot) => {
    Process.takeSlot({ draft: slot.draft.module, slot: slot.id })
      .then(() => {
        store.dispatch(addAlert('success', 'free-slots-success', {
          slot: slot.name,
          draft: slot.draft.title,
        }))
        let freeSlots = [...this.state.freeSlots]
        const index = freeSlots.findIndex(s => {
          return s.id === slot.id && s.draft.module === slot.draft.module
        })
        freeSlots.splice(index, 1)
        this.setState({ freeSlots })
        this.props.onUpdate(freeSlots)
      })
      .catch(e => {
        store.dispatch(addAlert('error', 'free-slots-error', {details: e.response.data.error}))
      })
  }
}

export default FreeSlots
