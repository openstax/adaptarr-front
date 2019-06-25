import * as React from 'react'
import * as PropTypes from 'prop-types'
import Counters from 'slate-counters'
import { Value } from 'slate'
import { Editor } from 'slate-react'
import { CNXML, Document, Glossary } from 'cnx-designer'

import * as api from 'src/api'

import Spinner from 'src/components/Spinner'

import tablesDeserialize from 'src/screens/app/Draft/plugins/Tables/deserialize'
import tablesSerialize from 'src/screens/app/Draft/plugins/Tables/serialize'
import sourceElementsDeserialize from 'src/screens/app/Draft/plugins/SourceElements/deserialize'
import sourceElementsSerialize from 'src/screens/app/Draft/plugins/SourceElements/serialize'
import LocalizationLoader from 'src/screens/app/Draft/components/LocalizationLoader'
import I10nPlugin from 'src/screens/app/Draft/plugins/I10n'
import XrefPlugin from 'src/screens/app/Draft/plugins/Xref'
import TablesPlugin from 'src/screens/app/Draft/plugins/Tables'
import SourceElements from 'src/screens/app/Draft/plugins/SourceElements'

import './index.css'

type Props = {
  moduleId: string
}

type State = {
  loading: boolean,
  valueDocument: Value | null,
  valueGlossary: Value | null,
}

class ModulePreview extends React.Component<Props> {
  state: State = {
    loading: false,
    valueDocument: null,
    valueGlossary: null,
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
  ]

  pluginsGlossary = [
    I10nPlugin,
    ...Glossary(),
  ]

  // This make sure that Counters() are correctly set.
  onChangeDocument = ({ value }: { value: Value }) => {
    this.setState({ valueDocument: value })
  }

  mediaUrl = (name: string) => `/api/v1/modules/${this.props.moduleId}/files/${name}`

  componentDidUpdate = async (prevProps: Props) => {
    if (prevProps.moduleId !== this.props.moduleId) {
      this.setState({ loading: true })
      const { document, glossary } = await this.loadContent(this.props.moduleId)
      this.setState({ loading: false, valueDocument: document, valueGlossary: glossary })
    }
  }

  componentWillMount = async () => {
    const { document, glossary } = await this.loadContent(this.props.moduleId)
    this.setState({ valueDocument: document, valueGlossary: glossary })
  }

  private loadContent = async (moduleId: string) => {
    const module = await api.Module.load(moduleId)

    const serializer = new CNXML({
      documentRules: [tablesDeserialize, tablesSerialize, sourceElementsDeserialize, sourceElementsSerialize],
      glossaryRules: [],
    })

    const content = await module.read('index.cnxml')
    const { document, glossary } = serializer.deserialize(content)

    return {
      document,
      glossary: glossary.document.nodes.get(0).type === 'definition' ? glossary : null,
    }
  }

  public render() {
    const { loading, valueDocument, valueGlossary } = this.state

    return (
      <div className="modulePreview cnxml">
        {
          !loading && valueDocument ?
            <LocalizationLoader
              locale={valueDocument.data.get('language') || 'en'}
            >
              <MediaContext mediaUrl={this.mediaUrl}>
                <Editor
                  className="editor editor--document"
                  value={valueDocument}
                  plugins={this.pluginsDocument}
                  onChange={this.onChangeDocument}
                  readOnly={true}
                />
                {
                  valueGlossary ?
                    <Editor
                      className="editor editor--glossary"
                      value={valueGlossary}
                      plugins={this.pluginsGlossary}
                      readOnly={true}
                    />
                  : null
                }
              </MediaContext>
            </LocalizationLoader>
          : <Spinner />
        }
      </div>
    )
  }
}

export default ModulePreview

class MediaContext extends React.Component<{mediaUrl: (name: string) => string}> {
  static childContextTypes = {
    mediaUrl: PropTypes.instanceOf(Function)
  }

  getChildContext() {
    return {
      mediaUrl: this.props.mediaUrl,
    }
  }

  render() {
    return <React.Fragment>
      {this.props.children}
    </React.Fragment>
  }
}
