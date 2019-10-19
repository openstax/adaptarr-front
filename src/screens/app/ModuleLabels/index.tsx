import * as React from 'react'

import Section from 'src/components/Section'
import Header from 'src/components/Header'

import ModuleLabelsEditor from 'src/containers/ModuleLabelsEditor'

import './index.css'

const ModuleLabelsScreen = () => (
  <Section className="module-labels-screen">
    <Header l10nId="module-labels-screen-title" title="Manage labels" />
    <div className="section__content">
      <ModuleLabelsEditor />
    </div>
  </Section>
)

export default ModuleLabelsScreen
