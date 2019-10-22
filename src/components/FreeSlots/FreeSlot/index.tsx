import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { FreeSlot } from 'src/api/process'

import Button from 'src/components/ui/Button'

interface FreeSlotProps {
  slot: FreeSlot
  onTakeSlot: (slot: FreeSlot) => void
}

const _FreeSlot = ({ slot, onTakeSlot }: FreeSlotProps) => {
  const onClick = () => {
    onTakeSlot(slot)
  }

  return (
    <>
      <div className="free-slots__top-bar">
        <span className="free-slots__draft">
          {slot.draft.title}
        </span>
        <Button to={`/drafts/${slot.draft.module}/view`}>
          <Localized id="free-slots-view-draft">
            View draft
          </Localized>
        </Button>
      </div>
      <div className="free-slots__bottom-bar">
        <Button clickHandler={onClick}>
          <span className="free-slots__name">
            {slot.name}
          </span>
          <Localized id="free-slots-take-slot">
            Take slot
          </Localized>
        </Button>
      </div>
    </>
  )
}

export default _FreeSlot
