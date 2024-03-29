import * as React from 'react'
import { Portal } from 'react-portal'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

interface ModalProps {
  target?: string,
  overflowAuto?: boolean,
  showCloseButton?: boolean,
  closeOnBgClick?: boolean,
  closeOnEsc?: boolean,
  content?: () => React.ReactNode,
  onClose?: () => void,
}

class Modal extends React.Component<ModalProps> {
  state: {
    open: boolean,
  } = {
    open: false,
  }

  back: HTMLElement | null = null

  /**
   * Open this modal.
   */
  open() {
    this.setState({ open: true })
  }

  /**
   * Close this modal.
   */
  close() {
    this.setState({ open: false })
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  setRef = (el: HTMLDivElement | null) => el && (this.back = el)

  render() {
    if (!this.state.open) return null

    const { content, children, target, overflowAuto = false, showCloseButton = true } = this.props
    const c = content ? content() : children

    return (
      <Portal node={document.getElementById(target || 'modal-root')}>
        <div
          className="modal"
          tabIndex={0}
          onClick={this.onClick}
          ref={this.setRef}
        >
          <div className={`modal__content ${overflowAuto ? 'overflow-auto' : ''}`}>
            {
              showCloseButton ?
                <Button
                  className="modal__close"
                  clickHandler={this.onClose}
                >
                  <Icon name="close" />
                </Button>
                : null
            }
            {c}
          </div>
        </div>
      </Portal>
    )
  }

  onClick = (ev: React.MouseEvent) => {
    const { closeOnBgClick = true } = this.props

    if (ev.target === this.back && closeOnBgClick) {
      this.onClose()
    }
  }

  onKeyDown = (ev: Event) => {
    const { closeOnEsc = true } = this.props

    if ((ev as KeyboardEvent).key === 'Escape' && closeOnEsc) {
      this.onClose()
    }
  }

  private onClose = () => {
    this.close()

    const { onClose } = this.props
    if (onClose) onClose()
  }
}

export default Modal
