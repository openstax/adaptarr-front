import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot } from 'src/api/process'

import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'

import { SlotId, UserId } from '../..'

interface SlotInfoProps {
  slot: ProcessSlot
  slots: Map<SlotId, UserId>
  onAssignUser: (slot: ProcessSlot) => void
  onUnassignUser: (slot: ProcessSlot) => void
}

const SlotInfo = ({ slot, slots, onAssignUser, onUnassignUser }: SlotInfoProps) => {
  const onClickAssign = () => {
    onAssignUser(slot)
  }

  const onClickUnassign = () => {
    onUnassignUser(slot)
  }

  return (
    <div className="configure-slots__slot">
      <div className="configure-slots__info">
        <span className="configure-slots__name">{slot.name}</span>
        {
          slots.has(slot.id) ?
            <Avatar
              size="small"
              user={slots.get(slot.id)}
              withName={true}
            />
            : null
        }
      </div>
      {
        slots.has(slot.id) ?
          <Button clickHandler={onClickUnassign}>
            <Localized id="begin-process-unassign-user">
              Unassign user
            </Localized>
          </Button>
          :
          <Button clickHandler={onClickAssign}>
            <Localized id="begin-process-assign-user">
              Select user
            </Localized>
          </Button>
      }
    </div>
  )
}

export default SlotInfo
