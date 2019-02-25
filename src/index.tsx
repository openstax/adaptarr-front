import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import LocalizationProvider from 'src/i18n'

import App from 'src/App'
import registerServiceWorker from 'src/registerServiceWorker'

import store from 'src/store'

ReactDOM.render(
  <Provider store={store}>
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
