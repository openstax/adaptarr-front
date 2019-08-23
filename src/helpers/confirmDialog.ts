import store from 'src/store'
import { showConfirmDialog, closeConfirmDialog } from 'src/store/actions/app'

const DEFUALT_BUTTONS = {
  cancel: 'confirm-dialog-button-cancel',
  ok: 'confirm-dialog-button-ok',
}

const confirmDialog = async (title: string, content: string = '', buttons: {[key: string]: string} = DEFUALT_BUTTONS): Promise<string> => {
  return new Promise((resolve, reject) => {
    store.dispatch(showConfirmDialog(title, content, buttons, (key: string) => {
      if (!buttons[key]) {
        reject(`Couldn't find button with key: ${key}`)
        store.dispatch(closeConfirmDialog())
      }
      resolve(key)
      store.dispatch(closeConfirmDialog())
    }))
  })
}

export default confirmDialog