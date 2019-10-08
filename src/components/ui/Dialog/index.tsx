import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Modal from 'src/components/Modal'

import './index.css'

interface DialogProps {
  size?: 'small' | 'medium' | 'big'
  l10nId: string
  placeholder?: string
  className?: string
  onClose: () => void
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnBgClick?: boolean
  closeOnEsc?: boolean
  [localizationProps: string]: any
}

class Dialog extends React.Component<DialogProps> {
  modal: Modal | null = null

  private setModal = (el: Modal | null) => el && (this.modal = el)

  private renderModal = () => {
    const {
      size,
      l10nId,
      placeholder = "...",
      className,
      onClose,
      children,
      showCloseButton,
      closeOnBgClick,
      closeOnEsc,
      ...args
    } = this.props

    return (
      <div
        className={
          `dialog__content dialog__content--${size ? size : 'small'} ${className ? className : ''}`
        }
      >
        <h2 className="dialog__title">
          <Localized id={l10nId} {...args}>
            {placeholder}
          </Localized>
        </h2>
        {children}
      </div>
    )
  }

  componentDidMount() {
    this.modal!.open()
  }

  public render() {
    const { onClose, showCloseButton = true, closeOnBgClick, closeOnEsc } = this.props
    return (
      <Modal
        ref={this.setModal}
        content={this.renderModal}
        onClose={onClose}
        showCloseButton={showCloseButton}
        closeOnBgClick={closeOnBgClick}
        closeOnEsc={closeOnEsc}
      />
    )
  }
}

export default Dialog
