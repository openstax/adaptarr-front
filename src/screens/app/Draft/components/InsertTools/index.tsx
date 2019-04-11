import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value } from 'slate'
import { MediaDescription } from 'cnx-designer'

import * as api from 'src/api'
import { FileDescription } from 'src/api/storage'

import ToolGroup from '../ToolGroup'
import Modal from 'src/components/Modal'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import AssetList from 'src/containers/AssetList'
import XrefTargetSelector from 'src/containers/XrefTargetSelector'

import { ReferenceTarget } from 'src/store/types'

export type Props = {
  editor: Editor,
  value: Value,
}

export default class InsertTools extends React.Component<Props> {
  figureModal: Modal | null = null
  xrefModal: Modal | null = null

  render() {
    const { editor, value } = this.props

    return (
      <ToolGroup title="editor-tools-insert-title">
        <Button
          clickHandler={this.openXrefModal}
          className="toolbox__button--insert"
        >
          <Icon name="link" />
          <Localized id="editor-tools-insert-reference">
            Reference
          </Localized>
        </Button>
        <Button clickHandler={this.insertAdmonition} className="toolbox__button--insert">
          <Icon name="sticky-note" />
          <Localized id="editor-tools-insert-admonition">
            Admonition
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertExercise}
          isDisabled={editor.getActiveExercise(value) != null}
          className="toolbox__button--insert"
        >
          <Icon name="flask" />
          <Localized id="editor-tools-insert-exercise">
            Exercise
          </Localized>
        </Button>
        <Button clickHandler={this.openFigureModal} className="toolbox__button--insert">
          <Icon name="image" />
          <Localized id="editor-tools-insert-figure">
            Figure
          </Localized>
        </Button>
        <Button clickHandler={this.insertSection} className="toolbox__button--insert">
          <Icon name="plus" />
          <Localized id="editor-tools-insert-section">
            Section
          </Localized>
        </Button>
        <Button clickHandler={this.insertQuotation} className="toolbox__button--insert">
          <Icon name="quote" />
          <Localized id="editor-tools-insert-quotation">
            Quotation
          </Localized>
        </Button>
        <Modal
          ref={this.setFigureModal}
          content={this.renderFigureModal}
        />
        <Modal
          ref={this.setXrefModal}
          content={this.renderXrefModal}
        />
      </ToolGroup>
    )
  }

  private renderFigureModal = () => (
    <AssetList
      filter="image/*"
      onSelect={this.insertFigure}
    />
  )

  private renderXrefModal = () => (
    <XrefTargetSelector
      editor={this.props.editor}
      onSelect={this.insertReference}
    />
  )

  private setFigureModal = (el: Modal | null) => el && (this.figureModal = el)

  private setXrefModal = (el: Modal | null) => el &&(this.xrefModal = el)

  private openFigureModal = () => this.figureModal!.open()

  private openXrefModal = () => this.xrefModal!.open()

  private insertAdmonition = () => {
    // TODO: clicking insert admonition should expand a menu where the user can
    // choose which kind of admonition to insert.
    this.props.editor.insertAdmonition('note')
  }

  private insertExercise = () => {
    this.props.editor.insertExercise()
  }

  private insertFigure = (asset: FileDescription) => {
    this.figureModal!.close()
    // XXX: We cast FileDescription as MediaDescription, as currently there
    // is no way to add alt-texts, server doesn't store it yet, and it is not
    // used anywhere.
    this.props.editor.insertFigure(asset as MediaDescription)
  }

  private insertSection = () => {
    this.props.editor.insertSection()
  }

  private insertReference = (target: ReferenceTarget, source: api.Module | null) => {
    this.xrefModal!.close()
    this.props.editor.insertXref(target.id, source ? source.id : undefined)
  }

  private insertQuotation = () => {
    this.props.editor.wrapBlock('quotation')
  }
}
