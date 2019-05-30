import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessStep, ProcessSlot } from 'src/api/process'

import StepSlot from './StepSlot'
import Link from './Link'

import './index.css'

type Props = {
  slots: ProcessSlot[]
  steps: ProcessStep[]
  step: ProcessStep
}

class Step extends React.Component<Props> {
  public render() {
    const { step, slots, steps } = this.props

    return (
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
              step.slots.map((s, i) => {
                return <li key={i}><StepSlot slot={s} slots={slots} /></li>
              })
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
              step.links.map((l, i) => {
                return <li key={i}><Link link={l} slots={slots} steps={steps}/></li>
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default Step
