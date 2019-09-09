import * as React from 'react'
import * as PropTypes from 'prop-types'
import Counters from 'slate-counters'
import { Document, DocumentDB, Persistence } from 'cnx-designer'
import { Value, Editor as Editor_ } from 'slate'
import { Editor } from 'slate-react'
import { ReactLocalization } from 'fluent-react/compat'

import { Storage } from 'src/api'
import { SlotPermission } from 'src/api/process'

import LocalizationLoader from '../components/LocalizationLoader'
import ToolboxDocument from '../components/ToolboxDocument'

import Docref from '../plugins/Docref'
import StorageContext from '../plugins/Storage'
import I10nPlugin from '../plugins/I10n'
import XrefPlugin from '../plugins/Xref'
import TablesPlugin from '../plugins/Tables'
import SourceElements from '../plugins/SourceElements'
import Shortcuts from '../plugins/Shortcuts'
import Suggestions from '../plugins/Suggestions'
import { SUGGESTION_TYPES } from '../plugins/Suggestions/types'

type Props = {
  draftPermissions: Set<SlotPermission>
  stepPermissions: Set<SlotPermission>
  documentDB: DocumentDB | undefined
  readOnly: boolean
  storage: Storage
  value: Value
  language: string
  onChange: (value: Value) => void
}

class EditorDocument extends React.Component<Props> {
  static contextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
  }

  plugins = [
    I10nPlugin,
    Docref,
    XrefPlugin,
    TablesPlugin,
    SourceElements({ inlines: SUGGESTION_TYPES }),
    this.props.stepPermissions.has('propose-changes')
    || this.props.stepPermissions.has('accept-changes') ?
      Suggestions({ isActive: this.props.draftPermissions.has('propose-changes') })
      : {},
    Counters(),
    ...Document({
      document_content: ['table', 'source_element'],
      content: ['source_element'],
      text: {
        code: {
          inlines: SUGGESTION_TYPES,
        },
        term: {
          inlines: SUGGESTION_TYPES,
        },
      },
    }),
    Shortcuts(),
    this.props.readOnly || !this.props.documentDB ? {} : Persistence({ db: this.props.documentDB }),
  ]

  onChange = ({ value }: { value: Value }) => {
    this.props.onChange(value)
  }

  editor = React.createRef<Editor>()

  public render() {
    return (
      <div className="document__editor document__editor--document">
        <LocalizationLoader
          locale={this.props.language}
        >
          <StorageContext storage={this.props.storage}>
            <Editor
              ref={this.editor}
              className="editor editor--document"
              value={this.props.value}
              plugins={this.plugins}
              onChange={this.onChange}
              readOnly={this.props.readOnly}
            />
          </StorageContext>
        </LocalizationLoader>
        {
          this.props.readOnly ?
            null
          :
            <StorageContext storage={this.props.storage}>
              <ToolboxDocument
                editor={this.editor.current as unknown as Editor_}
                value={this.props.value}
              />
            </StorageContext>
        }
      </div>
    )
  }
}

export default EditorDocument
