import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Block, Document, Editor, Inline, Node, Value } from 'slate'

import FormatTools from '../FormatTools'
import ForeignTools from '../ForeignTools'
import HighlightTools from '../HighlightTools'
import DefinitionTools from '../DefinitionTools'
import MeaningTools from '../MeaningTools'
import SeeAlsoTools from '../SeeAlsoTools'
import SuggestionsTools from '../SuggestionTools'
import TermTools from '../TermTools'
import GlossaryTools from '../GlossaryTools'
import { onMouseDown } from '../ToolboxDocument'

interface ToolboxProps {
  value: Value,
  editor: Editor,
}

type ToolName =
  'termTools' |
  'meaningTools' |
  'seeAlsoTools' |
  'definitionTools' |
  'glossaryTools' |
  'suggestionsTools' |
  'highlightTools' |
  'foreignTools'

export type OnToggle = (toolName: ToolName, state?: boolean) => void

interface ToolboxState {
  selectionParent: Document | Block | Inline | null
  definitionTools: boolean
  foreignTools: boolean
  termTools: boolean
  meaningTools: boolean
  seeAlsoTools: boolean
  glossaryTools: boolean
  suggestionsTools: boolean
  highlightTools: boolean
}

/**
 * Default state for tools' togglers
 */
const DEFAULT_TOGGLERS = {
  definitionTools: true,
  foreignTools: false,
  termTools: false,
  meaningTools: false,
  seeAlsoTools: false,
  glossaryTools: false,
  suggestionsTools: true,
  highlightTools: true,
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
        <FormatTools
          editor={editor}
          value={value}
          selectionParent={selectionParent}
          showSwitchableTypes={false}
        />

        <DefinitionTools
          editor={editor}
          value={value}
          toggleState={this.state.definitionTools}
          onToggle={this.toggleTool}
        />
        <ForeignTools
          editor={editor}
          value={value}
          toggleState={this.state.foreignTools}
          onToggle={this.toggleTool}
        />
        <TermTools
          editor={editor}
          value={value}
          toggleState={this.state.termTools}
          onToggle={this.toggleTool}
        />
        <MeaningTools
          editor={editor}
          value={value}
          toggleState={this.state.meaningTools}
          onToggle={this.toggleTool}
        />
        <SeeAlsoTools
          editor={editor}
          value={value}
          toggleState={this.state.seeAlsoTools}
          onToggle={this.toggleTool}
        />
        <GlossaryTools
          editor={editor}
          value={value}
          toggleState={this.state.glossaryTools}
          onToggle={this.toggleTool}
        />

        <SuggestionsTools
          editor={editor}
          value={value}
          toggleState={this.state.suggestionsTools}
          onToggle={this.toggleTool}
        />
        <HighlightTools
          editor={editor}
          value={value}
          toggleState={this.state.highlightTools}
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
    const newState = {}
    if (typeof state === 'boolean') {
      if (state !== this.state[toolName]) {
        newState[toolName] = state
        this.setState({ termTools: state })
      }
      return
    }
    newState[toolName] = !this.state[toolName]
    this.setState(newState)
  }

  private toggleDeepestTool = (node: Document | Block | Inline | null) => {
    if (!node) {
      return
    }

    const newState = { ...DEFAULT_TOGGLERS }

    switch (node.type) {
    case 'suggestion_insert':
    case 'suggestion_delete':
      newState.suggestionsTools = true
      newState.glossaryTools = false
      break
    case 'foreignTools':
      newState.foreignTools = true
      break
    case 'term':
      newState.termTools = true
      break
    case 'definition_meaning':
      newState.meaningTools = true
      break
    case 'definition_seealso':
      newState.seeAlsoTools = true
      break
    case 'definition_term': {
      // Toggle depends on parent
      const path = this.props.value.document.getPath(node.key)
      const titleParent = path ? this.props.value.document.getParent(path) as Block | null : null
      if (titleParent) {
        if (titleParent.type === 'definition') {
          newState.definitionTools = true
        } else if (titleParent.type === 'definition_seealso') {
          newState.seeAlsoTools = true
        }
      }
      break
    }
    case 'definition':
      newState.definitionTools = true
      break
    case 'highlight':
      newState.highlightTools = true
      break
    default:
      newState.definitionTools = true
      newState.glossaryTools = true
      break
    }

    this.setState(newState)
  }
}

export default Toolbox
