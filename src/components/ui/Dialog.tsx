import * as React from 'react'

import Icon from './Icon'

type Props = {
  title: string
  onClose: () => void
  children: React.ReactNode
}

const dialog = ({ title, onClose, children }: Props) => {
  const clickOnOverlay = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLElement
    if (/dialog__container/.test(element.className)) onClose()
  }

  return (
    <div className="dialog__container" onClick={clickOnOverlay}>
      <div className="dialog__content">
        <span className="dialog__close" onClick={onClose}>
          <Icon name="close" />
        </span>
        <h2 className="dialog__title">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default dialog
