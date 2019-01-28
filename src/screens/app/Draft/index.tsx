import * as React from 'react'
import * as PropTypes from 'prop-types'
import Editor, { PersistDB, DocumentDB } from 'cnx-designer'
import { match } from 'react-router'
import { Value } from 'slate'
import { connect } from 'react-redux'

import * as api from 'src/api'

import Load from 'src/components/Load'
import Section from 'src/components/Section'

import './index.css'
import UIPlugin from './plugins/UI'

import { State } from 'src/store/reducers'
import { ModulesMap } from 'src/store/types'

type Props = {
  documentDb: DocumentDB
  storage: api.Storage
  value: Value
  modules: {
    modulesMap: ModulesMap
  }
}

const mapStateToProps = ({ modules }: State) => {
  return {
    modules,
  }
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
    const { documentDb, storage, value, modules } = this.props

    return (
      <Section>
        <div className="section__content draft">
          <div className="draft__editor">
            <div className="document">
              <h2 className="draft__title">
                {
                  modules.modulesMap.get(storage.id) ?
                    modules.modulesMap.get(storage.id)!.title
                  : 'Unknow Title'
                }
              </h2>
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

export default connect(mapStateToProps)(Load(loader)(Draft))
