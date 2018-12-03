import * as React from 'react'

import Section from '../../../components/Section'
import Header from '../../../components/Header'

const notificationsCentre = (props: any) => {
  return (
    <div className="container container--splitted">
      <Section>
        <Header title={"Notifications"} />
        <div className="section__content">
          Notifications Centre
        </div>
      </Section>
      <Section>
        <Header title={"Jason Cook"}>
          <span className="conversation__info">Conversation started: Nov 8</span>
        </Header>
        <div className="section__content">
          Conversation
        </div>
      </Section>
    </div>
  )
}

export default notificationsCentre
