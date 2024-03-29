import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Block, Document, Editor, Inline, Node, Range, Text, Value } from 'slate'
import { MediaDescription } from 'cnx-designer'
import { List } from 'immutable'
import { connect } from 'react-redux'

import * as api from 'src/api'
import { FileDescription } from 'src/api/storage'
import { SlotPermission } from 'src/api/process'

import { ReferenceTarget } from 'src/store/types'
import { State } from 'src/store/reducers'

import LinkBox from '../LinkBox'
import ToolGroup from '../ToolGroup'
import Modal from 'src/components/Modal'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import AssetList from 'src/containers/AssetList'
import XrefTargetSelector from 'src/containers/XrefTargetSelector'

import { OnToggle } from '../ToolboxDocument'

const INVALID_PARENTS_XREF = [
  'image',
  'media_alt',
  'figure',
  'inline',
]
const VALID_PARENTS_CODE = [
  'document',
  'section',
  'admonition',
  'exercise_problem',
  'exercise_solution',
]
const VALID_PARENTS_ADMONITION = [
  'document',
  'section',
  'admonition',
]
const VALID_PARENTS_EXERCISE = [
  'document',
  'section',
]
const VALID_PARENTS_FIGURE = [
  'document',
  'section',
  'admonition',
  'exercise_problem',
  'exercise_solution',
  'exercise_commentary',
]
const VALID_PARENTS_QUOTATION = [
  'document',
  'section',
  'admonition',
  'exercise_problem',
  'exercise_solution',
  'quotation',
]
const VALID_PARENTS_TITLE = [
  'document',
  'section',
  'admonition',
  'quotation',
]
const VALID_PARENTS_PREFORMAT = [
  'document',
  'section',
  'admonition',
  'exercise_problem',
  'exercise_solution',
  'quotation',
  'preformat',
]
const VALID_PARENTS_SOURCE_ELEMENT = [
  'document',
  'section',
  'admonition',
  'exercise_problem',
  'exercise_solution',
  'quotation',
]
const INVALID_PARENTS_FOOTNOTE = [
  'image',
  'preformat',
  'footnote',
]

interface InsertToolsProps {
  editor: Editor
  value: Value
  selectionParent: Document | Block | Inline | null
  toggleState: boolean
  onToggle: OnToggle
  draftPermissions: SlotPermission[]
}

const mapStateToProps = ({ draft: { currentDraftPermissions } }: State) => ({
  draftPermissions: currentDraftPermissions,
})

class InsertTools extends React.Component<InsertToolsProps> {
  figureModal: Modal | null = null

  xrefModal: Modal | null = null

  linkModal: Modal | null = null

  private onClickToggle = () => {
    this.props.onToggle('insertTools')
  }

  render() {
    const { draftPermissions } = this.props

    return (
      <ToolGroup
        title="editor-tools-insert-tools-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <Button
          clickHandler={this.openXrefModal}
          className="toolbox__button--insert"
          isDisabled={this.validateParents(INVALID_PARENTS_XREF)}
        >
          <Icon size="small" name="link" />
          <Localized id="editor-tools-insert-reference">
            Reference
          </Localized>
        </Button>
        <Button
          clickHandler={this.handleInsertLink}
          className="toolbox__button--insert"
          isDisabled={this.validateParents(INVALID_PARENTS_XREF)}
        >
          <Icon size="small" name="www" />
          <Localized id="editor-tools-insert-link">
            Link
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertCode}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(VALID_PARENTS_CODE)}
        >
          <Icon size="small" name="code" />
          <Localized id="editor-tools-insert-code">
            Code
          </Localized>
        </Button>
        <Button
          clickHandler={this.toggleAdmonition}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(VALID_PARENTS_ADMONITION)}
        >
          <Icon size="small" name="sticky-note" />
          <Localized id="editor-tools-insert-admonition">
            Admonition
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertExercise}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(VALID_PARENTS_EXERCISE)}
        >
          <Icon size="small" name="flask" />
          <Localized id="editor-tools-insert-exercise">
            Exercise
          </Localized>
        </Button>
        <Button
          clickHandler={this.openFigureModal}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(VALID_PARENTS_FIGURE)}
        >
          <Icon size="small" name="image" />
          <Localized id="editor-tools-insert-figure">
            Figure
          </Localized>
        </Button>
        <Button
          clickHandler={this.toggleQuotation}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(VALID_PARENTS_QUOTATION)}
        >
          <Icon size="small" name="quote" />
          <Localized id="editor-tools-insert-quotation">
            Quotation
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertTitle}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(VALID_PARENTS_TITLE)}
        >
          <Icon size="small" name="plus" />
          <Localized id="editor-tools-insert-title">
            Title
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertPreformat}
          className="toolbox__button--insert"
          isDisabled={!this.validateParents(VALID_PARENTS_PREFORMAT)}
        >
          <Icon size="small" name="preformat" />
          <Localized id="editor-tools-insert-preformat">
            Preformatted
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertSourceElement}
          className="toolbox__button--insert"
          isDisabled={
            draftPermissions.includes('propose-changes') ||
            !this.validateParents(VALID_PARENTS_SOURCE_ELEMENT)
          }
        >
          <Icon size="small" name="file-code" />
          <Localized id="editor-tools-insert-source">
            Source element
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertFootnote}
          className="toolbox__button--insert"
          isDisabled={this.validateParents(INVALID_PARENTS_FOOTNOTE)}
        >
          <Icon size="small" name="footnote" />
          <Localized id="editor-tools-insert-footnote">
            Footnote
          </Localized>
        </Button>
        <Modal
          ref={this.setFigureModal}
          content={this.renderFigureModal}
        />
        <Modal
          ref={this.setXrefModal}
          content={this.renderXrefModal}
          overflowAuto={true}
        />
        <Modal
          ref={this.setLinkModal}
          content={this.renderLinkModal}
          showCloseButton={false}
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

  private renderLinkModal = () => {
    const { value: { document, selection, selection: { anchor, focus } } } = this.props
    let text = ''
    if (selection.isExpanded) {
      text = document.getFragmentAtRange(Range.create({ anchor, focus })).text
    }
    const closeModal = () => {
      this.linkModal!.close()
    }
    return (
      <LinkBox
        text={text}
        onAccept={this.insertLink}
        onCancel={closeModal}
      />
    )
  }

  private setFigureModal = (el: Modal | null) => el && (this.figureModal = el)

  private setXrefModal = (el: Modal | null) => el &&(this.xrefModal = el)

  private setLinkModal = (el: Modal | null) => el &&(this.linkModal = el)

  private openFigureModal = () => this.figureModal!.open()

  private openXrefModal = () => this.xrefModal!.open()

  private openLinkModal = () => this.linkModal!.open()

  private toggleAdmonition = () => {
    // TODO: clicking insert admonition should expand a menu where the user can
    // choose which kind of admonition to insert.
    const { editor, selectionParent, value: { document, selection } } = this.props
    if (
      selectionParent
      && selectionParent.type === 'admonition'
    ) {
      unwrapChildrenFromNode(editor, selectionParent)
      return
    }

    if (selection.isCollapsed) {
      editor.wrapBlock({
        type: 'admonition',
        data: {
          type: 'note',
        },
      })
    } else {
      const fragment = document.getFragmentAtRange(Range.create({
        anchor: selection.anchor, focus: selection.focus,
      }))
      editor.insertBlock(Block.create({
        type: 'admonition',
        data: {
          type: 'note',
        },
        nodes: fragment.nodes as List<Block | Inline | Text>,
      }))
    }
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

  private insertTitle = () => {
    const { editor, selectionParent: sp } = this.props
    if (sp) {
      if (sp.object === 'document' || sp.type === 'section') {
        editor.insertSection()
      } else if (sp.type === 'admonition' || sp.type === 'quotation') {
        const first = sp.nodes.first() as Block
        if (first.type === 'title') {
          editor.moveTo(first.key, 0)
        } else {
          const title = Block.create('title')
          editor.insertNodeByKey(sp.key, 0, title)
          editor.moveTo(title.key, 0)
        }
      }
    }
  }

  private insertReference = (target: ReferenceTarget | null, source: api.Module | null) => {
    this.xrefModal!.close()
    const { editor } = this.props

    if (!target && source) {
      const ref = Inline.create({
        type: 'docref',
        data: {
          document: source.id,
        },
        nodes: List([Text.create(source.title)]),
      })
      if (editor.value.selection.isCollapsed) {
        editor.insertInline(ref)
        return
      }
      editor.wrapInline(ref)
      return
    }
    editor.insertXref(target!.id, source ? source.id : undefined)
  }

  private insertCode = () => {
    this.props.editor.insertBlock('code')
  }

  private toggleQuotation = () => {
    const { editor, value: { document, selection }, selectionParent } = this.props

    const selectedAllNodes = selectionParent &&
      selection.start.isInNode(selectionParent.nodes.first()) &&
      selection.end.isInNode(selectionParent.nodes.last())

    if (
      selectionParent
      && selectionParent.type === 'quotation'
      && (selectionParent.nodes.size === 1 || selectedAllNodes)
    ) {
      unwrapChildrenFromNode(editor, selectionParent)
      return
    }

    if (selection.isCollapsed) {
      editor.wrapBlock('quotation')
    } else {
      const fragment = document.getFragmentAtRange(Range.create({
        anchor: selection.anchor, focus: selection.focus,
      }))
      editor.insertBlock(Block.create({
        type: 'quotation',
        nodes: fragment.nodes as List<Block | Inline | Text>,
      }))
    }
  }

  private handleInsertLink = () => {
    this.openLinkModal()
  }

  private insertLink = (text: string, url: string) => {
    this.linkModal!.close()
    const editor = this.props.editor
    editor.insertInline(Inline.create({
      type: 'link',
      data: {
        url,
      },
      nodes: List([Text.create(text)]),
    }))
  }

  private insertPreformat = () => {
    const { editor, value: { selection, selection: { start }, startBlock } } = this.props

    if (startBlock && startBlock.type === 'preformat') {
      editor.setNodeByKey(startBlock.key, 'paragraph')
      return
    }

    if (selection.isCollapsed) {
      editor.insertBlock('preformat')
    } else {
      editor.moveToEnd()
        .splitBlock()
        .moveTo(start.path!, start.offset)
        .splitBlock()
        .setNodeByKey(editor.value.startBlock.key, 'preformat')
    }
  }

  private insertSourceElement = () => {
    this.props.editor.insertInline({ type: 'source_element', nodes: List([Text.create(' ')]) })
    this.props.editor.moveBackward()
  }

  private insertFootnote = () => {
    this.props.editor.insertInline({
      type: 'footnote',
      data: { collapse: false },
      nodes: List([Text.create(' ')]),
    })
    this.props.editor.moveBackward()
  }

  private validateParents = (validParents: string[]): boolean => {
    const { selectionParent: sp, value: { selection, anchorInline, focusInline } } = this.props
    if (!sp) return false
    if (validParents.includes(sp.type) || validParents.includes(sp.object)) return true
    if (selection.isExpanded) {
      if (validParents.includes('inline')) {
        if (anchorInline || focusInline) return true
      }
    }
    return false
  }
}

const unwrapChildrenFromNode = (editor: Editor, node: Node) => {
  const path = editor.value.document.getPath(node.key)
  if (!path) {
    console.warn(`unwrapChildrenFromNode: couldn't find path for node: ${node.toJS()}`)
    return
  }
  if (node.object === 'text') return
  node.nodes.forEach((n: Block | Inline) => {
    if (n && n.object === 'block' && n.type === 'title') {
      editor.setNodeByKey(n.key, { type: 'paragraph' })
    }
  })
  editor.unwrapChildrenByPath(path)
}

export default connect(mapStateToProps)(InsertTools)
