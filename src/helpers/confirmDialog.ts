import store from 'src/store'
import { showConfirmDialog, closeConfirmDialog, ConfirmDialogOptions } from 'src/store/actions/app'

const confirmDialog = async (options: ConfirmDialogOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    store.dispatch(showConfirmDialog({
      ...options,
      callback: (key: string) => {
        if (key !== 'close' && (!options.buttons || !options.buttons[key])) {
          reject(`Couldn't find button with key: ${key}`)
          store.dispatch(closeConfirmDialog())
        }
        resolve(key)
        store.dispatch(closeConfirmDialog())
      },
    }))
  })
}

export default confirmDialog