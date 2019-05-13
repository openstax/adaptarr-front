import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { Draft } from 'src/api'
import { Link } from 'src/api/process'

import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  draft: Draft
  onStepChange: () => any
}

class StepChanger extends React.Component<Props> {
  state: {
    link: Link | null
  } = {
    link: null,
  }

  public render() {
    const { step } = this.props.draft
    const link = this.state.link

    return (
      step && <div className="step-changer">
        <h3 className="step-changer__title">
          <Localized id="step-changer-choose">
            Choose link:
          </Localized>
        </h3>
        <div className="step-changer__select-link">
          <Select
            value={link !== null ? {value: link, label: link.name} : null}
            options={step.links.map(l => {return {value: l, label: l.name}})}
            onChange={this.handleStepChange}
          />
        </div>
        <div className="step-changer__controls">
          <Button
            clickHandler={this.nextStep}
            isDisabled={!link}
          >
            <Localized id="step-changer-move">
              Move using selected link
            </Localized>
          </Button>
        </div>
      </div>
    )
  }

  private handleStepChange = ({ value: link }: {value: Link, label: string}) => {
    this.setState({ link })
  }

  private nextStep = () => {
    const link = this.state.link
    if (!link) return
    this.props.draft.advance({ target: link.to, slot: link.slot })
      .then((res) => {
        store.dispatch(addAlert('success', 'step-changer-success', {
          code: res.code.replace(/:/g, '-'),
        }))
        this.props.onStepChange()
      })
      .catch(e => {
        store.dispatch(addAlert('error', 'step-changer-error', {
          details: e.response.data.error,
        }))
      })
  }
}

export default StepChanger
