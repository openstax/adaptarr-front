import * as React from 'react'
import TooltipImpl from 'react-tooltip-lite'
import { Localized } from 'fluent-react/compat'

export type Props = {
  l10nId: string,
  children: JSX.Element,
  // From TooltipImpl
  arrow?: boolean,
  arrowSize?: number,
  background?: string,
  className?: string,
  color?: string,
  direction?: string,
  distance?: number,
  eventOff?: string,
  eventOn?: string,
  eventToggle?: string,
  forceDirection?: boolean,
  hoverDelay?: number,
  isOpen?: boolean,
  padding?: string,
  styles?: object,
  tagName?: string,
  tipContentHover?: boolean,
  tipContentClassName?: string,
  useHover?: boolean,
  useDefaultStyles?: boolean,
  isDisabled?: boolean
}

export default function Tooltip({ l10nId, children, isDisabled, ...props }: Props) {
  if (isDisabled) return children
  const content = <Localized id={l10nId}>...</Localized>
  return <TooltipImpl content={content} {...props}>{ children }</TooltipImpl>
}
