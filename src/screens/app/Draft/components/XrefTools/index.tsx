import * as React from 'react'
import Select from 'react-select'
import { Trans, withI18n } from 'react-i18next'
import { Editor, Value } from 'slate'

import i18n from 'src/i18n'
import { Module } from 'src/api'
import { ReferenceTarget } from 'src/store/types'

import ToolGroup from '../ToolGroup'
import Modal from 'src/components/Modal'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import XrefTargetSelector from 'src/containers/XrefTargetSelector'

type SelectOption = { value: string, label: string }

const DECLENSIONS: SelectOption[] = [
  { value: 'none', label: i18n.t('Editor.xref.declensions.none') },
  { value: 'genitive', label: i18n.t('Editor.xref.declensions.genitive') },
  { value: 'dative', label: i18n.t('Editor.xref.declensions.dative') },
  { value: 'accusative', label: i18n.t('Editor.xref.declensions.accusative') },
  { value: 'instrumental', label: i18n.t('Editor.xref.declensions.instrumental') },
  { value: 'locative', label: i18n.t('Editor.xref.declensions.locative') },
  { value: 'vocative', label: i18n.t('Editor.xref.declensions.vocative') },
]

export type Props = {
  editor: Editor,
  value: Value,
}

export default class XrefTools extends React.Component<Props> {
  xrefModal: Modal | null = null

  public render() {
    const xref = this.getActiveXref()

    if (!xref) return null

    return (
      <ToolGroup title="Editor.xref.groupTitle">
        <Select
          className="toolbox__select"
          onChange={this.changeDeclension}
          options={DECLENSIONS}
          value={DECLENSIONS.find(el => el.value === xref.data.get('case')) || DECLENSIONS[0]}
        />
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

  private changeDeclension = ({ value }: SelectOption) => {
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
