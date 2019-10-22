import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessSlot, ProcessStep } from 'src/api/process'

import StepSlot from './StepSlot'
import Link from './Link'

import './index.css'

interface StepProps {
  slots: ProcessSlot[]
  steps: ProcessStep[]
  step: ProcessStep
}

const Step = ({ step, slots, steps }: StepProps) => (
  <div className="process-preview-step">
    <h3>
      <Localized id="process-preview-step-name" $name={step.name}>
          Step name:
      </Localized>
    </h3>
    <div className="process-preview-step__slots">
      <h3>
        <Localized id="process-preview-step-slots-list">
            List of step slots:
        </Localized>
      </h3>
      <ul>
        {
          step.slots.map((s, i) => <li key={i}><StepSlot slot={s} slots={slots} /></li>)
        }
      </ul>
    </div>
    <div className="process-preview-step__links">
      <h3>
        <Localized id="process-preview-step-links-list">
            List of step links:
        </Localized>
      </h3>
      <ul>
        {
          step.links.map((l, i) => <li key={i}><Link link={l} slots={slots} steps={steps}/></li>)
        }
      </ul>
    </div>
  </div>
)

export default Step
