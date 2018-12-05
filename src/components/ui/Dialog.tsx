import * as React from 'react'

type Props = {
  onClose: () => void
  children: React.ReactNode
}

const dialog = ({ onClose, children }: Props) => {
  const clickOnOverlay = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLElement
    if (/dialog__container/.test(element.className)) onClose()
  }

  return (
    <div className="dialog__container" onClick={clickOnOverlay}>
      <div className="dialog__content">
        <span className="dialog__close" onClick={onClose}>x</span>
        {children}
      </div>
    </div>
  )
}

export default dialog
