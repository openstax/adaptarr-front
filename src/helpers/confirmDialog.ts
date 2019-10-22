import store from 'src/store'
import { closeConfirmDialog, ConfirmDialogOptions, showConfirmDialog } from 'src/store/actions/app'

const confirmDialog = (
  options: ConfirmDialogOptions
): Promise<string> => new Promise((resolve, reject) => {
  store.dispatch(showConfirmDialog({
    ...options,
    callback: (key: string) => {
      if (key !== 'close' && (!options.buttons || !options.buttons[key])) {
        reject(new Error(`Couldn't find button with key: ${key}`))
        store.dispatch(closeConfirmDialog())
      }
      resolve(key)
      store.dispatch(closeConfirmDialog())
    },
  }))
})

export default confirmDialog
