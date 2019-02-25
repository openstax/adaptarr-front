import * as React from 'react'

import Header from 'src/components/Header'

const resources = (props: any) => {
  return (
    <section className="section--wrapper">
      <Header l10nId="resources-view-title" title="Resources" />
      <div className="section__content">
        Resources
      </div>
    </section>
  )
}

export default resources
