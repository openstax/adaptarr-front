import * as React from 'react'
import { Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Input from 'src/components/ui/Input'
import Button from 'src/components/ui/Button'

import { OnToggle } from '../ToolboxDocument'
import { OnToggle as OnToggleGlossary } from '../ToolboxGlossary'

import './index.css'

interface TermToolsProps {
  editor: Editor
  value: Value
  toggleState: boolean
  onToggle: OnToggle | OnToggleGlossary
}

interface TermToolsState {
  // Index form of given term
  reference: string,
}

export default class TermTools extends React.Component<TermToolsProps> {
  state: TermToolsState = {
    reference: '',
  }

  componentDidUpdate(_: TermToolsProps, prevState: TermToolsState) {
    const term = this.getActiveTerm()
    if (term && term.data.get('reference') !== prevState.reference) {
      const reference = term.data.get('reference') ? term.data.get('reference') : term.text
      if (reference !== prevState.reference) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ reference })
      }
    }
  }

  componentDidMount() {
    const term = this.getActiveTerm()
    if (term) {
      const reference = term.data.get('reference') ? term.data.get('reference') : term.text
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ reference })
    }
  }

  private onClickToggle = () => {
    this.props.onToggle('termTools')
  }

  public render() {
    const term = this.getActiveTerm()

    if (!term) return null

    return (
      <ToolGroup
        title="editor-tools-term-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <label className="terms__label">
          <span className="terms__title">
            <Localized id="editor-tools-term-label">
              Index form
            </Localized>
          </span>
          <Input
            value={this.state.reference}
            onChange={this.onChange}
          />
        </label>
        <Button
          className="terms__button"
          clickHandler={this.removeTerm}
        >
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
        reference: this.state.reference,
      },
    })
  }

  private removeTerm = () => {
    const term = this.getActiveTerm()
    if (!term) return
    this.props.editor.unwrapInlineByKey(term.key, { type: 'term', data: term.data.toJS() })
  }
}
