import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { Editor, Value, Text, Inline } from 'slate'
import { List } from 'immutable'

import { Module } from 'src/api'
import { ReferenceTarget } from 'src/store/types'

import ToolGroup from '../ToolGroup'
import Modal from 'src/components/Modal'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import XrefTargetSelector from 'src/containers/XrefTargetSelector'

import { OnToggle } from '../ToolboxDocument'

import './index.css'

const CASES: string[] = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'locative', 'vocative']

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class XrefTools extends React.Component<Props> {
  xrefModal: Modal | null = null

  public render() {
    const xref = this.getActiveXref()

    if (!xref) return null

    const xrefCase = xref.data.get('case') || CASES[0]

    return (
      <ToolGroup
        title="editor-tools-xref-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('xrefTools')}
      >
        <label className="toolbox__label">
          <span className="xref__title">
            <Localized id="editor-tools-xref-case">
              Select case
            </Localized>
          </span>
          <Select
            className="toolbox__select react-select"
            onChange={this.changeCase}
            options={CASES.map(c => {return {value: c, label: c}})}
            value={{value: xrefCase, label: xrefCase}}
            formatOptionLabel={OptionLabel}
          />
        </label>
        <Button clickHandler={this.openXrefModal} className="toolbox__button--insert">
          <Icon size="small" name="pencil" />
          <Localized id="editor-tools-xref-change">
            Change target
          </Localized>
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

  private changeCase = ({value}: {value: string, label: string}) => {
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
    const xref = this.getActiveXref()
    if (!xref) return

    let newRef
    if (target) {
      newRef = {
        type: 'xref',
        data: {
          target: target.id,
          document: source ? source.id : undefined,
        },
      }
    } else if (!target && source) {
      newRef = {
        type: 'docref',
        data: {
          document: source!.id,
        },
        nodes: List([Text.create(source.title)]),
      }
    } else {
      return
    }

    this.props.editor.replaceNodeByKey(xref.key, Inline.create(newRef))
  }
}

function OptionLabel({value: case_}: {value: string, label: string}) {
  return <Localized id="editor-tools-xref-grammatical-case" $case={case_}>{case_}</Localized>
}
