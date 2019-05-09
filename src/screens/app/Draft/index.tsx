import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Localized } from 'fluent-react/compat'
import Editor, { PersistDB, DocumentDB } from 'cnx-designer'
import { match } from 'react-router'
import { Value } from 'slate'

import store from 'src/store'
import * as api from 'src/api'
import { fetchReferenceTargets } from 'src/store/actions/Modules'

import Load from 'src/components/Load'
import Section from 'src/components/Section'
import InfoBox from 'src/components/InfoBox'
import Header from 'src/components/Header'
import Title from './components/Title'
import StyleSwitcher from './components/StyleSwitcher'
import StepChanger from './components/StepChanger'

import './index.css'
import UIPlugin from './plugins/UI'
import I10nPlugin from './plugins/I10n'
import XrefPlugin, { collectForeignDocuments } from './plugins/Xref'
import TablesPlugin from './plugins/Tables'

type Props = {
  documentDb: DocumentDB
  storage: api.Storage
  value: Value
  draft: api.Draft
}

async function loader({ match: { params: { id } } }: { match: match<{ id: string }> }) {
  const [documentDb, storage, draft] = await Promise.all([
    PersistDB.load(id),
    api.Storage.load(id),
    api.Draft.load(id),
  ])

  let value

  if (documentDb.dirty) {
    value = await documentDb.restore()
  } else {
    value = await storage.read()
    // TODO: get version from API
    await documentDb.save(value, Date.now().toString())
  }

  const { modules: { modulesMap } } = store.getState()

  for (const document of collectForeignDocuments(value)) {
    const module = modulesMap.get(document)

    if (!module) {
      console.warn('Document contains reference to a non-existent external document', document)
    }

    store.dispatch(fetchReferenceTargets(module))
  }

  return { documentDb, storage, value, draft }
}

class Draft extends React.Component<Props> {
  state: {
    editorStyle: string
    showInfoBox: boolean
  } = {
    editorStyle: '',
    showInfoBox: false,
  }

  prePlugins = [I10nPlugin, XrefPlugin, TablesPlugin]
  postPlugins = [UIPlugin]

  static childContextTypes = {
    documentDb: PropTypes.instanceOf(DocumentDB),
  }

  private handleStyleChange = (style: string) => {
    this.setState({ editorStyle: style, showInfoBox: true })
  }

  private hideInfoBox = () => {
    this.setState({ showInfoBox: false })
  }

  getChildContext() {
    return {
      documentDb: this.props.documentDb,
    }
  }

  public render() {
    const { documentDb, storage, value, draft } = this.props
    const { editorStyle, showInfoBox } = this.state

    return (
      <Section>
        <Header l10nId="draft-title" title="Draft">
          <StepChanger draft={draft} />
        </Header>
        <div className="section__content draft">
          <div className={`draft__editor ${editorStyle}`}>
            <div className="document">
              <StyleSwitcher onChange={this.handleStyleChange} />
              {
                showInfoBox ?
                  <InfoBox onClose={this.hideInfoBox}>
                    <Localized id="draft-style-switcher-info-box">
                      This is experimental feature. There are visual differences between preview and original styles.
                    </Localized>
                  </InfoBox>
                : null
              }
              <Title draft={draft} />
              <Editor
                documentDb={documentDb}
                storage={storage}
                value={value}
                prePlugins={this.prePlugins}
                postPlugins={this.postPlugins}
              />
            </div>
          </div>
        </div>
      </Section>
    )
  }
}

export default Load(loader, [], 'draft-loading-message')(Draft)
