import * as React from 'react'
import * as PropTypes from 'prop-types'
import Editor, { PersistDB, DocumentDB } from 'cnx-designer'
import { match } from 'react-router'
import { Value } from 'slate'

import store from 'src/store'
import * as api from 'src/api'
import { fetchReferenceTargets } from 'src/store/actions/Modules'

import Load from 'src/components/Load'

import './index.css'
import UIPlugin from './plugins/UI'
import XrefPlugin, { collectForeignDocuments } from './plugins/Xref'

type Props = {
  documentDb: DocumentDB
  storage: api.Storage
  value: Value
}

async function loader({ match: { params: { id } } }: { match: match<{ id: string }> }) {
  const [documentDb, storage] = await Promise.all([
    PersistDB.load(id),
    api.Storage.load(id),
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

  return { documentDb, storage, value }
}

class Module extends React.Component<Props> {
  prePlugins = [XrefPlugin]
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
    const { documentDb, storage, value } = this.props

    return (
      <div className="draft">
        <Editor
          documentDb={documentDb}
          storage={storage}
          value={value}
          prePlugins={this.prePlugins}
          postPlugins={this.postPlugins}
          />
      </div>
    )
  }
}

export default Load(loader)(Module)
