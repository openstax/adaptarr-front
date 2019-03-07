import * as React from 'react'
import TooltipImpl, { TooltipProps } from 'react-tooltip-lite'
import { Localized } from 'fluent-react/compat'

export type Props = {
  l10nId: string,
  children: React.ReactNode,
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

}

export default function Tooltip({ l10nId, children, ...props }: Props) {
  const content = <Localized id={l10nId} />
  return <TooltipImpl content={content} {...props}>{ children }</TooltipImpl>
}
