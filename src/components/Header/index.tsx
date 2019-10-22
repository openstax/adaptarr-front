import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import './index.css'

interface HeaderProps {
  l10nId?: string
  title?: string
  children?: any
  fixed?: boolean
  [localizationProps: string]: any
}

const Header = ({ l10nId, title, children, fixed, ...args }: HeaderProps) => (
  <div className={`header ${fixed ? 'fixed' : ''}`}>
    {
      l10nId && title ?
        <h2 className="header__title">
          <Localized id={l10nId} $title={title} {...args}>
            {title}
          </Localized>
        </h2>
        : null
    }
    {children}
  </div>
)

export default Header
