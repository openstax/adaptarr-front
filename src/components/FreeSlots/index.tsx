import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Process, { FreeSlot } from 'src/api/process'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import './index.css'

type Props = {
  onUpdate: (freeSlots: FreeSlot[]) => any
}

class FreeSlots extends React.Component<Props> {
  state: {
    freeSlots: FreeSlot[]
    selectedSlot: FreeSlot | null
    showConfirmDialog: boolean
  } = {
    freeSlots: [],
    selectedSlot: null,
    showConfirmDialog: false,
  }

  private fetchFreeSlots = async () => {
    const freeSlots = await Process.freeSlots()
    this.setState({ freeSlots })
  }

  private showConfirmDialog = (slot: FreeSlot) => {
    this.setState({ showConfirmDialog: true, selectedSlot: slot })
  }

  private closeConfirmDialog = () => {
    this.setState({ showConfirmDialog: false, selectedSlot: null })
  }

  componentDidMount = () => {
    this.fetchFreeSlots()
  }
  public render() {
    const { freeSlots, showConfirmDialog } = this.state

    return (
      <div className="free-slots">
        {
          freeSlots.length ?
            <ul className="list free-slots__list">
              {
                freeSlots.map(slot => {
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
        {
          showConfirmDialog ?
            <Dialog
              size="medium"
              l10nId="free-slots-confirm-title"
              placeholder="Take slot"
              onClose={this.closeConfirmDialog}
              showCloseButton={false}
            >
              <div className="free-slots__dialog-content">
                <Localized id="free-slots-confirm-info">
                  You will be assigned to given draft and process manager will be informed that you are willing to work on this task.
                </Localized>
              </div>
              <div className="dialog__buttons">
                <Button clickHandler={this.closeConfirmDialog}>
                  <Localized id="free-slots-cancel">
                    Cancel
                  </Localized>
                </Button>
                <Button clickHandler={this.takeSlot}>
                  <Localized id="free-slots-confirm">
                    Confirm
                  </Localized>
                </Button>
              </div>
            </Dialog>
          : null
        }
      </div>
    )
  }

  private takeSlot = () => {
    const slot = this.state.selectedSlot
    if (!slot) return
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

export default FreeSlots
