import * as React from 'react'
import { Trans } from 'react-i18next'
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
      <ToolGroup title="Editor.insert.groupTitle">
        <Button
          clickHandler={this.openXrefModal}
          className="toolbox__button--insert"
        >
          <Icon name="link" />
          <Trans i18nKey="Editor.insert.reference" />
        </Button>
        <Button clickHandler={this.insertAdmonition} className="toolbox__button--insert">
          <Icon name="sticky-note" />
          <Trans i18nKey="Editor.insert.admonition" />
        </Button>
        <Button
          clickHandler={this.insertExercise}
          isDisabled={editor.getActiveExercise(value) != null}
          className="toolbox__button--insert"
        >
          <Icon name="flask" />
          <Trans i18nKey="Editor.insert.exercise" />
        </Button>
        <Button clickHandler={this.openFigureModal} className="toolbox__button--insert">
          <Icon name="image" />
          <Trans i18nKey="Editor.insert.figure" />
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

  private insertReference = (target: ReferenceTarget, source: api.Module | null) => {
    this.xrefModal!.close()
    this.props.editor.insertXref(target.id, source ? source.id : undefined)
  }
}
