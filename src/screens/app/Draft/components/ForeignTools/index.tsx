import * as React from 'react'
import Select from 'react-select'
import { Document, Editor, Inline, InlineProperties, Value } from 'slate'
import { GetString, Localized, withLocalization } from 'fluent-react/compat'

import { allLanguages as LANGUAGES } from 'src/locale/data.json'

import ToolGroup from '../ToolGroup'

import { OnToggle as OnToggleDocument } from '../ToolboxDocument'
import { OnToggle as OnToggleGlossary } from '../ToolboxGlossary'

interface ForeignToolsProps {
  editor: Editor
  value: Value
  toggleState: boolean
  onToggle: OnToggleDocument | OnToggleGlossary
  getString: GetString
}

const ForeignTools = ({ editor, value, toggleState, onToggle, getString }: ForeignToolsProps) => {
  const onClickToggle = () => {
    onToggle('foreignTools')
  }

  const selectLanguage = (lang: { value: string } | null) => {
    const newLang = lang && LANGUAGES.find(l => l.code === lang.value)
    const foreign = getActiveForeign()

    if (foreign) {
      const props: InlineProperties = {
        type: 'foreign',
      }
      if (newLang) {
        props.data = {
          lang: newLang.code,
        }
      }
      editor.setNodeByKey(foreign.key, props)
    }
  }

  const getActiveForeign = (): Inline | null => {
    const { document, selection: { start } } = value

    if (!start.path) return null

    let node: Document | Inline = document
    for (const index of start.path as unknown as Iterable<number>) {
      node = node.nodes.get(Number(index)) as Inline

      if (node.type === 'foreign') {
        return node
      }
    }

    return null
  }

  const foreign = getActiveForeign()
  if (!foreign) return null

  const lang = foreign && foreign.data.get('lang') as string | undefined
  const language = lang ? LANGUAGES.find(l => l.code === lang) : undefined

  return (
    <ToolGroup
      title="editor-tools-foreign-title"
      toggleState={toggleState}
      onToggle={onClickToggle}
    >
      <label className="toolbox__label">
        <span className="toolbox__title">
          <Localized id="editor-tools-foreign-select-language">
            Select language of foreign word
          </Localized>
        </span>
        <Select
          className="toolbox__select react-select"
          placeholder={getString('editor-tools-foreign-select-placeholder')}
          value={language ? { value: language.code, label: language.name } : null}
          onChange={selectLanguage}
          options={LANGUAGES.map(l => ({ value: l.code, label: l.name }))}
          formatOptionLabel={formatSelectOption}
        />
      </label>
    </ToolGroup>
  )
}

export default withLocalization(ForeignTools)

function formatSelectOption(option: any): JSX.Element {
  return option.label
}
