import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Provider } from 'react-redux'

import LocalizationProvider from 'src/l10n'

import App from 'src/App'
import registerServiceWorker from 'src/registerServiceWorker'
import ErrorBoundary from 'src/components/ErrorBoundary'
import { SENTRY_DSN, SENTRY_RELEASE } from 'src/config/sentry'

import store from 'src/store'

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: SENTRY_RELEASE,
    environment: process.env.NODE_ENV,
  })
}

ReactDOM.render(
  <Provider store={store}>
    <LocalizationProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </LocalizationProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
