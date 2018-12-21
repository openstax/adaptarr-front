import * as React from 'react'

import validateEmail from 'src/helpers/validateEmail'

type Props = {
  onChange: (value: string) => void
  isValid?: (status: boolean) => void
  errorMessage?: string
  placeholder?: string
  value?: string
  type?: string
  autoFocus?: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    email?: boolean
    sameAs?: string
  }
}

class Input extends React.Component<Props> {
  state: {
    touched: boolean
    inputVal: string
  } = {
    touched: false,
    inputVal: '',
  }

  private changeInputVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.state.touched) {
      this.setState({ touched: true })
    }

    const input = e.target as HTMLInputElement
    this.setState({ inputVal: input.value })
    this.props.onChange(input.value)
  }

  private validateInput = (): {status: boolean, classes: string} => {
    const { touched, inputVal } = this.state
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

    return {status, classes: classes.join(' ')}
  }

  componentDidMount = () => {
    const value = this.props.value
    if (value) {
      this.setState({ inputVal: value})
    }
  }

  public render() {
    const { touched, inputVal } = this.state
    const { errorMessage, placeholder, type, autoFocus } = this.props
  
    const classes = this.validateInput().classes
    
    return (
      <div className={classes}>
        <input
          type={type ? type : 'text'}
          placeholder={placeholder ? placeholder : ''}
          value={inputVal}
          autoFocus={typeof autoFocus === 'boolean' ? autoFocus : false}
          onChange={this.changeInputVal}
        />
        {
          touched && !this.validateInput().status ?
            <span className="input__error">{errorMessage}</span>
          : null
        }
      </div>
    )
  }
}

export default Input
