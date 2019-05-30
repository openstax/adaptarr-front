import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value, Node, Document, Block, Inline } from 'slate'

import FormatTools from '../FormatTools'
import DefinitionTools from '../DefinitionTools'
import MeaningTools from '../MeaningTools'
import SeeAlsoTools from '../SeeAlsoTools'
import TermTools from '../TermTools'

export type Props = {
  value: Value,
  editor: Editor,
}

class Toolbox extends React.Component<Props> {
  state: {
    selectionParent: Document | Block | Inline | null
  } = {
    selectionParent: null
  }

  componentDidUpdate(_: Props, prevState: {selectionParent: Document | Block | Inline | null}) {
    const prevSelPar = prevState.selectionParent
    const selPar = this.selectionParent()
    if ((!prevSelPar && selPar) || (prevSelPar && !selPar)) {
      this.setState({ selectionParent: selPar })
    } else if (prevSelPar && selPar && !prevSelPar.equals(selPar)) {
      this.setState({ selectionParent: selPar })
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

        <DefinitionTools editor={editor} value={value} />
        <MeaningTools editor={editor} value={value} />
        <SeeAlsoTools editor={editor} value={value} />
        <TermTools editor={editor} value={value} />
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
}

export default Toolbox
