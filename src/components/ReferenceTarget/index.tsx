import * as React from 'react'

import i18n from 'src/i18n'

import * as api from 'src/api'
import { ReferenceTarget as RefTarget } from 'src/store/types'

import './index.css'

export type Props = {
  /**
   * Module in which this reference target is located.
   */
  module: api.Module | null,
  /**
   * Details about the reference target itself.
   */
  target: ReferenceTargetWithLabel,
  /**
   * Details about target's context.
   */
  context?: RefTarget,
  /**
   * Function to call when user clicks on this component.
   */
  onSelect: (target: RefTarget, source: api.Module | null) => void,
}

export type ReferenceTargetWithLabel = RefTarget & {
  label?: string,
}

/**
 * Component rendering a single (possibly compound) reference target.
 */
export default class ReferenceTarget extends React.PureComponent<Props> {
  render() {
    const { target, context, module, onSelect } = this.props

    const description =
      target.label
        // TODO: internationalise target: label somehow
        ? target.description
          ? `${target.label}: ${target.description}`
          : target.label
        : i18n.t(
            target.description
              ? `ReferenceTarget.description.${target.type}`
              : `ReferenceTarget.name.${target.type}`,
            {
              lng: module ? module.language : undefined,
              description: target.description,
              counter: target.counter,
              context: context && context.counter,
            }
          )

    return (
      <div className="reference-target" onClick={this.onClick}>
        <span className="description">
          {description}
        </span>
        {target.children.map(child => (
          <ReferenceTarget
            key={child.id}
            module={module}
            target={child}
            context={target}
            onSelect={onSelect}
            />
        ))}
      </div>
    )
  }

  private onClick = (ev: React.MouseEvent) => {
    const { target, module, onSelect } = this.props
    ev.stopPropagation()
    onSelect(target, module)
  }
}
