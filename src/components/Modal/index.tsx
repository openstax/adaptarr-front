import * as React from 'react'
import { Portal } from 'react-portal'

import './index.css'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

export type Props = {
  target?: string,
  content?: () => React.ReactNode,
  onClose?: () => void,
}

export default class Modal extends React.Component<Props> {
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

  render() {
    if (!this.state.open) return null

    const { content, children, target } = this.props
    const c = content ? content() : children

    return (
      <Portal node={document.getElementById(target || 'modal-root')}>
        <div
          className="modal"
          tabIndex={0}
          onClick={this.onClick}
          onKeyDown={this.onKeyDown}
          ref={el => el && (this.back = el)}
        >
          <Button
            className="modal__close"
            clickHandler={this.onClose}
          >
            <Icon name="close" />
          </Button>
          <div className="modal__content">
            {c}
          </div>
        </div>
      </Portal>
    )
  }

  onClick = (ev: React.MouseEvent) => {
    if (ev.target === this.back) {
      this.onClose()
    }
  }

  onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Escape') {
      this.onClose()
    }
  }

  private onClose = () => {
    this.close()

    const { onClose } = this.props
    if (onClose) onClose()
  }
}
