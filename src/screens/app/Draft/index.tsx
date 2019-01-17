import * as React from 'react'
import Editor, { PersistDB, DocumentDB } from 'cnx-designer'
import { match } from 'react-router'
import { Value } from 'slate'

import * as api from 'src/api'

import Load from 'src/components/Load'

import './index.css'
import UIPlugin from './plugins/UI'

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

  return { documentDb, storage, value }
}

class Module extends React.Component<Props> {
  postPlugins = [UIPlugin]

  private saveDraft = () => {
    const { draft } = this.props

    draft!.save()
      .then(() => {
        store.dispatch(addAlert('success', i18n.t("Draft.saveSuccess")))
        this.props.history.push(`/modules/${draft!.module}`)
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  public render() {
    const { documentDb, storage, value } = this.props

    return (
      <div className="draft">
        <Editor
          documentDb={documentDb}
          storage={storage}
          value={value}
          postPlugins={this.postPlugins}
          />
      </div>
    )
  }
}

export default Load(loader)(Module)
