import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Role from 'src/api/role'
import { ProcessSlot } from 'src/api/process'

import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

import './index.css'

interface SlotProps {
  roles: Role[]
  slot: ProcessSlot
  onChange: (slot: ProcessSlot) => any
  remove: (slot: ProcessSlot) => any
}

interface SlotState {
  name: string
  autofill: boolean
  selectedRoles: Set<number>
}

class Slot extends React.Component<SlotProps> {
  state: SlotState = {
    name: '',
    autofill: false,
    selectedRoles: new Set(),
  }

  private updateStateWithProps = () => {
    const slot = this.props.slot
    this.setState({
      name: slot.name,
      autofill: slot.autofill,
      selectedRoles: new Set(slot.roles),
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
    const { name, autofill, selectedRoles } = this.state
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
            <Button type="danger" clickHandler={this.removeSlot}>
              <Localized id="process-form-remove">
                Remove
              </Localized>
            </Button>
          </div>
        </div>
        <label>
          <Input
            value={name}
            onChange={this.handleNameChange}
            validation={{ minLength: 1 }}
            trim={true}
          />
        </label>
        <label>
          <span>
            <Localized id="process-form-slot-autofill">
              Automatically assign users:
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
              Roles:
            </Localized>
          </span>
          <div className="process-slot__roles">
            {
              roles.map(r => (
                <Button
                  key={r.id}
                  clickHandler={this.handleRoleClick}
                  dataId={r.id.toString()}
                  className={`process-slot__role ${selectedRoles.has(r.id) ? 'selected' : ''}`}
                >
                  {r.name}
                </Button>
              ))
            }
          </div>
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

  private handleRoleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const roleId = Number(e.currentTarget.dataset.id)
    if (!roleId) return

    this.setState((prevState: SlotState) => {
      const selectedRoles = prevState.selectedRoles
      if (selectedRoles.has(roleId)) {
        selectedRoles.delete(roleId)
      } else {
        selectedRoles.add(roleId)
      }

      this.props.onChange({
        ...this.props.slot,
        roles: Array.from(selectedRoles),
      })

      return { selectedRoles }
    })
  }
}

export default Slot
