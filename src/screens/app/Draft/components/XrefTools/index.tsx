import * as React from 'react'
import Select from 'react-select'
import { Trans } from 'react-i18next'
import { Editor, Value } from 'slate'

import i18n from 'src/i18n'
import getCurrentLng from 'src/helpers/getCurrentLng'
import { Module } from 'src/api'
import { ReferenceTarget } from 'src/store/types'

import ToolGroup from '../ToolGroup'
import Modal from 'src/components/Modal'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import XrefTargetSelector from 'src/containers/XrefTargetSelector'

type SelectOption = { value: string, label: string }

const LANGUAGES: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
]

const CASES: { [key: string]: SelectOption[] } = {
  en: [
    { value: 'none', label: i18n.t('Editor.xref.cases.none') },
  ],
  pl: [
    { value: 'none', label: i18n.t('Editor.xref.cases.none') },
    { value: 'genitive', label: i18n.t('Editor.xref.cases.genitive') },
    { value: 'dative', label: i18n.t('Editor.xref.cases.dative') },
    { value: 'accusative', label: i18n.t('Editor.xref.cases.accusative') },
    { value: 'instrumental', label: i18n.t('Editor.xref.cases.instrumental') },
    { value: 'locative', label: i18n.t('Editor.xref.cases.locative') },
    { value: 'vocative', label: i18n.t('Editor.xref.cases.vocative') },
  ],
}

export type Props = {
  editor: Editor,
  value: Value,
}

export default class XrefTools extends React.Component<Props> {
  state: {
    language: SelectOption
  } = {
    language: LANGUAGES.find(lng => lng.value === getCurrentLng('iso')) || LANGUAGES[0]
  }

  xrefModal: Modal | null = null

  public render() {
    const xref = this.getActiveXref()

    if (!xref) return null

    const { language } = this.state

    return (
      <ToolGroup title="Editor.xref.groupTitle">
        <label className="toolbox__label">
          Select language
          <Select
            className="toolbox__select"
            onChange={this.changeLang}
            options={LANGUAGES}
            value={language}
          />
        </label>
        <label className="toolbox__label">
          Select case
          <Select
            className="toolbox__select"
            onChange={this.changeCase}
            options={CASES[language.value]}
            value={CASES[language.value].find((el: SelectOption) => el.value === xref.data.get('case')) || CASES[language.value][0]}
          />
        </label>
        <Button clickHandler={this.openXrefModal} className="toolbox__button--insert">
          <Icon name="pencil" />
          <Trans i18nKey="Editor.xref.action.change" />
        </Button>
        <Modal
          ref={this.setXrefModal}
          content={this.renderXrefModal}
        />
      </ToolGroup>
    )
  }

  private getActiveXref = () => {
    const xref = this.props.value.startInline

    if (!xref) return null

    return xref.type === 'xref' ? xref : null
  }

  private changeLang = (lng: SelectOption) => {
    if (lng.value === this.state.language.value) return
    this.setState({ language: lng })
  }

  private changeCase = ({ value }: SelectOption) => {
    const xref = this.getActiveXref()
    if (!xref) return

    let newRef = {
      type: 'xref',
      data: {
        target: xref.data.get('target'),
        case: value !== 'none' ? value : null,
      }
    }

    if (xref.data.get('document')) {
      newRef.data['document'] = xref.data.get('document')
    }
    
    this.props.editor.setNodeByKey(xref.key, newRef)
  }

  private setXrefModal = (el: Modal | null) => el &&(this.xrefModal = el)

  private openXrefModal = () => this.xrefModal!.open()

  private renderXrefModal = () => (
    <XrefTargetSelector
      editor={this.props.editor}
      onSelect={this.changeReference}
    />
  )

  private changeReference = (target: ReferenceTarget, source: Module | null) => {
    this.xrefModal!.close()
    const newRef = {type: 'xref', data: { target: target.id, document: source ? source.id : undefined }}
    const xref = this.getActiveXref()
    if (!xref) return
    this.props.editor.setNodeByKey(xref.key, newRef)
  }
}
