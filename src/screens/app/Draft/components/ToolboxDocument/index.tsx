import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value, Node, Document, Block, Inline } from 'slate'

import AdmonitionTools from '../AdmonitionTools'
import DocumentTools from '../DocumentTools'
import ExerciseTools from '../ExerciseTools'
import FigureTools from '../FigureTools'
import FormatTools from '../FormatTools'
import InsertTools from '../InsertTools'
import ListTools from '../ListTools'
import SectionTools from '../SectionTools'
import XrefTools from '../XrefTools'
import LinkTools from '../LinkTools'
import TermTools from '../TermTools'

import './index.css'

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
      <div className="toolbox">
        <Localized id="editor-toolbox-mulit-selection">
          Selection across elements is not yet supported.
        </Localized>
      </div>
    }

    return (
      <div className="toolbox" onMouseDown={this.onMouseDown}>
        <FormatTools editor={editor} value={value} selectionParent={selectionParent} />
        <InsertTools editor={editor} value={value} selectionParent={selectionParent} />

        <SectionTools editor={editor} value={value} />
        <AdmonitionTools editor={editor} value={value} />
        <ExerciseTools editor={editor} value={value} />
        <FigureTools editor={editor} value={value} />
        <ListTools editor={editor} value={value} />
        <XrefTools editor={editor} value={value} />
        <LinkTools editor={editor} value={value} />
        <TermTools editor={editor} value={value} />
        <DocumentTools editor={editor} value={value} />
      </div>
    )
  }

  // We do not want to lose selection from Editor when clicking on toolbox.
  private onMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
    const target = ev.target as HTMLElement
    if (target.tagName !== 'INPUT') {
      ev.preventDefault()
    }
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
