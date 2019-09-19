import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import Process, { FreeSlot } from 'src/api/process'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers'

import confirmDialog from 'src/helpers/confirmDialog'

import Button from 'src/components/ui/Button'

import './index.css'

export type FreeSlotsProps = {
  selectedTeams: number[]
  onUpdate: (freeSlots: FreeSlot[]) => any
}

const mapStateToProps = ({ app: { selectedTeams } }: State) => {
  return {
    selectedTeams,
  }
}

export type FreeSlotsState = {
  freeSlots: FreeSlot[]
}

class FreeSlots extends React.Component<FreeSlotsProps> {
  state: FreeSlotsState = {
    freeSlots: [],
  }

  private fetchFreeSlots = async () => {
    const freeSlots = await Process.freeSlots()
    this.setState({ freeSlots })
  }

  private showConfirmDialog = async (slot: FreeSlot) => {
    const res = await confirmDialog({
      title: 'free-slots-confirm-title',
      content: <div className="free-slots__dialog-content">
                <Localized id="free-slots-confirm-info">
                  You will be assigned to given draft and process manager will be
                  informed that you are willing to work on this task.
                </Localized>
              </div>,
      buttons: {
        cancel: 'free-slots-cancel',
        confirm: 'free-slots-confirm',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.takeSlot(slot)
    }
  }

  componentDidMount = () => {
    this.fetchFreeSlots()
  }
  public render() {
    const { freeSlots } = this.state
    const { selectedTeams } = this.props

    return (
      <div className="free-slots">
        {
          freeSlots.length ?
            <ul className="list free-slots__list">
              {
                freeSlots.map(slot => {
                  if (!selectedTeams.includes(slot.draft.team)) return null

                  return (
                    <li key={`${slot.id}-${slot.draft.module}`} className="list__item free-slots__item">
                      <div className="free-slots__top-bar">
                        <span className="free-slots__draft">
                          {slot.draft.title}
                        </span>
                        <Button to={`/drafts/${slot.draft.module}`}>
                          <Localized id="free-slots-view-draft">
                            View draft
                          </Localized>
                        </Button>
                      </div>
                      <div className="free-slots__bottom-bar">
                        <Button clickHandler={() => this.showConfirmDialog(slot)}>
                          <span className="free-slots__name">
                            {slot.name}
                          </span>
                          <Localized id="free-slots-take-slot">
                            Take slot
                          </Localized>
                        </Button>
                      </div>
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
        const details = e.response.data.error
        store.dispatch(addAlert('error', 'free-slots-error', {details: details ? details : 'none'}))
      })
  }
}

export default connect(mapStateToProps)(FreeSlots)
