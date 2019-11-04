import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { DocumentDB, PersistDB, uuid } from 'cnx-designer'
import { match } from 'react-router'
import { History } from 'history'
import { Block, KeyUtils, Value } from 'slate'
import { connect } from 'react-redux'

import * as api from 'src/api'
import { SlotPermission } from 'src/api/process'

import store from 'src/store'
import { State } from 'src/store/reducers'
import { fetchReferenceTargets } from 'src/store/actions/modules'
import { setCurrentDraftLang, setCurrentDraftPermissions } from 'src/store/actions/drafts'

import { confirmDialog, timeout } from 'src/helpers'

import Load from 'src/components/Load'
import Section from 'src/components/Section'
import InfoBox from 'src/components/InfoBox'
import Header from 'src/components/Header'
import DraftInfo from 'src/components/DraftInfo'
import Title from './components/Title'
import StyleSwitcher from './components/StyleSwitcher'
import StepChanger from './components/StepChanger'
import SaveButton from './components/SaveButton'
import EditorsErrorBoundary from './components/EditorsErrorBoundary'

import { collectForeignDocuments } from './plugins/Xref'

import PersistanceError from './PersistanceError'

import EditorDocument from './editors/document'
import EditorGlossary from './editors/glossary'

import './index.css'

interface DraftProps {
  documentDbContent: DocumentDB
  documentDbGlossary: DocumentDB
  storage: api.Storage
  draft: api.Draft
  document: Value
  glossary: Value
  history: History
  currentDraftLang: string
}

KeyUtils.resetGenerator()
KeyUtils.setGenerator(() => uuid.v4())

async function loader(
  { match: { params: { id } } }: { match: match<{ id: string }>,
  history: History }
) {
  const [[documentDbContent, documentDbGlossary], storage, draft] = await Promise.all([
    Promise.race([
      Promise.all([
        PersistDB.load(`${id}-document`),
        PersistDB.load(`${id}-glossary`),
      ]).catch(() => {
        throw new PersistanceError()
      }),
      timeout(10000),
    ]) as unknown as DocumentDB[],
    api.Storage.load(id),
    api.Draft.load(id),
  ])

  const draftPermissions = draft.permissions || []
  const readOnly = draftPermissions.length === 0 || draftPermissions.every(p => p === 'view')

  if (readOnly) {
    history.replaceState(undefined, '', `/drafts/${id}/view`)
  }

  const index = await storage.read()
  const dirty = !readOnly && (documentDbContent.dirty || documentDbGlossary.dirty)
  let { document, glossary, language: draftLang } = index.deserialize()

  // XXX: Some users might have local changes saved with the old temporary
  // versioning scheme. Remove check for
  // `!(documentDbContent.version || '').match(/^\d+$/)` after a few weeks once
  // all users should have migrated to the new version.
  if (
    dirty &&
    !(documentDbContent.version || '').match(/^\d+$/) &&
    index.version !== documentDbContent.version
  ) {
    const res = await confirmDialog({
      title: 'draft-load-incorrect-version-title',
      content: 'draft-load-incorrect-version-info',
      buttons: {
        discard: 'draft-load-incorrect-version-button-discard',
        keepWorking: 'draft-load-incorrect-version-button-keep-working',
      },
      showCloseButton: false,
      closeOnBgClick: false,
      closeOnEsc: false,
    })

    switch (res) {
    case 'discard': {
      if (documentDbContent.dirty) {
        await Promise.all([documentDbContent.discard(), documentDbGlossary.discard()])
      }
      break
    }
    case 'keepWorking':
      // Local changes will be loaded.
      storage.tag = documentDbContent.version!
      index.version = documentDbContent.version!
      break
    default:
      throw new Error(
        `Unknown action: "${res}" while trying to handle loading of incorrect version of document.`
      )
    }
  }

  if (storage.language !== draftLang) {
    storage.setLanguage(draftLang)
  }

  if (!readOnly) {
    if (documentDbContent.dirty) {
      document = await documentDbContent.restore()
    } else {
      await documentDbContent.save(document, index.version)
    }

    if (documentDbGlossary.dirty) {
      glossary = await documentDbGlossary.restore()
    } else {
      // Reset glossary if it have invalid content
      if ((glossary.document.nodes.get(0) as Block).type !== 'definition') {
        glossary = Value.fromJS({
          object: 'value',
          document: {
            object: 'document',
            nodes: [],
          },
        })
      }
      await documentDbGlossary.save(glossary, index.version)
    }
  }

  const { modules: { modulesMap } } = store.getState()

  for (const doc of collectForeignDocuments(document)) {
    const module = modulesMap.get(doc)

    if (!module) {
      console.warn('Document contains reference to a non-existent external document', doc)
    }

    store.dispatch(fetchReferenceTargets(module))
  }

  return { documentDbContent, documentDbGlossary, storage, document, glossary, draft }
}

const mapStateToProps = ({ draft: { currentDraftLang } }: State) => ({
  currentDraftLang,
})

interface DraftState {
  editorStyle: string
  showInfoBox: boolean
  valueDocument: Value
  valueGlossary: Value
  isGlossaryEmpty: boolean
}

class Draft extends React.Component<DraftProps> {
  state: DraftState = {
    editorStyle: '',
    showInfoBox: false,
    valueDocument: this.props.document,
    valueGlossary: this.props.glossary,
    isGlossaryEmpty: !this.props.glossary.document.nodes.has(0) ||
      (this.props.glossary.document.nodes.get(0) as Block).type !== 'definition',
  }

  draftPermissions = new Set(this.props.draft.permissions || [])

  stepPermissions = this.props.draft.step!.slots.reduce((acc, slot) => {
    acc = new Set([...acc, ...slot.permissions])
    return acc
  }, new Set<SlotPermission>())

  private handleStyleChange = (style: string) => {
    this.setState({ editorStyle: style, showInfoBox: true })
  }

  private hideInfoBox = () => {
    this.setState({ showInfoBox: false })
  }

  private handleStepChange = () => {
    this.props.history.push('/')
  }

  onChangeDocument = (value: Value) => {
    this.setState({ valueDocument: value })
  }

  onChangeGlossary = (value: Value) => {
    const isGlossaryEmpty = !value.document.nodes.has(0) ||
      (value.document.nodes.get(0) as Block).type !== 'definition'
    this.setState({ valueGlossary: value, isGlossaryEmpty })
  }

  componentDidMount() {
    store.dispatch(setCurrentDraftLang(this.props.storage.language))
    store.dispatch(setCurrentDraftPermissions(Array.from(this.draftPermissions)))
  }

  componentWillUnmount() {
    store.dispatch(setCurrentDraftPermissions([]))
  }

  public render() {
    const { documentDbContent, documentDbGlossary, storage, draft, currentDraftLang } = this.props
    const { valueDocument, valueGlossary, isGlossaryEmpty, editorStyle, showInfoBox } = this.state
    const permissions = draft.permissions || []
    const readOnly = permissions.length === 0 || permissions.every(p => p === 'view')

    const editorLanguage = currentDraftLang || 'en'

    return (
      <Section>
        <Header fixed={true}>
          <DraftInfo draft={draft} />
          <StepChanger
            draft={draft}
            onStepChange={this.handleStepChange}
            document={valueDocument}
            glossary={valueGlossary}
            storage={storage}
            documentDbContent={documentDbContent}
            documentDbGlossary={documentDbGlossary}
          />
          <div className="draft__controls">
            <StyleSwitcher onChange={this.handleStyleChange} />
            {
              !readOnly ?
                <SaveButton
                  document={valueDocument}
                  glossary={valueGlossary}
                  isGlossaryEmpty={isGlossaryEmpty}
                  storage={storage}
                  documentDbContent={documentDbContent}
                  documentDbGlossary={documentDbGlossary}
                />
                : null
            }
          </div>
        </Header>
        <div className="section__content draft">
          <div className={`draft__editor ${editorStyle}`}>
            <div className={`document ${readOnly ? 'document--readonly' : ''}`}>
              {
                showInfoBox ?
                  <InfoBox onClose={this.hideInfoBox}>
                    <Localized id="draft-style-switcher-info-box">
                      This is experimental feature.
                      There are visual differences between preview and original styles.
                    </Localized>
                  </InfoBox>
                  : null
              }
              <div className="document__header">
                <Title draft={draft} />
              </div>
              <EditorsErrorBoundary>
                <EditorDocument
                  documentDB={documentDbContent}
                  storage={storage}
                  value={valueDocument}
                  readOnly={readOnly}
                  draftPermissions={this.draftPermissions}
                  stepPermissions={this.stepPermissions}
                  language={editorLanguage}
                  onChange={this.onChangeDocument}
                />
                <EditorGlossary
                  documentDB={documentDbGlossary}
                  storage={storage}
                  value={valueGlossary}
                  readOnly={readOnly}
                  draftPermissions={this.draftPermissions}
                  stepPermissions={this.stepPermissions}
                  language={editorLanguage}
                  isGlossaryEmpty={isGlossaryEmpty}
                  onChange={this.onChangeGlossary}
                />
              </EditorsErrorBoundary>
            </div>
          </div>
        </div>
      </Section>
    )
  }
}

export default Load(loader, [], 'draft-loading-message')(connect(mapStateToProps)(Draft))
