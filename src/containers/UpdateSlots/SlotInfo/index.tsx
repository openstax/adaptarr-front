import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { SlotDetails } from 'src/api/draft'
import { Role } from 'src/api'

import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'

import { SlotId, UserId } from 'src/containers/BeginProcess'

interface SlotInfoProps {
  slot: SlotDetails
  slots: Map<SlotId, UserId>
  roles: Map<number, Role>
  onAssignUser: (slot: SlotDetails) => void
}

const SlotInfo = ({ slot, slots, roles, onAssignUser }: SlotInfoProps) => {
  const roleNames: string[] = []
  slot.roles.forEach(rId => {
    if (roles.has(rId)) {
      roleNames.push(roles.get(rId)!.name)
    }
  })

  const onClickSelectUser = () => {
    onAssignUser(slot)
  }

  return (
    <div className="update-slots__slot">
      <div className="update-slots__info">
        <span className="update-slots__name">
          <Localized
            id="update-slots-name"
            $name={slot.name}
            $roles={roleNames.length ? roleNames.join(', ') : 'undefined'}
          >
            [slot name] for role: [role name]
          </Localized>
        </span>
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
      <Button clickHandler={onClickSelectUser}>
        <Localized id="update-slots-assign-user">
          Select user
        </Localized>
      </Button>
    </div>
  )
}

export default SlotInfo
