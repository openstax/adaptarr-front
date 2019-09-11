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

  const {
    title,
    content,
    buttons,
    buttonsPosition = 'default',
    showCloseButton = true,
    closeOnBgClick = true,
    closeOnEsc = true,
    callback = (key: string) => console.warn(`Resolved with: ${key}. You did not provide callback for button click.`),
    ...localizationProps
  } = options

  return (
    <Dialog
      size="medium"
      l10nId={title}
      placeholder="Confirm action"
      onClose={() => callback('close')}
      showCloseButton={showCloseButton}
      closeOnBgClick={closeOnBgClick}
      closeOnEsc={closeOnEsc}
      {...localizationProps}
    >
      {
        content ?
          typeof content === 'string' ?
            <div className="confirm-dialog__content">
              <Localized id={content}>
                {content}
              </Localized>
            </div>
          : content
        : null
      }
      {
        buttons ?
          <div className={`dialog__buttons dialog__buttons--${buttonsPosition}`}>
            {
              Object.entries(buttons).map(([key, val]: [string, string | typeof Button], i) => (
                <Button key={key+i} clickHandler={() => callback(key)}>
                  {
                    typeof val === 'string' ?
                      <Localized id={val}>
                        {val}
                      </Localized>
                    : val
                  }
                </Button>
              ))
            }
          </div>
        : null
      }
    </Dialog>
  )
}

export default connect(mapStateToProps)(ConfirmDialog)