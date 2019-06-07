import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Localized, ReactLocalization } from 'fluent-react/compat'

import * as api from 'src/api'
import { ReferenceTarget as RefTarget } from 'src/store/types'

import { renderXref } from 'src/screens/app/Draft/plugins/Xref'

import './index.css'

export type Props = {
  /**
   * Module in which this reference target is located.
   */
  module: api.Module | null,
  /**
   * Details about the reference target itself.
   */
  target: RefTarget,
  /**
   * Details about target's context.
   */
  context?: RefTarget,
  /**
   * Function to call when user clicks on this component.
   */
  onSelect: (target: RefTarget, source: api.Module | null) => void,
}

/**
 * Component rendering a single (possibly compound) reference target.
 */
export default class ReferenceTarget extends React.PureComponent<Props> {
  static contextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
  }

  render() {
    const { target, module, onSelect } = this.props
    const { l10n } = this.context

    const counters: [string, number][] = [[target.type, target.counter]]

    const label = renderXref(l10n, { key: target.id, type: target.type }, counters)

    return (
      <div className="target" onClick={this.onClick}>
        <span className="target__description">
          <Localized
            id={target.description ? 'reference-target-description' : 'reference-target'}
            $label={label}
            $description={target.description}
            >
            { target.description
              ? `${label}: ${target.description}`
              : label
            }
          </Localized>
        </span>
        {target.children.length ?
          <ul className="target__nestedList">
            {target.children.map(child => (
              <li key={child.id} className="target__nestedItem">
                <ReferenceTarget
                  module={module}
                  target={child}
                  context={target}
                  onSelect={onSelect}
                />
              </li>
            ))}
          </ul>
        : null}
      </div>
    )
  }

  private onClick = (ev: React.MouseEvent) => {
    const { target, module, onSelect } = this.props
    ev.stopPropagation()
    onSelect(target, module)
  }
}
