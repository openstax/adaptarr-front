import * as React from 'react'
import * as PropTypes from 'prop-types'
import Editor, { PersistDB, DocumentDB } from 'cnx-designer'
import { match } from 'react-router'
import { Value } from 'slate'

import * as api from 'src/api'
import i18n from 'src/i18n'

import { addAlert } from 'src/store/actions/Alerts'
import store from 'src/store'

import Load from 'src/components/Load'
import Section from 'src/components/Section'
import Input from 'src/components/ui/Input'

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

class Draft extends React.Component<Props> {
  state: {
    titleInput: string
  } = {
    titleInput: '',
  }

  postPlugins = [UIPlugin]

  static childContextTypes = {
    documentDb: PropTypes.instanceOf(DocumentDB),
  }

  getChildContext() {
    return {
      documentDb: this.props.documentDb,
    }
  }

  private updateTitleInput = (val: string) => {
    this.setState({ titleInput: val })
  }

  private changeTitle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const draft = await api.Draft.load(this.props.storage.id)
      await draft.updateTitle(this.state.titleInput)
      store.dispatch(addAlert('success', i18n.t('Draft.title.save.success')))
    } catch (e) {
      store.dispatch(addAlert('error', i18n.t('Draft.title.save.error')))
      console.error(e)
    }
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.storage.title !== this.props.storage.title) {
      this.setState({ titleInput: this.props.storage.title })
    }
  }

  componentDidMount = () => {
    this.setState({ titleInput: this.props.storage.title })
  }

  public render() {
    const { documentDb, storage, value } = this.props
    const { titleInput } = this.state

    return (
      <Section>
        <div className="section__content draft">
          <div className="draft__editor">
            <div className="document">
              <form onSubmit={this.changeTitle}>
                <span className="draft__title">
                  <Input
                    value={titleInput}
                    placeholder={i18n.t('Draft.title.placeholder')}
                    onChange={this.updateTitleInput}
                  />
                </span>
              </form>
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
