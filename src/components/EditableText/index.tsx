import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
  text: string
  minLength?: number,
  maxLength?: number,
  onAccept: (text: string) => void
}

type EditableTextError = 'min-length' | 'max-length'

class EditableText extends React.Component<Props> {
  state: {
    text: string,
    focused: boolean,
    errors: EditableTextError[],
  } = {
    text: '',
    focused: false,
    errors: [],
  }

  componentDidUpdate(prevProps: Props) {
    const prevText = prevProps.text
    const text = this.props.text
    if (prevText !== text) {
      this.setState({ text: this.props.text })
    }
  }

  componentDidMount() {
    this.setState({ text: this.props.text })
  }

  textRef: React.RefObject<HTMLSpanElement> = React.createRef()

  public render() {
    return (
      <form
        className="editable-text"
        onSubmit={this.onSubmit}
      >
        <div className="editable-text__input">
          <span
            className="editable-text__content"
            contentEditable
            onInput={this.handleNameChange}
            onKeyDown={this.onKeyDown}
            dangerouslySetInnerHTML={{ __html: this.props.text }}
            ref={this.textRef}
          ></span>
          {
            this.state.text !== this.props.text ?
              <div className="editable-text__controls">
                <span onClick={this.onSubmit} className={this.state.errors.length ? 'disabled' : ''}>
                  <Icon size="medium" name="check" />
                </span>
                <span onClick={this.cancelEdit}>
                  <Icon size="medium" name="close" />
                </span>
              </div>
            : null
          }
        </div>
        {
          this.state.errors.length ?
            <div className="editable-text__errors">
              {
                this.state.errors.map(e => (
                  <span key={e} className="editable-text__error">
                    <Localized
                      id={`editable-text-error-${e}`}
                      $min={this.props.minLength}
                      $max={this.props.maxLength}
                    >
                      {e}
                    </Localized>
                  </span>
                ))
              }
            </div>
          : null
        }
      </form>
    )
  }

  private handleNameChange = (e: React.FormEvent<HTMLSpanElement>) => {
    const { minLength, maxLength } = this.props
    const errors: EditableTextError[] = []
    const text = e.currentTarget.innerText
    if (minLength && text.length < minLength) {
      errors.push('min-length')
    }
    if (maxLength && text.length > maxLength) {
      errors.push('max-length')
    }
    this.setState({ text, errors })
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        this.onSubmit()
        break
      case 'Escape':
        this.cancelEdit()
        break
      default:
        return
    }
  }

  private onSubmit = () => {
    const { minLength, maxLength } = this.props
    const text = this.state.text
    if (
      (minLength && text.length < minLength)
      || (maxLength && text.length > maxLength)
    ) {
      return
    }
    this.props.onAccept(this.state.text)
  }

  private cancelEdit = () => {
    this.setState({ text: this.props.text, errors: [] })
    this.textRef.current!.innerText = this.props.text
  }
}

export default EditableText