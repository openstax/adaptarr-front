import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { LocalizationProvider } from 'fluent-react/compat';

import { generateBundles } from 'src/i18n'

import App from 'src/App'
import registerServiceWorker from 'src/registerServiceWorker'

import store from 'src/store'

ReactDOM.render(
  <LocalizationProvider bundles={generateBundles(navigator.languages)}>
    <Provider store={store}>
      <App />
    </Provider>
  </LocalizationProvider>,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
