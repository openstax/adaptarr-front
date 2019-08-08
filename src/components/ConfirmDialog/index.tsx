import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import { ConfirmDialogOptions } from 'src/store/actions/app'
import { State } from 'src/store/reducers/index'

import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import './index.css'

const mapStateToProps = ({ app: { showConfirmDialog, confirmDialogOptions} }: State) => {
  return {
    show: showConfirmDialog,
    options: confirmDialogOptions,
  }
}

const ConfirmDialog = ({ options, show }: { options: ConfirmDialogOptions, show: boolean }) => {
  if (!show) return null

  return (
    <Dialog
      size="medium"
      l10nId={options.title}
      placeholder="Confirm action"
      onClose={() => false}
      showCloseButton={false}
      closeOnBgClick={false}
      closeOnEsc={false}
    >
      {
        options.content ?
          <div className="confirm-dialog__content">
            <Localized id={options.content}>
              {options.content}
            </Localized>
          </div>
        : null
      }
      <div className="dialog__buttons">
        {
          Object.entries(options.buttons).map(([key, val], i) => (
            <Button key={key+i} clickHandler={() => options.callback(key)}>
              <Localized id={val}>
                {val}
              </Localized>
            </Button>
          ))
        }
      </div>
    </Dialog>
  )
}

export default connect(mapStateToProps)(ConfirmDialog)