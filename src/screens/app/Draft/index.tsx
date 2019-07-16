import * as React from 'react'
import * as PropTypes from 'prop-types'
import Counters from 'slate-counters'
import { Localized, ReactLocalization } from 'fluent-react/compat'
import { PersistDB, DocumentDB, uuid, Document, Glossary, Persistence } from 'cnx-designer'
import { match } from 'react-router'
import { History } from 'history'
import { Block, Value, Text, KeyUtils, Editor as Editor_ } from 'slate'
import { Editor } from 'slate-react'
import { List } from 'immutable'

import timeout from 'src/helpers/timeout'

import store from 'src/store'
import * as api from 'src/api'
import { fetchReferenceTargets } from 'src/store/actions/Modules'
import { setCurrentDraftLang } from 'src/store/actions/Drafts'

import Load from 'src/components/Load'
import Section from 'src/components/Section'
import InfoBox from 'src/components/InfoBox'
import Header from 'src/components/Header'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import DraftInfo from 'src/components/DraftInfo'
import Title from './components/Title'
import StyleSwitcher from './components/StyleSwitcher'
import StepChanger from './components/StepChanger'
import SaveButton from './components/SaveButton'
import ToolboxDocument from './components/ToolboxDocument'
import ToolboxGlossary from './components/ToolboxGlossary'
import LocalizationLoader from './components/LocalizationLoader'

import './index.css'
import StorageContext from './plugins/Storage'
import I10nPlugin from './plugins/I10n'
import XrefPlugin, { collectForeignDocuments } from './plugins/Xref'
import TablesPlugin from './plugins/Tables'
import SourceElements from './plugins/SourceElements'
import Shortcuts from './plugins/Shortcuts'

type Props = {
  documentDbContent: DocumentDB
  documentDbGlossary: DocumentDB
  storage: api.Storage
  draft: api.Draft
  document: Value
  glossary: Value
  history: History
}

;KeyUtils.resetGenerator()
KeyUtils.setGenerator(() => uuid.v4())

async function loader({ match: { params: { id } } }: { match: match<{ id: string }> }) {
  const [[documentDbContent, documentDbGlossary], storage, draft] = await Promise.all([
    Promise.race([
      Promise.all([
        PersistDB.load(`${id}-document`),
        PersistDB.load(`${id}-glossary`),
      ]),
      timeout(10000),
    ]),
    api.Storage.load(id),
    api.Draft.load(id),
  ])

  let document, glossary

  if (documentDbContent.dirty) {
    document = await documentDbContent.restore()
    glossary = await documentDbGlossary.restore()
  } else {
    const deserialize = await storage.read()
    document = deserialize.document
    glossary = deserialize.glossary
    // Reset glossary if it have invalid content
    if (glossary.document.nodes.get(0).type !== 'definition') {
      glossary = Value.fromJS({
        object: 'value',
        document: {
          object: 'document',
          nodes: [],
        }
      })
    }
    // TODO: get version from API
    await documentDbContent.save(document, Date.now().toString())
    await documentDbGlossary.save(glossary, Date.now().toString())
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

class Draft extends React.Component<Props> {
  state: {
    editorStyle: string
    showInfoBox: boolean
    valueDocument: Value
    valueGlossary: Value
    isGlossaryEmpty: boolean
    showRemoveGlossaryDialog: boolean
  } = {
    editorStyle: '',
    showInfoBox: false,
    valueDocument: this.props.document,
    valueGlossary: this.props.glossary,
    isGlossaryEmpty: !this.props.glossary.document.nodes.has(0) || this.props.glossary.document.nodes.get(0).type !== 'definition',
    showRemoveGlossaryDialog: false,
  }

  static contextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
  }

  pluginsDocument = [
    I10nPlugin,
    XrefPlugin,
    TablesPlugin,
    SourceElements,
    Counters(),
    ...Document({
      document_content: ['table', 'source_element'],
      content: ['source_element'],
    }),
    Shortcuts(),
    Persistence({ db: this.props.documentDbContent }),
  ]

  pluginsGlossary = [
    I10nPlugin,
    ...Glossary(),
    Shortcuts(),
    Persistence({ db: this.props.documentDbGlossary }),
  ]

  static childContextTypes = {
    documentDbContent: PropTypes.instanceOf(DocumentDB),
    documentDbGlossary: PropTypes.instanceOf(DocumentDB),
  }

  private handleStyleChange = (style: string) => {
    this.setState({ editorStyle: style, showInfoBox: true })
  }

  private hideInfoBox = () => {
    this.setState({ showInfoBox: false })
  }

  private handleStepChange = () => {
    this.props.history.push('/')
  }

  getChildContext() {
    return {
      documentDbContent: this.props.documentDbContent,
      documentDbGlossary: this.props.documentDbGlossary,
    }
  }

  onChangeDocument = ({ value }: { value: Value }) => {
    this.setState({ valueDocument: value })
  }

  onChangeGlossary = ({ value }: { value: Value }) => {
    const isGlossaryEmpty = !value.document.nodes.has(0) || value.document.nodes.get(0).type !== 'definition'
    this.setState({ valueGlossary: value, isGlossaryEmpty })
  }

  addGlossary = () => {
    const definition = Block.create({
      type: 'definition',
      nodes: List([
        Block.create({
          type: 'definition_term',
          nodes: List([Text.create('')]),
        }),
        Block.create({
          type: 'definition_meaning',
          nodes: List([
            Block.create({
              type: 'paragraph',
              nodes: List([Text.create('')]),
            }),
          ]),
        }),
      ]),
    })

    this.setState({
      valueGlossary: Value.fromJS({
        object: 'value',
        document: {
          object: 'document',
          nodes: [definition.toJS()],
        }
      }),
      isGlossaryEmpty: false,
    }, async () => {
      this.glossaryEditor.current!.focus()
      await this.props.documentDbGlossary.save(this.state.valueGlossary, Date.now().toString())
    })
  }

  removeGlossary = () => {
    this.setState({
      valueGlossary: Value.fromJS({
        object: 'value',
        document: {
          object: 'document',
          nodes: [],
        }
      }),
      isGlossaryEmpty: true,
      showRemoveGlossaryDialog: false,
    }, async () => {
      await this.props.documentDbGlossary.save(this.state.valueGlossary, Date.now().toString())
    })
  }

  showRemoveGlossaryDialog = () => {
    this.setState({ showRemoveGlossaryDialog: true })
  }

  closeRemoveGlossaryDialog = () => {
    this.setState({ showRemoveGlossaryDialog: false })
  }

  isEditorFocused = () => {
    const cE = this.contentEditor.current
    const gE = this.glossaryEditor.current
    if (gE && gE.value.selection.isFocused) return true
    // Return true even if cE is not focused because focus is moved when user click
    // on Select or other Input element in Toolbox
    if (cE) return true
    return false
  }

  componentDidMount() {
    store.dispatch(setCurrentDraftLang(this.state.valueDocument.data.get('language') || 'en'))
  }

  contentEditor: React.RefObject<Editor> = React.createRef()
  glossaryEditor: React.RefObject<Editor> = React.createRef()

  public render() {
    const { documentDbContent, documentDbGlossary, storage, draft } = this.props
    const { valueDocument, valueGlossary, isGlossaryEmpty, editorStyle, showInfoBox, showRemoveGlossaryDialog } = this.state
    const permissions = draft.permissions || []
    const viewPermission = permissions.length === 0 || permissions.every(p => p === 'view')
    const isEditorFocused = this.isEditorFocused()
    const showGlossaryToolbox = this.glossaryEditor.current &&
      this.glossaryEditor.current.value.selection.isFocused
    const showDocumentToolbox = this.contentEditor.current && !showGlossaryToolbox
    const glossaryToggler = viewPermission ? null :
      (
        <div className="document__glossary-toggler">
          {
            isGlossaryEmpty ?
              <Button clickHandler={this.addGlossary}>
                {this.context.l10n.getString('draft-add-glossary')}
              </Button>
            :
              <Button
                type="danger"
                clickHandler={this.showRemoveGlossaryDialog}
              >
                {this.context.l10n.getString('draft-remove-glossary')}
              </Button>
          }
        </div>
      )

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
              !viewPermission ?
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
            <div className="document">
              <div className="document__content">
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
                <LocalizationLoader
                  locale={valueDocument.data.get('language') || 'en'}
                >
                  <StorageContext storage={storage}>
                    <Editor
                      ref={this.contentEditor}
                      className="editor editor--document"
                      value={valueDocument}
                      plugins={this.pluginsDocument}
                      onChange={this.onChangeDocument}
                      readOnly={viewPermission}
                    />
                    {
                      isGlossaryEmpty ?
                        glossaryToggler
                      :
                        <>
                          { glossaryToggler }
                          <Editor
                            ref={this.glossaryEditor}
                            className="editor editor--glossary"
                            value={valueGlossary}
                            plugins={this.pluginsGlossary}
                            onChange={this.onChangeGlossary}
                            readOnly={viewPermission}
                          />
                        </>
                    }
                  </StorageContext>
                </LocalizationLoader>
              </div>
              {
                viewPermission ?
                  null
                :
                  <div className="document__ui">
                    <StorageContext storage={storage}>
                      {
                        showDocumentToolbox ?
                          <ToolboxDocument
                            editor={this.contentEditor.current as unknown as Editor_}
                            value={valueDocument}
                          />
                        : null
                      }
                      {
                        showGlossaryToolbox ?
                          <ToolboxGlossary
                            editor={this.glossaryEditor.current as unknown as Editor_}
                            value={valueGlossary}
                          />
                        : null
                      }
                      {
                        !isEditorFocused ?
                          <div className="toolbox">
                            <Localized id="editor-toolbox-no-selection">
                              Please select editor to show toolbox.
                            </Localized>
                          </div>
                        : null
                      }
                    </StorageContext>
                  </div>
              }
            </div>
          </div>
        </div>
        {
          showRemoveGlossaryDialog ?
            <Dialog
              l10nId="draft-remove-glossary-dialog"
              placeholder="Are you sure you want to remove glossary?"
              onClose={this.closeRemoveGlossaryDialog}
              showCloseButton={false}
            >
              <div className="dialog__buttons">
                <Button clickHandler={this.closeRemoveGlossaryDialog}>
                  <Localized id="draft-cancel">Cancel</Localized>
                </Button>
                <Button
                  type="danger"
                  clickHandler={this.removeGlossary}
                >
                  <Localized id="draft-remove-glossary">
                    Remove
                  </Localized>
                </Button>
              </div>
            </Dialog>
          : null
        }
      </Section>
    )
  }
}

export default Load(loader, [], 'draft-loading-message')(Draft)
