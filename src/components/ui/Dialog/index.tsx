import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import validateL20nArgs from 'src/helpers/validateL20nArgs'

import Icon from 'src/components/ui/Icon'

type Props = {
  size?: 'small' | 'medium' | 'big'
  l10nId: string
  placeholder?: string
  className?: string
  onClose: () => void
  children: React.ReactNode
  [localizationProps: string]: any
}

const dialog = ({ size, l10nId, placeholder = "...", className, onClose, children, ...args }: Props) => {
  const clickOnOverlay = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLElement
    if (/dialog__container/.test(element.className)) onClose()
  }

  return (
    <div
      className={`dialog__container dialog__container--${size ? size : 'small'} ${className ? className : null}`}
      onClick={clickOnOverlay}
    >
      <div className="dialog__content">
        <span className="dialog__close" onClick={onClose}>
          <Icon name="close" />
        </span>
        <h2 className="dialog__title">
          <Localized id={l10nId} {...args}>
            {placeholder}
          </Localized>
        </h2>
        {children}
      </div>
    </div>
  )
}

export default dialog
