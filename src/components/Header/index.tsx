import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

type Props = {
  l10nId: string
  title: string
  children?: any
  fixed?: boolean
  [localizationProps: string]: any
}

const header = ({ l10nId, title, children, fixed, ...args }: Props) => {
  return (
    <div className={`header ${fixed ? 'fixed' : ''}`}>
      <h2 className="header__title">
        <Localized id={l10nId} $title={title} {...args}>
          {title}
        </Localized>
      </h2>
      {children}
    </div>
  )
}

export default header
