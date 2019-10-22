import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import User from 'src/api/user'
import Team from 'src/api/team'
import { ProcessSlot, ProcessStructure } from 'src/api/process'
import { SlotId, UserId } from '../index'

import UsersList from 'src/containers/UsersList'

import SlotInfo from './SlotInfo'
import Dialog from 'src/components/ui/Dialog'

import './index.css'

interface ConfigureSlotsProps {
  structure: ProcessStructure
  team: Team
  onChange: (slots: Map<SlotId, UserId>) => any
}

interface ConfigureSlotsState {
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
          this.props.structure.slots.map(s => (
            <SlotInfo
              key={s.id}
              slot={s}
              slots={slots}
              onAssignUser={this.showAssignUserDialog}
              onUnassignUser={this.unassignUser}
            />
          ))
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

  private unassignUser = (slot: ProcessSlot) => {
    this.state.slots.delete(slot.id)
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
