import * as React from 'react'
import { Trans } from 'react-i18next'

type Props = {
  i18nKey?: string
  title?: string
  children?: any
}

const header = (props: Props) => {
  return (
    <div className="header">
      <h2 className="header__title">
        {
          props.i18nKey ?
            <Trans i18nKey={props.i18nKey}/>
          :
            props.title
        }
      </h2>
      {props.children}
    </div>
  )
}

export default header
