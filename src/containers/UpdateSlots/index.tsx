import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import store from 'src/store'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/Alerts'
import { Draft, Module, User, Role } from 'src/api'
import { SlotDetails, ProcessDetails } from 'src/api/draft'
import { SlotId, UserId } from '../BeginProcess'


import UsersList from 'src/containers/UsersList'

import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import './index.css'

type Props = {
  module: Module | string | undefined
  roles: Map<number, Role>
}

const mapStateToProps = ({ app: { roles } }: State) => {
  return {
    roles: new Map(roles.map((r: Role): [number, Role] => [r.id, r])),
  }
}

class UpdateSlots extends React.Component<Props> {
  state: {
    slots: Map<SlotId, UserId>
    currentSlot: SlotDetails | null
    showAssignUser: boolean
    processSlots: Map<SlotId, SlotDetails>
    draftDetails: ProcessDetails | undefined
  } = {
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
      let processSlots: Map<SlotId, SlotDetails> = new Map()
      details.slots.forEach(s => {
        processSlots.set(s.id, s)
        if (s.user) {
          this.state.slots.set(s.id, s.user.id)
        }
      })
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
    const { roles } = this.props
    const currentRole = currentSlot && currentSlot.role && roles.has(currentSlot.role) ? roles.get(currentSlot.role)!.name : 'undefined'

    if (!draftDetails) return (
      <div className="update-slots">
        <Localized id="update-slots-fetching-error">
          Couldn't fetch details about slots in this process for given module. Please try again later.
        </Localized>
      </div>
    )

    return (
      <div className="update-slots">
        {
          showAssignUser && currentSlot ?
            <Dialog
              l10nId="update-slots-assign-user-title"
              $slot={currentSlot.name}
              $role={currentRole}
              placeholder="Select user with [role] for current slot."
              size="medium"
              onClose={this.closeAssignUserDialog}
            >
              <UsersList
                allowedRole={currentSlot.role}
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
          Array.from(processSlots.values()).map(s => {
            const role = s.role ? roles.get(s.role) : null
            const roleName = role ? role.name : 'undefined'
            return (
              <div key={s.id} className="update-slots__slot">
                <div className="update-slots__info">
                  <span className="update-slots__name">
                    <Localized
                      id="update-slots-name"
                      $name={s.name}
                      $role={roleName}
                    >
                      [slot name] for role: [role name]
                    </Localized>
                  </span>
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
                <Button clickHandler={() => this.showAssignUserDialog(s)}>
                  <Localized id="update-slots-assign-user">
                    Select user
                  </Localized>
                </Button>
              </div>
            )
          })
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

export default connect(mapStateToProps)(UpdateSlots)
