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

type State = {
  // Index form of given term
  reference: string,
}

export default class TermTools extends React.Component<Props> {
  state: State = {
    reference: '',
  }

  componentDidUpdate(_: Props, prevState: State) {
    const term = this.getActiveTerm()
    if (term && term.data.get('reference') !== prevState.reference) {
      const reference = term.data.get('reference') ? term.data.get('reference') : term.text
      if (reference !== prevState.reference) {
        this.setState({ reference })
      }
    }
  }

  componentDidMount() {
    const term = this.getActiveTerm()
    if (term) {
      const reference = term.data.get('reference') ? term.data.get('reference') : term.text
      this.setState({ reference })
    }
  }

  public render() {
    const term = this.getActiveTerm()

    if (!term) return null

    return (
      <ToolGroup title="editor-tools-term-title">
        <label className="terms__label">
          <Localized id="editor-tools-term-label">
            Index form
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

  private getActiveTerm = () => {
    const inline = this.props.value.startInline
    if (!inline) return null
    return inline.type === 'term' ? inline : null
  }

  private onChange = (val: string) => {
    this.setState({ reference: val }, this.changeReference)
  }

  private changeReference = () => {
    const term = this.getActiveTerm()
    if (!term) return

    this.props.editor.setNodeByKey(term.key, {
      type: 'term',
      data: {
        reference: this.state.reference
      }
    })
  }

  private removeTerm = () => {
    const term = this.getActiveTerm()
    if (!term) return
    this.props.editor.unwrapInlineByKey(term.key, { type: 'term', data: term.data.toJS() })
  }
}
