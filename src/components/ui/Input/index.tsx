import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { validateEmail } from 'src/helpers'

import './index.css'

const leadingSpace = new RegExp(/^\s+/)

interface InputProps {
  onChange: (value: string | boolean) => void
  isValid?: (status: boolean) => void
  l10nId?: string,
  errorMessage?: string
  value?: string | boolean
  type?: string
  autoFocus?: boolean
  trim?: boolean
  disabled?: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    email?: boolean
    sameAs?: string
    custom?: (val: string) => boolean
  }
}

class Input extends React.Component<InputProps> {
  state: {
    touched: boolean
    inputVal: string
    focused: boolean
  } = {
    touched: false,
    inputVal: '',
    focused: false,
  }

  unTouch = () => {
    this.setState({ touched: false })
  }

  private changeInputVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.state.touched) {
      this.setState({ touched: true })
    }

    const input = e.target as HTMLInputElement
    if (this.props.type === 'checkbox') {
      this.setState({ inputVal: input.checked })
      this.props.onChange(input.checked)
    } else {
      if (this.props.trim) {
        this.setState({ inputVal: input.value.replace(leadingSpace, '') })
      } else {
        this.setState({ inputVal: input.value })
      }
      this.props.onChange(input.value)
    }
  }

  private onFocus = () => {
    this.setState({ focused: true })
  }

  private onBlur = () => {
    this.setState({ focused: false })
  }

  private validateInput = (): {status: boolean, classes: string} => {
    const { touched, inputVal, focused } = this.state
    const validation = this.props.validation

    let status = true
    const classes = ['input']

    if (validation) {
      if (touched) {
        if (validation.minLength) {
          if (inputVal.length < validation.minLength) {
            status = false
          }
        }
        if (validation.maxLength) {
          if (inputVal.length > validation.maxLength) {
            status = false
          }
        }
        if (validation.email) {
          if (!validateEmail(inputVal)) {
            status = false
          }
        }
        if (validation.sameAs) {
          if (inputVal !== validation.sameAs) {
            status = false
          }
        }
        if (validation.custom) {
          if (!validation.custom(inputVal)) {
            status = false
          }
        }

        if (status) {
          classes.push('valid')
        } else {
          classes.push('invalid')
        }
      }
    }

    if (this.props.isValid) {
      this.props.isValid(status)
    }

    if (focused) {
      classes.push('focused')
    }

    return { status, classes: classes.join(' ') }
  }

  componentDidUpdate = (prevProps: InputProps) => {
    const { value, trim } = this.props
    if (prevProps.value !== value) {
      if (typeof value === 'string') {
        if (trim) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ inputVal: value.replace(leadingSpace, '') })
        } else {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ inputVal: value })
        }
      } else {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ inputVal: this.props.value })
      }
    }
  }

  componentDidMount = () => {
    const { value, trim } = this.props
    if (value) {
      if (typeof value === 'string') {
        if (trim) {
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({ inputVal: value.replace(leadingSpace, '') })
        } else {
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({ inputVal: value })
        }
      } else {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ inputVal: this.props.value })
      }
    }
  }

  public render() {
    const { touched, inputVal } = this.state
    const { l10nId, errorMessage, type, autoFocus, disabled = false } = this.props

    const classes = this.validateInput().classes

    let input =
                <input
                  type={type ? type : 'text'}
                  value={inputVal}
                  autoFocus={typeof autoFocus === 'boolean' ? autoFocus : false}
                  onChange={this.changeInputVal}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  disabled={disabled}
                />

    if (l10nId) {
      input = <Localized id={l10nId} attrs={{ placeholder: true }}>
        {input}
      </Localized>
    }

    return (
      <div className={classes}>
        {input}
        {
          touched && !this.validateInput().status && errorMessage ?
            <span className="input__error">
              <Localized id={errorMessage}>
                {errorMessage}
              </Localized>
            </span>
            : null
        }
      </div>
    )
  }
}

export default Input
