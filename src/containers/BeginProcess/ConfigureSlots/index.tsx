import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import User from 'src/api/user'
import Team from 'src/api/team'
import { ProcessStructure, ProcessSlot } from 'src/api/process'
import { SlotId, UserId } from '../index'

import UsersList from 'src/containers/UsersList'

import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import './index.css'

export type ConfigureSlotsProps = {
  structure: ProcessStructure
  team: Team
  onChange: (slots: Map<SlotId, UserId>) => any
}

export type ConfigureSlotsState = {
  slots: Map<SlotId, UserId>
  currentSlot: ProcessSlot | null
  showAssignUser: boolean
}

class ConfigureSlots extends React.Component<ConfigureSlotsProps> {
  state: ConfigureSlotsState = {
    slots: new Map(),
    currentSlot: null,
    showAssignUser: false,
  }

  public render() {
    const { slots, currentSlot, showAssignUser } = this.state

    return (
      <div className="configure-slots">
        {
          showAssignUser && currentSlot ?
            <Dialog
              l10nId="begin-process-assign-user-title"
              placeholder="Select user for this slot."
              size="medium"
              onClose={this.closeAssignUserDialog}
            >
              <UsersList
                allowedRoles={currentSlot.roles}
                team={this.props.team}
                onUserClick={this.handleUserClick}
              />
            </Dialog>
          : null
        }
        <h3>
          <Localized id="begin-process-slots-title">
            Configure slots:
          </Localized>
        </h3>
        {
          this.props.structure.slots.map(s => {
            return (
              <div key={s.id} className="configure-slots__slot">
                <div className="configure-slots__info">
                  <span className="configure-slots__name">{s.name}</span>
                  {
                    slots.has(s.id) ?
                      <Avatar
                        size="small"
                        user={slots.get(s.id)}
                        withName={true}
                      />
                    : null
                  }
                </div>
                {
                  slots.has(s.id) ?
                    <Button clickHandler={() => this.unassignUser(s.id)}>
                      <Localized id="begin-process-unassign-user">
                        Unassign user
                      </Localized>
                    </Button>
                  :
                    <Button clickHandler={() => this.showAssignUserDialog(s)}>
                      <Localized id="begin-process-assign-user">
                        Select user
                      </Localized>
                    </Button>
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  private handleUserClick = (user: User) => {
    const { currentSlot, slots } = this.state
    if (currentSlot) {
      slots.set(currentSlot.id, user.id)
      this.forceUpdate(() => {
        this.props.onChange(this.state.slots)
      })
      this.closeAssignUserDialog()
    }
  }

  private unassignUser = (slotId: SlotId) => {
    this.state.slots.delete(slotId)
    this.forceUpdate(() => {
      this.props.onChange(this.state.slots)
    })
  }

  private showAssignUserDialog = (slot: ProcessSlot) => {
    this.setState({ currentSlot: slot, showAssignUser: true })
  }

  private closeAssignUserDialog = () => {
    this.setState({ showAssignUser: false })
  }
}

export default ConfigureSlots
