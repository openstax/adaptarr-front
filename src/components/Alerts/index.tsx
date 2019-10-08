import * as React from 'react'
import { connect } from 'react-redux'

import store from 'src/store'
import { Alert, AlertInfo } from 'src/store/types'
import { State } from 'src/store/reducers'
import { removeAlert } from 'src/store/actions/alerts'

import AlertComp from './Alert'

import './index.css'

interface AlertsProps {
  alerts: Alert[]
}

const mapStateToProps = ({ alerts: { alerts } }: State) => ({
  alerts,
})

class Alerts extends React.Component<AlertsProps> {
  private removeAlert = (alert: Alert) => {
    store.dispatch(removeAlert(alert))
  }

  public render() {
    const { alerts } = this.props
    const renderedAlerts: Alert[] = []
    const renderedErrorAlerts: AlertInfo[] = []

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
                  renderedAlerts.map(
                    alert => <AlertComp key={alert.id} alert={alert} onClick={this.removeAlert} />
                  )
                }
              </ul>
              : null
          }
        </div>
        <div className="alerts--error">
          <ul className="alerts__list">
            {
              renderedErrorAlerts.map(
                alert => <AlertComp key={alert.id} alert={alert} onClick={this.removeAlert} />
              )
            }
          </ul>
        </div>
      </>
    )
  }
}

export default connect(mapStateToProps)(Alerts)
