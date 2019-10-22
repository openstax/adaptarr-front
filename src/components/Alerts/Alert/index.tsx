import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { Alert } from 'src/store/types'

import Notification from 'src/components/Notification'
import Icon from 'src/components/ui/Icon'

interface AlertProps {
  alert: Alert
  onClick: (alert: Alert) => void
}

const _Alert = (props: AlertProps) => {
  const { alert } = props

  const onClick = () => {
    props.onClick(props.alert)
  }

  let body: JSX.Element
  switch (alert.kind) {
  case 'alert':
    if (alert.data.kind === 'error') {
      body =
            <>
              <Localized id={alert.data.message} {...alert.data.arguments}>
                Something went wrong.
              </Localized>
              <span className="alert__close">
                <Icon size="small" name="close" />
              </span>
            </>

      break
    }

    body =
          <Localized id={alert.data.message} {...alert.data.arguments}>
            Unknow alert
          </Localized>

    break

  case 'notification':
    body =
          <Notification
            notification={alert.data}
          />

    break

  default:
    return null
  }

  return (
    <li
      className={`alerts__alert alert--${alert.data.kind}`}
      onClick={onClick}
    >
      {body}
    </li>
  )
}

export default _Alert
