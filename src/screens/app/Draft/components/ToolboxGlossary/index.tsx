import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value, Node, Document, Block, Inline } from 'slate'

import FormatTools from '../FormatTools'
import DefinitionTools from '../DefinitionTools'
import MeaningTools from '../MeaningTools'
import SeeAlsoTools from '../SeeAlsoTools'
import TermTools from '../TermTools'
import GlossaryTools from '../GlossaryTools'

export type Props = {
  value: Value,
  editor: Editor,
}

type ToolName = 'termTools' | 'meaningTools' | 'seeAlsoTools' | 'definitionTools' | 'glossaryTools'

export type OnToggle = (toolName: ToolName, state?: boolean) => void

type State = {
  selectionParent: Document | Block | Inline | null
  definitionTools: boolean
  termTools: boolean
  meaningTools: boolean
  seeAlsoTools: boolean
  glossaryTools: boolean
}

/**
 * Default state for tools' togglers
 */
const DEFAULT_TOGGLERS = {
  definitionTools: true,
  termTools: false,
  meaningTools: false,
  seeAlsoTools: false,
  glossaryTools: false,
}

class Toolbox extends React.Component<Props> {
  state: State = {
    selectionParent: null,
    ...DEFAULT_TOGGLERS,
  }

  componentDidUpdate(_: Props, prevState: State) {
    const prevSelPar = prevState.selectionParent
    const selPar = this.selectionParent()
    if (
      ((!prevSelPar && selPar) || (prevSelPar && !selPar))
      || (prevSelPar && selPar && (prevSelPar.key !== selPar.key))
    ) {
      this.setState({ selectionParent: selPar })
      this.toggleDeepestTool(selPar as Document | Block | Inline | null)
    }
  }

  componentDidMount() {
    this.setState({ selectionParent: this.selectionParent() })
  }

  public render() {
    const { value: { selection }, editor, value } = this.props
    const { selectionParent } = this.state

    if (!selection.isFocused) return null

    if (selection.start.key !== selection.end.key) {
      return (
        <div className="toolbox">
          <Localized id="editor-toolbox-mulit-selection">
            Selection across elements is not yet supported.
          </Localized>
        </div>
      )
    }

    return (
      <div className="toolbox" onMouseDown={ev => ev.preventDefault()}>
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
      if (p1 && p1.object === 'block' || p1.object === 'inline') {
        if (p1.type === 'paragraph') return false
        return !!document.getClosest(b.key, p2 => p1 === p2)
      }
      return false
    }) || document
  }

  private toggleTool = (toolName: ToolName, state?: boolean) => {
    let newState = {}
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

    let newState = {...DEFAULT_TOGGLERS}

    switch (node.type) {
      case 'term':
        newState.termTools = true
        break
      case 'definition_meaning':
        newState.meaningTools = true
        break
      case 'definition_seealso':
        newState.seeAlsoTools = true
        break
      case 'definition_term':
        // Toggle depends on parent
        const path = this.props.value.document.getPath(node.key)
        const titleParent = this.props.value.document.getParent(path) as Block | null
        if (titleParent) {
          if (titleParent.type === 'definition') {
            newState.definitionTools = true
          } else if (titleParent.type === 'definition_seealso') {
            newState.seeAlsoTools = true
          }
        }
        break
      case 'definition':
        newState.definitionTools = true
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
