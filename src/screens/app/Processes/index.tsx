import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Header from 'src/components/Header'

type Props = {

}

class Processes extends React.Component<Props> {
  public render() {
    return (
      <section className="section--wrapper">
        <Header l10nId="processes-view-title" title="Manage processes" />
        <div className="section__content processes">
          Processes
        </div>
      </section>
    )
  }
}

export default Processes
