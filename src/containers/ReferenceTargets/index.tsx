import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import * as api from 'src/api'

import RefTarget from 'src/components/ReferenceTarget'

import { ReferenceTarget } from 'src/store/types'

export type Props = {
  /**
   * Module in which reference targets are located.
   */
  module: api.Module | null,
  /**
   * List of reference targets to display.
   */
  targets: ReferenceTarget[],
  /**
   * Function to call when user selects a resource target.
   */
  onSelect: (target: ReferenceTarget, source: api.Module | null) => void,
}

/**
 * A list of reference targets, all of which are in a single module.
 */
export default function ReferenceTargets({ module, targets, onSelect }: Props) {
  const sorted = new Map<string, ReferenceTarget[]>()

  for (const target of targets) {
    if (!sorted.has(target.type)) {
      sorted.set(target.type, [])
    }

    sorted.get(target.type)!.push(target)
  }

  return (
    <ul className="targets">
      {Array.from(sorted.entries(), ([type, targets]) => (
        <li key={type} className="targets__category">
          <span className="targets__title">
            <Localized id="reference-targets-category" $type={type}>$type</Localized>
          </span>
          {targets.map(target => (
            <RefTarget
              key={target.id}
              module={module}
              target={target}
              onSelect={onSelect}
            />
          ))}
        </li>
      ))}
    </ul>
  )
}
