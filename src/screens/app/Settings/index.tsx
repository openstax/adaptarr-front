import * as React from 'react'

import Header from 'src/components/Header'

const settings = (props: any) => {
  return (
    <section className="section--wrapper">
      <Header i18nKey="Settings.title" />
      <div className="section__content">
        Settings
      </div>
    </section>
  )
}

export default settings
