import * as React from 'react'
import * as PropTypes from 'prop-types'
import Editor, { PersistDB, DocumentDB } from 'cnx-designer'
import { match } from 'react-router'
import { Value } from 'slate'

import * as api from 'src/api'

import Load from 'src/components/Load'
import Section from 'src/components/Section'
import Title from './components/Title'

import './index.css'
import UIPlugin from './plugins/UI'

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

  return { documentDb, storage, value, draft }
}

class Draft extends React.Component<Props> {
  postPlugins = [UIPlugin]

  static childContextTypes = {
    documentDb: PropTypes.instanceOf(DocumentDB),
  }

  getChildContext() {
    return {
      documentDb: this.props.documentDb,
    }
  }

  public render() {
    const { documentDb, storage, value, draft } = this.props

    return (
      <Section>
        <div className="section__content draft">
          <div className="draft__editor">
            <div className="document">
              <Title draft={draft}/>
              <Editor
                documentDb={documentDb}
                storage={storage}
                value={value}
                postPlugins={this.postPlugins}
              />
            </div>
          </div>
        </div>
      </Section>
    )
  }
}

export default Load(loader)(Draft)
