import * as React from 'react'
import * as PropTypes from 'prop-types'
import { DocumentDB, Glossary, Persistence } from 'cnx-designer'
import { Block, Editor as Editor_, Text, Value } from 'slate'
import { Editor } from 'slate-react'
import { Localized, ReactLocalization } from 'fluent-react/compat'
import { List } from 'immutable'

import { Storage } from 'src/api'
import { SlotPermission } from 'src/api/process'

import { confirmDialog } from 'src/helpers'

import Button from 'src/components/ui/Button'

import LocalizationLoader from '../components/LocalizationLoader'
import ToolboxGlossary from '../components/ToolboxGlossary'

import Highlights from '../plugins/Highlights'
import I10nPlugin from '../plugins/I10n'
import Shortcuts from '../plugins/Shortcuts'
import Suggestions from '../plugins/Suggestions'
import { SUGGESTION_TYPES } from '../plugins/Suggestions/types'

interface EditorGlossaryProps {
  draftPermissions: Set<SlotPermission>
  stepPermissions: Set<SlotPermission>
  documentDB: DocumentDB | undefined
  readOnly: boolean
  storage: Storage
  value: Value
  language: string
  isGlossaryEmpty: boolean
  onChange: (value: Value) => void
}

class EditorGlossary extends React.Component<EditorGlossaryProps> {
  static contextTypes = {
    l10n: PropTypes.instanceOf(ReactLocalization),
  }

  plugins = [
    I10nPlugin,
    Highlights(),
    this.props.stepPermissions.has('propose-changes')
    || this.props.stepPermissions.has('accept-changes') ?
      Suggestions({ isActive: this.props.draftPermissions.has('propose-changes') })
      : {},
    ...Glossary({
      text: {
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

    const valueGlossary = Value.fromJS({
      object: 'value',
      document: {
        object: 'document',
        nodes: [definition.toJS()],
      },
    })

    this.props.onChange(valueGlossary)
    this.props.documentDB!.save(valueGlossary, this.props.documentDB!.version!)
  }

  removeGlossary = async () => {
    const res = await confirmDialog({
      title: 'draft-remove-glossary-dialog',
      buttons: {
        cancel: 'draft-cancel',
        remove: 'draft-remove-glossary',
      },
    })

    if (res === 'remove') {
      const valueGlossary = Value.fromJS({
        object: 'value',
        document: {
          object: 'document',
          nodes: [],
        },
      })

      this.props.onChange(valueGlossary)
      this.props.documentDB!.save(valueGlossary, this.props.documentDB!.version!)
    }
  }

  editor = React.createRef<Editor>()

  public render() {
    if (this.props.isGlossaryEmpty) {
      return (
        <GlossaryToggler
          readOnly={this.props.readOnly}
          isGlossaryEmpty={this.props.isGlossaryEmpty}
          onAddGlossary={this.addGlossary}
          onRemoveGlossary={this.removeGlossary}
        />
      )
    }

    return (
      <>
        <GlossaryToggler
          readOnly={this.props.readOnly}
          isGlossaryEmpty={this.props.isGlossaryEmpty}
          onAddGlossary={this.addGlossary}
          onRemoveGlossary={this.removeGlossary}
        />
        <div className="document__editor document__editor--glossary">
          <LocalizationLoader
            locale={this.props.language}
          >
            <Editor
              ref={this.editor}
              className="editor editor--glossary"
              value={this.props.value}
              plugins={this.plugins}
              onChange={this.onChange}
              readOnly={this.props.readOnly}
            />
          </LocalizationLoader>
          {
            this.props.readOnly ?
              null
              :
              <ToolboxGlossary
                editor={this.editor.current as unknown as Editor_}
                value={this.props.value}
              />
          }
        </div>
      </>
    )
  }
}

export default EditorGlossary

interface GlossaryTogglerProps {
  readOnly: boolean
  isGlossaryEmpty: boolean
  onAddGlossary: () => void
  onRemoveGlossary: () => void
}

const GlossaryToggler = (props: GlossaryTogglerProps) => {
  if (props.readOnly) return null

  return (
    <div className="document__glossary-toggler">
      {
        props.isGlossaryEmpty ?
          <Button clickHandler={props.onAddGlossary}>
            <Localized id="draft-add-glossary">
              Add glossary
            </Localized>
          </Button>
          :
          <Button
            type="danger"
            clickHandler={props.onRemoveGlossary}
          >
            <Localized id="draft-remove-glossary">
              Remove glossary
            </Localized>
          </Button>
      }
    </div>
  )
}
