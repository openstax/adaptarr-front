import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import './index.css'

interface SpinnerProps {
  l10nId?: string | undefined
}

const Spinner = ({ l10nId }: SpinnerProps) => (
  <div className="spinner-holder">
    {
      l10nId ?
        <div className="spinner__message">
          <Localized id={l10nId}>
              ...
          </Localized>
        </div>
        : null
    }
    <div className="spinner" />
  </div>
)

export default Spinner
