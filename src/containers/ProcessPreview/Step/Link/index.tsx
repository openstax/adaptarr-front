import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { Link, ProcessSlot, ProcessStep } from 'src/api/process'

import './index.css'

interface LinkProps {
  slots: ProcessSlot[]
  steps: ProcessStep[]
  link: Link
}

const Link_ = ({ slots, steps, link }: LinkProps) => (
  <div className="process-preview-step-link">
    <span>
      <Localized
        id="process-preview-step-link"
        $slot={slots[link.slot].name}
        $link={link.name}
        $to={steps[link.to].name}
      >
        {`${slots[link.slot].name} can use "${link.name}" which lead to "${steps[link.to].name}"`}
      </Localized>
    </span>
  </div>
)

export default Link_
