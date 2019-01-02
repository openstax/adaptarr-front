import './index.css'

import * as React from 'react'
import { Trans } from 'react-i18next'

import Icon from 'src/components/ui/Icon'

type Props = {
  size?: 'small' | 'medium' | 'big'
  i18nKey?: string
  title?: string
  className?: string
  onClose: () => void
  children: React.ReactNode
}

const dialog = ({ size, i18nKey, title, className, onClose, children }: Props) => {
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
          {
            i18nKey ?
              <Trans i18nKey={i18nKey}/>
            :
              title
          }
        </h2>
        {children}
      </div>
    </div>
  )
}

export default dialog
