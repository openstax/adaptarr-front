import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import { ProcessSlot } from 'src/api/process'
import Role from 'src/api/role'
import { State } from 'src/store/reducers'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import './index.css'

type SlotProps = {
  roles: Role[]
  slot: ProcessSlot
  onChange: (slot: ProcessSlot) => any
  remove: (slot: ProcessSlot) => any
}

const mapStateToProps = ({ app: { roles } }: State) => {
  return {
    roles,
  }
}

class Slot extends React.Component<SlotProps> {
  state: {
    name: string
    autofill: boolean
    role: number | null
  } = {
    name: '',
    autofill: false,
    role: null,
  }

  private updateStateWithProps = () => {
    const slot = this.props.slot
    this.setState({
      name: slot.name,
      autofill: slot.autofill,
      role: slot.role,
    })
  }

  componentDidUpdate(prevProps: SlotProps) {
    const prevSlot = prevProps.slot
    const slot = this.props.slot
    
    if (JSON.stringify(prevSlot) !== JSON.stringify(slot)) {
      this.updateStateWithProps()
    }
  }

  componentDidMount() {
    this.updateStateWithProps()
  }

  public render() {
    const { name, autofill, role } = this.state
    const { roles } = this.props

    return (
      <div className="process-slot">
        <div className="process-form__title">
          <h3>
            <Localized id="process-form-slot-name">
              Slot name:
            </Localized>
          </h3>
          <div className="process-form__title-controls">
            <Button clickHandler={this.removeSlot} color="red">
              <Icon name="minus" />
            </Button>
          </div>
        </div>
        <label>
          <Input
            value={name}
            onChange={this.handleNameChange}
            validation={{ minLength: 1 }}
          />
        </label>
        <label>
          <span>
            <Localized id="process-form-slot-autofill">
              Autofill:
            </Localized>
          </span>
          <Input
            type="checkbox"
            value={autofill}
            onChange={this.handleAutofillChange}
          />
        </label>
        <label>
          <span>
            <Localized id="process-form-slot-role">
              Role:
            </Localized>
          </span>
          <Select
            value={roles.find(r => r.id === role)}
            options={this.props.roles}
            onChange={this.handleRoleChange}
            getOptionLabel={getOptionLabel}
          />
        </label>
      </div>
    )
  }

  private removeSlot = () => {
    this.props.remove(this.props.slot)
  }

  private handleNameChange = (name: string) => {
    this.setState({ name })
    this.props.onChange({
      ...this.props.slot,
      name,
    })
  }

  private handleAutofillChange = (autofill: boolean) => {
    this.setState({ autofill })
    this.props.onChange({
      ...this.props.slot,
      autofill,
    })
  }

  private handleRoleChange = ({ id }: Role) => {
    this.setState({ role: id })
    this.props.onChange({
      ...this.props.slot,
      role: id,
    })
  }
}

export default connect(mapStateToProps)(Slot)

function getOptionLabel({ name }: Role) {
  return name
}
