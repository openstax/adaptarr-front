import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import validateEmail from 'src/helpers/validateEmail'

type Props = {
  onChange: (value: string) => void
  isValid?: (status: boolean) => void
  l10nId?: string,
  errorMessage?: string
  value?: string
  type?: string
  autoFocus?: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    email?: boolean
    sameAs?: string
    custom?: (val: string) => boolean
  }
}

class Input extends React.Component<Props> {
  state: {
    touched: boolean
    inputVal: string
    focused: boolean
  } = {
    touched: false,
    inputVal: '',
    focused: false,
  }

  private changeInputVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.state.touched) {
      this.setState({ touched: true })
    }

    const input = e.target as HTMLInputElement
    this.setState({ inputVal: input.value })
    this.props.onChange(input.value)
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
    let classes = ['input']

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

    return {status, classes: classes.join(' ')}
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.value !== this.props.value) {
      this.setState({ inputVal: this.props.value })
    }
  }

  componentDidMount = () => {
    const value = this.props.value
    if (value) {
      this.setState({ inputVal: value})
    }
  }

  public render() {
    const { touched, inputVal } = this.state
    const { l10nId, errorMessage, type, autoFocus } = this.props

    const classes = this.validateInput().classes

    let input = <input
      type={type ? type : 'text'}
      value={inputVal}
      autoFocus={typeof autoFocus === 'boolean' ? autoFocus : false}
      onChange={this.changeInputVal}
      onFocus={this.onFocus}
      onBlur={this.onBlur}
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
            <span className="input__error"><Localized id={errorMessage} /></span>
          : null
        }
      </div>
    )
  }
}

export default Input
