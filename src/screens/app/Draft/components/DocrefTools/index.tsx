import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Inline, Text, Value } from 'slate'
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

interface XrefToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class XrefTools extends React.Component<XrefToolsProps> {
  xrefModal: Modal | null = null

  private onClickToggle = () => {
    this.props.onToggle('docrefTools')
  }

  public render() {
    const docref = this.getActiveDocref()

    if (!docref) return null

    return (
      <ToolGroup
        title="editor-tools-docref-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
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

  private getActiveDocref = () => {
    const docref = this.props.value.startInline

    if (!docref) return null

    return docref.type === 'docref' ? docref : null
  }

  private setXrefModal = (el: Modal | null) => el &&(this.xrefModal = el)

  private openXrefModal = () => this.xrefModal!.open()

  private renderXrefModal = () => (
    <XrefTargetSelector
      editor={this.props.editor}
      onSelect={this.changeReference}
    />
  )

  private changeReference = (target: ReferenceTarget | null, source: Module | null) => {
    this.xrefModal!.close()
    const docref = this.getActiveDocref()
    if (!docref) return

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

    this.props.editor.replaceNodeByKey(docref.key, Inline.create(newRef))
  }
}
