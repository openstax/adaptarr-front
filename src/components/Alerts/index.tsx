import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { Alert, AlertInfo } from 'src/store/types'
import { State } from 'src/store/reducers'
import { removeAlert } from 'src/store/actions/alerts'

import Notification from 'src/components/Notification'
import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
  alerts: Alert[]
}

const mapStateToProps = ({ alerts: { alerts } }: State) => {
  return {
    alerts,
  }
}

class Alerts extends React.Component<Props> {
  private removeAlert = (alert: Alert) => {
    store.dispatch(removeAlert(alert))
  }

  public render() {
    const { alerts } = this.props
    let renderedAlerts: Alert[] = []
    let renderedErrorAlerts: AlertInfo[] = []

    for (const alert of alerts) {
      if (alert.kind === 'alert' && alert.data.kind === 'error') {
        renderedErrorAlerts.push(alert)
      } else {
        renderedAlerts.push(alert)
      }
    }

    return (
      <>
        <div className="alerts">
          {
            renderedAlerts.length > 0 ?
              <ul className="alerts__list">
                {
                  renderedAlerts.map(alert => {

                    switch(alert.kind) {
                      case 'alert':
                        // Error alerts are displayed separately.
                        //if (alert.data.kind === 'error') return null
                        return (
                          <li
                            key={alert.id}
                            className={`alerts__alert alert--${alert.data.kind}`}
                            onClick={() => this.removeAlert(alert)}
                          >
                            <Localized id={alert.data.message} {...alert.data.arguments}>
                              Unknow alert
                            </Localized>
                          </li>
                        )
                      case 'notification':
                        return (
                          <li
                            key={alert.id}
                            className="alerts__alert alert--notification"
                            onClick={() => this.removeAlert(alert)}
                          >
                            <Notification
                              notification={alert.data}
                            />
                          </li>
                        )
                    }
                  })
                }
              </ul>
            : null
          }
        </div>
        <div className="alerts--error">
          <ul className="alerts__list">
            {
              renderedErrorAlerts.map(alert => {
                return (
                    <li
                      key={alert.id}
                      className={`alerts__alert alert--error`}
                    >
                      <Localized id={alert.data.message} {...alert.data.arguments}>
                        Something went wrong.
                      </Localized>
                      <span
                        className="alert__close"
                        onClick={() => this.removeAlert(alert)}
                      >
                        <Icon size="small" name="close" />
                      </span>
                    </li>
                  )
              })
            }
          </ul>
        </div>
      </>
    )
  }
}

export default connect(mapStateToProps)(Alerts)