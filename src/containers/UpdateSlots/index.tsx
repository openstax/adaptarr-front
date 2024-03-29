import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { Draft, Module, Team, User } from 'src/api'
import { ProcessDetails, SlotDetails } from 'src/api/draft'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'

import { SlotId, UserId } from '../BeginProcess'

import UsersList from 'src/containers/UsersList'

import SlotInfo from './SlotInfo'
import Dialog from 'src/components/ui/Dialog'

import './index.css'

interface UpdateSlotsProps {
  module: Module | string | undefined
  team: Team
}

interface UpdateSlotsState {
  slots: Map<SlotId, UserId>
  currentSlot: SlotDetails | null
  showAssignUser: boolean
  processSlots: Map<SlotId, SlotDetails>
  draftDetails: ProcessDetails | undefined
}

class UpdateSlots extends React.Component<UpdateSlotsProps> {
  state: UpdateSlotsState = {
    slots: new Map(),
    currentSlot: null,
    showAssignUser: false,
    processSlots: new Map(),
    draftDetails: undefined,
  }

  componentDidMount = async () => {
    const mod = this.props.module
    if (!mod) return
    try {
      const details = await Draft.details(typeof mod === 'string' ? mod : mod.id)
      const processSlots: Map<SlotId, SlotDetails> = new Map()
      details.slots.forEach(s => {
        processSlots.set(s.id, s)
        if (s.user) {
          this.state.slots.set(s.id, s.user.id)
        }
      })
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ draftDetails: details, processSlots })
    } catch (e) {
      store.dispatch(addAlert('error', 'update-slots-fetching-error'))
    }
  }

  public render() {
    const {
      slots,
      currentSlot,
      showAssignUser,
      processSlots,
      draftDetails,
    } = this.state
    const slotRoles = currentSlot ? currentSlot.roles : []
    const roles = new Map(this.props.team.roles.map(r => [r.id, r]))

    if (!draftDetails) {
      return (
        <div className="update-slots">
          <Localized id="update-slots-fetching-error">
            Could not fetch details about slots in this process for given module.
            Please try again later.
          </Localized>
        </div>
      )
    }

    return (
      <div className="update-slots">
        {
          showAssignUser && currentSlot ?
            <Dialog
              l10nId="update-slots-assign-user-title"
              $slot={currentSlot.name}
              $roles={slotRoles.length ? slotRoles.join(', ') : 'undefined'}
              placeholder="Select user with [roles] for current slot."
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
          <Localized id="update-slots-title">
            Manage slots assignments:
          </Localized>
        </h3>
        {
          Array.from(processSlots.values()).map(s => (
            <SlotInfo
              key={s.id}
              slot={s}
              slots={slots}
              roles={roles}
              onAssignUser={this.showAssignUserDialog}
            />
          ))
        }
      </div>
    )
  }

  private handleUserClick = (user: User) => {
    const { currentSlot, slots } = this.state
    const { module: mod } = this.props
    if (currentSlot && mod) {
      Draft.assignUser(typeof mod === 'string' ? mod : mod.id, currentSlot.id, user.id)
        .then(() => {
          slots.set(currentSlot.id, user.id)
          this.forceUpdate()
        })
      this.closeAssignUserDialog()
    }
  }

  private showAssignUserDialog = (slot: SlotDetails) => {
    this.setState({ currentSlot: slot, showAssignUser: true })
  }

  private closeAssignUserDialog = () => {
    this.setState({ showAssignUser: false })
  }
}

export default UpdateSlots
