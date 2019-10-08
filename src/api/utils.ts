/**
 * Perform an API action which requires elevated permissions.
 *
 * This function will first attempt to execute {@param action} as is, to see
 * whether session elevation is required. If actions fails with code
 * 403 (Forbidden) user will be asked to authenticate and, if successful,
 * action will be attempted again. Neither authentication nor second action
 * failures will be handled.
 */
export async function elevated<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action()
  } catch (err) {
    if (err.response && err.response.status === 403) {
      await elevate()
      return action()
    }
    throw err
  }
}

/**
 * Elevate current session.
 *
 * This function will display an authentication window and return a promise that
 * will resolve once user has authenticated, and reject should user cancel
 * authentication.
 */
export function elevate(): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `${location.origin}/elevate?action=message`
    const left = (screen.width / 2) - 210
    const top = (screen.height / 2) - 340
    const config = `width=420,height=680,left=${left},top=${top}`
    window.open(url, '', config)

    function handler(ev: MessageEvent) {
      if (ev.origin !== location.origin) {
        return
      }

      if (ev.data === 'closed') {
        reject(new Error('Window closed'))
      } else if (ev.data.authorized) {
        resolve()
      } else {
        return
      }

      ev.preventDefault()
      window.removeEventListener('message', handler)
    }

    window.addEventListener('message', handler)
  })
}
