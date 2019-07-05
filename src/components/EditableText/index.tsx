import * as React from 'react'

import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
  text: string
  onAccept: (text: string) => void
}

class EditableText extends React.Component<Props> {
  state: {
    text: string,
    focused: boolean,
  } = {
    text: '',
    focused: false,
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
              <span onClick={this.onSubmit}>
                <Icon size="medium" name="check" />
              </span>
              <span onClick={this.cancelEdit}>
                <Icon size="medium" name="close" />
              </span>
            </div>
          : null
        }
      </form>
    )
  }

  private handleNameChange = (e: React.FormEvent<HTMLSpanElement>) => {
    const text = e.currentTarget.innerText
    this.setState({ text })
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
    this.props.onAccept(this.state.text)
  }

  private cancelEdit = () => {
    this.setState({ text: this.props.text })
    this.textRef.current!.innerText = this.props.text
  }
}

export default EditableText