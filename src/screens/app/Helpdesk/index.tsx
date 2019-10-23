import * as React from 'react'

import Header from 'src/components/Header'
import Section from 'src/components/Section'
import HelpdeskTools from './components/HelpdeskTools'

import Tickets from 'src/containers/Tickets'

import './index.css'

const Helpdesk = () => (
  <div className="container container--splitted helpdesk">
    <Section>
      <Header l10nId="helpdesk-view-title" title="Helpdesk" />
      <div className="section__content">
        <HelpdeskTools />
      </div>
    </Section>
    <Section>
      <Header l10nId="helpdesk-view-tickets-title" title="Tickets manager" />
      <Tickets />
    </Section>
  </div>
)

export default Helpdesk
