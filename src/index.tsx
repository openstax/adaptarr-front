import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
 
import i18n from 'src/i18n'

import App from 'src/App'
import registerServiceWorker from 'src/registerServiceWorker'

import store from 'src/store'

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <App />
    </Provider>
  </I18nextProvider>,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
