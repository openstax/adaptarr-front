import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value, Text, Block, Inline, Document, Node } from 'slate'
import { MediaDescription } from 'cnx-designer'
import { List } from 'immutable'

import * as api from 'src/api'
import { FileDescription } from 'src/api/storage'

import LinkBox from '../LinkBox'
import ToolGroup from '../ToolGroup'
import Modal from 'src/components/Modal'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import AssetList from 'src/containers/AssetList'
import XrefTargetSelector from 'src/containers/XrefTargetSelector'

import { ReferenceTarget } from 'src/store/types'

import { OnToggle } from '../ToolboxDocument'

export type Props = {
  editor: Editor,
  value: Value,
  selectionParent: Document | Block | Inline | null,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class InsertTools extends React.Component<Props> {
  figureModal: Modal | null = null
  xrefModal: Modal | null = null
  linkModal: Modal | null = null

  render() {
    return (
      <ToolGroup
        title="editor-tools-insert-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('insertTools')}
      >
        <Button
          clickHandler={this.openXrefModal}
          className="toolbox__button--insert"
        >
          <Icon name="link" />
          <Localized id="editor-tools-insert-reference">
            Reference
          </Localized>
        </Button>
        <Button
          clickHandler={this.toggleAdmonition}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(['document', 'section', 'admonition'])}
        >
          <Icon name="sticky-note" />
          <Localized id="editor-tools-insert-admonition">
            Admonition
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertExercise}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(['document', 'section'])}
        >
          <Icon name="flask" />
          <Localized id="editor-tools-insert-exercise">
            Exercise
          </Localized>
        </Button>
        <Button
          clickHandler={this.openFigureModal}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(['document', 'section'])}
        >
          <Icon name="image" />
          <Localized id="editor-tools-insert-figure">
            Figure
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertCode}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(['document', 'section', 'admonition', 'exercise_problem', 'exercise_solution'])}
        >
          <Icon name="code" />
          <Localized id="editor-tools-insert-code">
            Code
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertSection}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(['document', 'section'])}
        >
          <Icon name="plus" />
          <Localized id="editor-tools-insert-section">
            Section
          </Localized>
        </Button>
        <Button
          clickHandler={this.toggleQuotation}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(['document', 'section', 'admonition', 'exercise_problem', 'exercise_solution', 'quotation'])}
        >
          <Icon name="quote" />
          <Localized id="editor-tools-insert-quotation">
            Quotation
          </Localized>
        </Button>
        <Button clickHandler={this.handleInsertLink} className="toolbox__button--insert">
          <Icon name="link" />
          <Localized id="editor-tools-insert-link">
            Link
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertSourceElement}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(['document', 'section', 'admonition', 'exercise_problem', 'exercise_solution', 'quotation'])}
        >
          <Icon name="file-code" />
          <Localized id="editor-tools-insert-source">
            Source element
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
        <Modal
          ref={this.setLinkModal}
          content={this.renderLinkModal}
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

  private renderLinkModal = () => (
    <LinkBox
      onAccept={this.insertLink}
    />
  )

  private setFigureModal = (el: Modal | null) => el && (this.figureModal = el)

  private setXrefModal = (el: Modal | null) => el &&(this.xrefModal = el)

  private setLinkModal = (el: Modal | null) => el &&(this.linkModal = el)

  private openFigureModal = () => this.figureModal!.open()

  private openXrefModal = () => this.xrefModal!.open()

  private openLinkModal = () => this.linkModal!.open()

  private toggleAdmonition = () => {
    // TODO: clicking insert admonition should expand a menu where the user can
    // choose which kind of admonition to insert.
    const { editor, selectionParent } = this.props
    if (
      selectionParent
      && selectionParent.type === 'admonition'
      ) {
      unwrapChildrenFromNode(editor, selectionParent)
      return
    }
    editor.insertAdmonition('note')
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

  private insertCode = () => {
    this.props.editor.insertBlock('code')
  }

  private toggleQuotation = () => {
    const { editor, value: { selection }, selectionParent } = this.props

    const selectedAllNodes = selectionParent && selection.start.isInNode(selectionParent.nodes.first()) && selection.end.isInNode(selectionParent.nodes.last())

    if (
      selectionParent
      && selectionParent.type === 'quotation'
      && (selectionParent.nodes.size === 1 || selectedAllNodes)
    ) {
      unwrapChildrenFromNode(editor, selectionParent)
      return
    }
    editor.wrapBlock('quotation')
  }

  private handleInsertLink = () => {
    this.openLinkModal()
  }

  private insertLink = (text: string, url: string) => {
    this.linkModal!.close()
    const editor = this.props.editor
    const link = {
      type: 'link',
      data: { url },
    }
    editor.insertText(text)
    editor.moveFocusBackward(text.length)
    editor.wrapInline(link)
  }

  private insertSourceElement = () => {
    this.props.editor.insertInline({ type: 'source_element', nodes: List([Text.create(' ')]) })
    this.props.editor.moveBackward()
  }

  private validateParents = (validParents: string[]): boolean => {
    const sp = this.props.selectionParent
    if (!sp) return false
    if (validParents.includes(sp.type) || validParents.includes(sp.object)) return true
    return false
  }
}

const unwrapChildrenFromNode = (editor: Editor, node: Node) => {
  const path = editor.value.document.getPath(node.key)
  if (node.object === 'text') return
  node.nodes.forEach(n => {
    if (n && n.object === 'block' && n.type === 'title') {
      editor.setNodeByKey(n.key, { type: 'paragraph' })
    }
  })
  editor.unwrapChildrenByPath(path)
}
