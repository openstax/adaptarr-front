import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { ProcessStep, Link, ProcessSlot } from 'src/api/process'

import './index.css'

type Props = {
  slots: ProcessSlot[]
  steps: ProcessStep[]
  link: Link
}

class Link_ extends React.Component<Props> {
  public render() {
    const { slots, steps, link } = this.props

    return (
      <div className="process-preview-step-link">
        <span>
          <Localized
            id="process-preview-step-link"
            $slot={slots[link.slot].name}
            $link={link.name}
            $to={steps[link.to].name}
          >
            [slot name] may use [link name] which lead to [target name]
          </Localized>
        </span>
      </div>
    )
  }
}

export default Link_
