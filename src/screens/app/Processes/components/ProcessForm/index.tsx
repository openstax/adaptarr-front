import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import Team, { TeamID } from 'src/api/team'
import Process, {
  ProcessSlot,
  ProcessStep,
  ProcessStructure,
  SlotPermission,
} from 'src/api/process'

import { State } from 'src/store/reducers'
import { TeamsMap } from 'src/store/types'

import ProcessSlots from '../ProcessSlots'
import ProcessSteps from '../ProcessSteps'
import TeamSelector from 'src/components/TeamSelector'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

import './index.css'

interface ProcessFormProps {
  structure?: ProcessStructure | null
  process?: Process
  teams: TeamsMap
  onSubmit: (structure: ProcessStructure, team: TeamID) => any
  onCancel: () => any
}

const mapStateToProps = ({ app: { teams } }: State) => ({
  teams,
})

interface ProcessFormState {
  name: string
  team: Team | null
  startingStep: number
  slots: ProcessSlot[]
  steps: ProcessStep[]
  errors: Set<string>
}

class ProcessForm extends React.Component<ProcessFormProps> {
  state: ProcessFormState = {
    name: '',
    team: null,
    startingStep: 0,
    slots: [],
    steps: [],
    errors: new Set(),
  }

  private handleNameChange = (name: string) => {
    this.setState({ name }, () => {
      if (this.state.errors.size) {
        // We validate form every each change only if validation failed before.
        // This way user is able to see that errors, are updating when he make actions.
        this.validateForm()
      }
    })
  }

  private handleTeamChange = (team: Team) => {
    this.setState({ team }, () => {
      if (this.state.errors.size) {
        this.validateForm()
      }
    })
  }

  private handleStartingStepChange = ({ value }: { value: number, label: string }) => {
    this.setState({ startingStep: value }, () => {
      if (this.state.errors.size) {
        this.validateForm()
      }
    })
  }

  private handleSlotsChange = (slots: ProcessSlot[]) => {
    this.setState({ slots }, () => {
      if (this.state.errors.size) {
        this.validateForm()
      }
    })
  }

  private handleStepsChange = (steps: ProcessStep[]) => {
    this.setState({ steps }, () => {
      if (this.state.errors.size) {
        this.validateForm()
      }
    })
  }

  private onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!this.validateForm()) return

    const { name, startingStep, slots, steps, team } = this.state

    if (!team) return

    this.props.onSubmit({
      start: startingStep,
      name,
      slots,
      steps,
    }, team.id)
  }

  private updateStructure = () => {
    const { structure: s, process, teams } = this.props
    if (s) {
      this.setState({
        name: s.name,
        startingStep: s.start,
        slots: s.slots,
        steps: s.steps,
      })
    }
    if (!compareTeams(process ? process.team : null, this.state.team)) {
      if (!process) {
        this.setState({ team: null })
      } else if (teams.has(process.team)) {
        this.setState({ team: teams.get(process.team) })
      } else {
        this.setState({ team: null })
        console.error(`Couldn find team with id: ${process.team}`)
      }
    }
  }

  componentDidUpdate(prevProps: ProcessFormProps) {
    const prevTeam = prevProps.process ? prevProps.process.team : null
    const currTeam = this.props.process ? this.props.process.team : null
    if (
      !compareTeams(prevTeam, currTeam) ||
      !compareStructures(prevProps.structure, this.props.structure)
    ) {
      this.updateStructure()
    }
  }

  componentDidMount() {
    this.updateStructure()
  }

  public render() {
    const { startingStep, slots, steps, errors, name, team } = this.state
    const { teams, process } = this.props

    return (
      <form
        className="process-form"
        onSubmit={this.onSubmit}
      >
        <div className="controls">
          <Button
            clickHandler={this.onSubmit}
            isDisabled={errors.size > 0}
          >
            {
              !this.props.structure ?
                <Localized id="process-form-create">
                  Create process
                </Localized>
                :
                <Localized id="process-form-save-changes">
                  Save changes
                </Localized>
            }
          </Button>
          <Button clickHandler={this.props.onCancel}>
            <Localized id="process-form-cancel">
              Cancel
            </Localized>
          </Button>
        </div>
        {
          errors.size ?
            <ul className="process-form__errors">
              {
                [...errors].map(e => <li key={e}><Localized id={e}>{e}</Localized></li>)
              }
            </ul>
            : null
        }
        <label>
          <h3>
            <Localized id="process-form-process-name">
              Process name
            </Localized>
          </h3>
          <Input
            value={name}
            onChange={this.handleNameChange}
            validation={{ minLength: 1 }}
            trim={true}
          />
        </label>
        <label>
          <h3>
            <Localized id="process-form-process-team">
              Team
            </Localized>
          </h3>
          <TeamSelector
            isDisabled={process !== undefined}
            team={process ? teams.get(process.team) : undefined}
            permission="editing-process:edit"
            onChange={this.handleTeamChange}
          />
        </label>
        <label>
          <h3>
            <Localized id="process-form-process-starting-step">
              Starting step
            </Localized>
          </h3>
          <Select
            className="react-select"
            value={
              startingStep >= 0 && steps[startingStep]
                ? { value: startingStep, label: steps[startingStep].name }
                : null
            }
            options={steps.map((s, i) => ({
              value: i,
              label: s.name,
            }))}
            onChange={this.handleStartingStepChange}
          />
        </label>
        <div className="process-form__split">
          <ProcessSlots
            slots={slots}
            roles={team ? team.roles : []}
            onChange={this.handleSlotsChange}
          />
          <ProcessSteps
            steps={steps}
            slots={this.state.slots}
            onChange={this.handleStepsChange}
          />
        </div>
      </form>
    )
  }

  private validateForm = (): boolean => {
    // List with l10n ids for error messages.
    const errors: Set<string> = new Set()

    const { name, startingStep, slots, steps, team } = this.state

    if (!team) {
      errors.add('process-form-error-team')
    }

    // Validate that name for process exists.
    if (!name.length) {
      errors.add('process-form-error-name')
    }

    slots.some(s => {
      if (!s.name.length) {
        errors.add('process-form-error-slot-name')
        return true
      }
      return false
    })

    // Validate that starting step exists and have links.
    if (steps[startingStep]) {
      if (!steps[startingStep].links.length) {
        errors.add('process-form-error-starting-step-no-links')
      }
    } else {
      errors.add('process-form-error-starting-step')
    }

    // Validate that slots and steps have minimum length
    if (!slots.length) {
      errors.add('process-form-error-slots-min')
    }

    if (steps.length < 2) {
      errors.add('process-form-error-steps-min')
    }

    // Validate steps
    // Validate if there is finish step...
    let stepsWithoutLinks = 0
    steps.forEach((s, i) => {
      // If there is propose-changes or accept-changes slot then the second one
      // is also required. Edit permission cannot exists with them.
      const permissions: Set<SlotPermission> = new Set()
      s.slots.forEach(sl => {
        permissions.add(sl.permission)

        // Slots have to be filled.
        if (!sl.permission || typeof sl.slot !== 'number') {
          errors.add('process-form-error-step-slot-permission-or-slot')
        }
      })

      // Step with propose changes have to be linking to step with accept changes.
      if (permissions.has('propose-changes')) {
        const linkedSteps = s.links.map(l => l.to)
        const permissionsInLS: Set<SlotPermission> = new Set()
        linkedSteps.forEach(l => {
          if (l) {
            steps[l].slots.forEach(s => permissionsInLS.add(s.permission))
          }
        })
        if (!permissionsInLS.has('accept-changes')) {
          errors.add('process-form-error-propose-and-no-accept')
        }
      }

      // Step with accept changes have to be linked from step with propose changes.
      if (permissions.has('accept-changes')) {
        let isLinkedFromStepWithProposeChanges: boolean = false
        steps.forEach((st, inx) => {
          if (st.links.some(l => l.to === i)) {
            // If this step is linking to step with accept-changes then check
            // if it have slot with permission propose-changes
            if (st.slots.some(sl => sl.permission === 'propose-changes')) {
              isLinkedFromStepWithProposeChanges = true
            }
          }
        })
        if (!isLinkedFromStepWithProposeChanges) {
          errors.add('process-form-error-accept-and-no-propose')
        }
      }

      if (
        permissions.has('edit') &&
        (permissions.has('propose-changes') ||
        permissions.has('accept-changes'))
      ) {
        errors.add('process-form-error-edit-and-changes')
      }

      // Validate that name of step exists.
      if (!s.name.length) {
        errors.add('process-form-error-step-name')
      }

      // Validate if there is finish step...
      if (s.links.length === 0) {
        stepsWithoutLinks++
      }

      // Slots and links have to be filled.
      s.links.forEach(l => {
        if (!l.name.length) {
          errors.add('process-form-error-step-link-name')
        }
        if (typeof l.to !== 'number' || typeof l.slot !== 'number') {
          errors.add('process-form-error-step-link-to-or-slot')
        }
      })
    })

    // Validate if there is finish step...
    if (stepsWithoutLinks === 0) {
      errors.add('process-form-error-no-finish')
    }

    // Update state
    this.setState({ errors })

    if (!errors.size) return true
    return false
  }
}

export default connect(mapStateToProps)(ProcessForm)

/**
 * Return true if teams are the same.
 */
function compareTeams(team1?: Team | number | null, team2?: Team | number | null): boolean {
  if (team1 instanceof Team && team2 instanceof Team) {
    if (team1.id === team2.id) return true
    return false
  }
  if (team1 === team2) return true
  return false
}

/**
 * Return true if strucutres are the same.
 */
function compareStructures(s1?: ProcessStructure | null, s2?: ProcessStructure | null): boolean {
  if (!s1 && !s2) return true
  if (typeof s1 !== typeof s2) return false
  if (
    s1!.name !== s2!.name ||
    s1!.start !== s2!.start ||
    !compareSlots(s1!.slots, s2!.slots) ||
    !compareSteps(s1!.steps, s2!.steps)
  ) return false
  return true
}

function compareSlots(s1: ProcessSlot[], s2: ProcessSlot[]): boolean {
  if (s1.length !== s2.length) return false
  return s1.every((el, i) => {
    const el2 = s2[i]
    if (
      el.id !== el2.id ||
      el.name !== el2.name ||
      el.autofill !== el2.autofill ||
      !el.roles.every((r1, ri) => {
        if (r1 !== el2.roles[ri]) return false
        return true
      })
    ) return false
    return true
  })
}

function compareSteps(s1: ProcessStep[], s2: ProcessStep[]): boolean {
  if (s1.length !== s2.length) return false
  return s1.every((el, i) => {
    const el2 = s2[i]
    if (
      el.id !== el2.id ||
      el.name !== el2.name ||
      !el.links.every((l1, li) => {
        if (
          l1.name !== el2.links[li].name ||
          l1.to !== el2.links[li].to ||
          l1.slot !== el2.links[li].slot
        ) return false
        return true
      }) ||
      !el.slots.every((s1, si) => {
        if (
          s1.permission !== el2.slots[si].permission ||
          s1.slot !== el2.slots[si].slot
        ) return false
        return true
      })
    ) return false
    return true
  })
}
