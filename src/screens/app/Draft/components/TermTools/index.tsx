import * as React from 'react'
import { Editor, Value, Leaf, Text } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Input from 'src/components/ui/Input'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

export type Props = {
  editor: Editor,
  value: Value,
}

export type Term = {
  reference: string,
  leaf: Leaf,
  focusText: Text,
  offsetStart: number,
  offsetEnd: number,
}

type State = {
  // Index form of given term
  reference: string,
  term: Term | null,
}

export default class TermTools extends React.Component<Props> {
  state: State = {
    reference: '',
    term: null,
  }

  componentDidUpdate(_: Props, prevState: State) {
    const term = this.props.editor.getActiveTerm(this.props.value)
    if (JSON.stringify(term) !== JSON.stringify(prevState.term)) {
      this.setState({ term, reference: term ? term.reference : '' })
    }
  }

  componentDidMount() {
    const term = this.props.editor.getActiveTerm(this.props.value)
    this.setState({ term, reference: term ? term.reference : '' })
  }

  public render() {
    const term = this.props.editor.getActiveTerm(this.props.value)

    if (!term) return null

    return (
      <ToolGroup title="editor-tools-term-title">
        <label className="terms__label">
          <Localized id="editor-tools-term-label" $text={term.leaf.text}>
            Index form for ...
          </Localized>
          <Input
            value={this.state.reference}
            onChange={this.onChange}
          />
        </label>
        <Button
          className="terms__button"
          clickHandler={this.removeTerm}
        >
          <Icon name="close" />
          <Localized id="editor-tools-term-remove">
            Remove term
          </Localized>
        </Button>
      </ToolGroup>
    )
  }

  private isActiveTerm = () => {
    return this.props.value.marks.some(m => m ? m.type === 'term' : false)
  }

  private onChange = (val: string) => {
    this.setState({ reference: val }, this.changeReference)
  }

  private changeReference = () => {
    this.props.editor.changeTermReference(this.state.reference)
  }

  private removeTerm = () => {
    this.props.editor.removeTerm()
  }
}
