import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Provider } from 'react-redux'

import LocalizationProvider from 'src/l10n'

import App from 'src/App'
import { unregister } from 'src/registerServiceWorker'
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

// Temporarily disable Adaptarr on Safari, Edge and Internet Explorer due to:
// https://github.com/openstax-poland/adaptarr-front/issues/197
// eslint-disable-next-line spaced-comment
const isIE = /*@cc_on!@*/false || Boolean((document as any).documentMode)
const isEdge = /Edge/.test(navigator.userAgent)
const isSafari = (window as any).safari !== undefined
if (isSafari || isEdge || isIE) {
  ReactDOM.render(
    <BrowsersNotSupported />,
    document.getElementById('root') as HTMLElement
  )
} else {
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
}

unregister()

function BrowsersNotSupported() {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontSize: '20px',
    fontWeight: 700,
  }

  return (
    <div style={style}>
      We currently provide full support only for Firefox and Chrome browsers.
    </div>
  )
}
