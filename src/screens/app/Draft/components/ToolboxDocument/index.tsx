import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Block, Document, Editor, Inline, Node, Value } from 'slate'

import AdmonitionTools from '../AdmonitionTools'
import CodeTools from '../CodeTools'
import DocumentTools from '../DocumentTools'
import ExerciseTools from '../ExerciseTools'
import FigureTools from '../FigureTools'
import FormatTools from '../FormatTools'
import FootnoteTools from '../FootnoteTools'
import ForeignTools from '../ForeignTools'
import HighlightTools from '../HighlightTools'
import InsertTools from '../InsertTools'
import ListTools from '../ListTools'
import SectionTools from '../SectionTools'
import SuggestionsTools from '../SuggestionTools'
import XrefTools from '../XrefTools'
import DocrefTools from '../DocrefTools'
import LinkTools from '../LinkTools'
import TermTools from '../TermTools'
import SourceTools from '../SourceTools'

import './index.css'

interface ToolboxProps {
  value: Value,
  editor: Editor,
}

type ToolName =
  'insertTools' |
  'suggestionsTools' |
  'codeTools' |
  'termTools' |
  'linkTools' |
  'xrefTools' |
  'docrefTools' |
  'listTools' |
  'sourceTools' |
  'admonitionTools' |
  'exerciseTools' |
  'figureTools' |
  'footnoteTools' |
  'foreignTools' |
  'highlightTools' |
  'sectionTools' |
  'documentTools' |
  'quotationTools'

export type OnToggle = (toolName: ToolName, state?: boolean) => void

interface ToolboxState {
  selectionParent: Document | Block | Inline | null
  // Togglers for components:
  insertTools: boolean
  suggestionsTools: boolean
  codeTools: boolean
  termTools: boolean
  linkTools: boolean
  xrefTools: boolean
  docrefTools: boolean
  footnoteTools: boolean
  foreignTools: boolean
  highlightTools: boolean
  sourceTools: boolean
  listTools: boolean
  quotationTools: boolean
  admonitionTools: boolean
  exerciseTools: boolean
  figureTools: boolean
  sectionTools: boolean
  documentTools: boolean
}

/**
 * Default state for tools' togglers
 */
const DEFAULT_TOGGLERS = {
  insertTools: false,
  suggestionsTools: true,
  codeTools: true,
  termTools: true,
  linkTools: true,
  xrefTools: true,
  docrefTools: true,
  footnoteTools: true,
  foreignTools: true,
  highlightTools: true,
  sourceTools: true,
  listTools: false,
  quotationTools: false,
  admonitionTools: false,
  exerciseTools: false,
  figureTools: false,
  sectionTools: false,
  documentTools: false,
}

class Toolbox extends React.Component<ToolboxProps> {
  state: ToolboxState = {
    selectionParent: null,
    ...DEFAULT_TOGGLERS,
  }

  componentDidUpdate(_: ToolboxProps, prevState: ToolboxState) {
    const prevSelPar = prevState.selectionParent
    const selPar = this.selectionParent()
    if (
      ((!prevSelPar && selPar) || (prevSelPar && !selPar))
      || (prevSelPar && selPar && (prevSelPar.key !== selPar.key))
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selectionParent: selPar })
      this.toggleDeepestTool(selPar as Document | Block | Inline | null)
    }
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ selectionParent: this.selectionParent() })
  }

  public render() {
    const { editor, value } = this.props
    const { selectionParent } = this.state

    if (!editor) {
      return (
        <div className="toolbox">
          <Localized id="editor-toolbox-no-selection">
            Please select editor to show toolbox.
          </Localized>
        </div>
      )
    }

    return (
      <div className="toolbox" onMouseDown={onMouseDown}>
        <FormatTools editor={editor} value={value} selectionParent={selectionParent} />
        <InsertTools
          editor={editor}
          value={value}
          selectionParent={selectionParent}
          toggleState={this.state.insertTools}
          onToggle={this.toggleTool}
        />

        <SuggestionsTools
          editor={editor}
          value={value}
          toggleState={this.state.suggestionsTools}
          onToggle={this.toggleTool}
        />

        <CodeTools
          editor={editor}
          value={value}
          toggleState={this.state.codeTools}
          onToggle={this.toggleTool}
        />
        <TermTools
          editor={editor}
          value={value}
          toggleState={this.state.termTools}
          onToggle={this.toggleTool}
        />
        <LinkTools
          editor={editor}
          value={value}
          toggleState={this.state.linkTools}
          onToggle={this.toggleTool}
        />
        <XrefTools
          editor={editor}
          value={value}
          toggleState={this.state.xrefTools}
          onToggle={this.toggleTool}
        />
        <DocrefTools
          editor={editor}
          value={value}
          toggleState={this.state.docrefTools}
          onToggle={this.toggleTool}
        />
        <FootnoteTools
          editor={editor}
          value={value}
          toggleState={this.state.footnoteTools}
          onToggle={this.toggleTool}
        />
        <ForeignTools
          editor={editor}
          value={value}
          toggleState={this.state.foreignTools}
          onToggle={this.toggleTool}
        />
        <HighlightTools
          editor={editor}
          value={value}
          toggleState={this.state.highlightTools}
          onToggle={this.toggleTool}
        />
        <SourceTools
          editor={editor}
          value={value}
          toggleState={this.state.sourceTools}
          onToggle={this.toggleTool}
        />
        <ListTools
          editor={editor}
          value={value}
          toggleState={this.state.listTools}
          onToggle={this.toggleTool}
        />
        {/* <QuotationTools
          editor={editor}
          value={value}
          toggleState={this.state.quotationTools}
          onToggle={this.toggleTool}
        /> */}
        <AdmonitionTools
          editor={editor}
          value={value}
          toggleState={this.state.admonitionTools}
          onToggle={this.toggleTool}
        />
        <ExerciseTools
          editor={editor}
          value={value}
          toggleState={this.state.exerciseTools}
          onToggle={this.toggleTool}
        />
        <FigureTools
          editor={editor}
          value={value}
          toggleState={this.state.figureTools}
          onToggle={this.toggleTool}
        />
        <SectionTools
          editor={editor}
          value={value}
          toggleState={this.state.sectionTools}
          onToggle={this.toggleTool}
        />
        <DocumentTools
          editor={editor}
          value={value}
          toggleState={this.state.documentTools}
          onToggle={this.toggleTool}
        />
      </div>
    )
  }

  // Find Lowest Common Ancestor for start and end of selection.
  // We omit Text and Paragraphs.
  private selectionParent = (): Node | null => {
    const { selection: { start, end }, document } = this.props.value
    if (!start.key || !end.key) return null
    const a = document.getNode(start.key)
    const b = document.getNode(end.key)

    if (!a || !b) return null

    return document.getClosest(a.key, p1 => {
      if ((p1 && p1.object === 'block') || p1.object === 'inline') {
        if (p1.type === 'paragraph') return false
        return Boolean(document.getClosest(b.key, p2 => p1 === p2))
      }
      return false
    }) || document
  }

  private toggleTool = (toolName: ToolName, state?: boolean) => {
    if (typeof state === 'boolean') {
      if (state !== this.state[toolName]) {
        this.setState({ [toolName]: state })
      }
      return
    }
    this.setState((prevState: ToolboxState) => ({ [toolName]: !prevState[toolName] }))
  }

  private toggleDeepestTool = (node: Document | Block | Inline | null) => {
    if (!node) {
      return
    }

    const newState = { ...DEFAULT_TOGGLERS }
    if (node.object === 'block') {
      newState.insertTools = true
    }

    switch (node.type) {
    case 'suggestion_insert':
    case 'suggestion_delete':
      newState.suggestionsTools = true
      newState.insertTools = false
      break
    case 'code':
      newState.codeTools = true
      break
    case 'term':
      newState.termTools = true
      break
    case 'link':
      newState.linkTools = true
      break
    case 'xref':
      newState.xrefTools = true
      break
    case 'docref':
      newState.docrefTools = true
      break
    case 'footnote':
      newState.footnoteTools = true
      break
    case 'foreign':
      newState.foreignTools = true
      break
    case 'highlight':
      newState.highlightTools = true
      break
    case 'source_element':
      newState.sourceTools = true
      break
    case 'list':
    case 'list_item':
      newState.listTools = true
      break
    case 'admonition':
      newState.admonitionTools = true
      break
    case 'exercise':
    case 'exercise_problem':
    case 'exercise_solution':
    case 'exercise_commentary':
      newState.exerciseTools = true
      break
    case 'figure':
    case 'figure_caption':
    case 'image':
    case 'media_alt':
      newState.figureTools = true
      newState.insertTools = false
      break
    case 'section':
      newState.sectionTools = true
      break
    case 'title': {
      // Toggle depends on parent
      const path = this.props.value.document.getPath(node.key)
      const titleParent = path ? this.props.value.document.getParent(path) as Block | null : null
      if (titleParent) {
        if (titleParent.type === 'admonition') {
          newState.admonitionTools = true
        } else if (titleParent.type === 'quotation') {
          newState.quotationTools = true
        } else if (titleParent.type === 'section') {
          newState.sectionTools = true
        }
      }
      break
    }
    case 'quotation':
      newState.quotationTools = true
      break
    default:
      newState.insertTools = true
      newState.documentTools = true
      break
    }

    this.setState(newState)
  }
}

export default Toolbox

// We do not want to lose selection from Editor when clicking on toolbox.
export const onMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
  const target = ev.target as HTMLElement
  if (target.tagName !== 'INPUT') {
    ev.preventDefault()
  }
}
