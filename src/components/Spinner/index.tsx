import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

type Props = {
  l10nId?: string | undefined
}

const spinner = ({ l10nId }: Props) => {
  return (
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
      <div className="spinner"></div>
    </div>
  )
}

export default spinner
