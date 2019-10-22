import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot, StepSlot } from 'src/api/process'

import './index.css'

interface StepSlotProps {
  slots: ProcessSlot[]
  slot: StepSlot
}

const StepSlot_ = ({ slot, slots }: StepSlotProps) => (
  <div className="process-preview-step-slot">
    <span>
      <Localized
        id="process-preview-step-slot"
        $name={slots[slot.slot].name}
        $permission={slot.permission}
      >
        {`${slots[slot.slot].name} is able to ${slot.permission}`}
      </Localized>
    </span>
  </div>
)

export default StepSlot_
