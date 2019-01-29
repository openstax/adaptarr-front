import * as React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'

import * as api from 'src/api'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Spinner from 'src/components/Spinner'
import RefTargets from 'src/containers/ReferenceTargets'

import { ModulesMap, ReferenceTarget, ReferenceTargets } from 'src/store/types'
import { State } from 'src/store/reducers'
import { fetchReferenceTargets } from 'src/store/actions/Modules'

import './index.css'

export type Props = {
  modules: ModulesMap,
  targets: ReferenceTargets,
  /**
   * Function to call when user selects a resource target.
   */
  onSelect: (target: ReferenceTarget, source: null) => void,
  fetchReferenceTargets: (module: api.Module) => void,
}

const mapStateToProps = ({ modules: { modulesMap, referenceTargets } }: State) => ({
  modules: modulesMap,
  targets: referenceTargets,
})

const mapDispatchToProps = { fetchReferenceTargets }

/**
 * Display a list of reference targets located in any module.
 */
class RemoteReferenceTargets extends React.Component<Props> {
  state: {
    selected: api.Module | null,
  } = {
    selected: null,
  }

  render() {
    const { modules, onSelect } = this.props
    const { selected } = this.state
    const targets = selected ? this.props.targets.get(selected.id) : null

    if (targets != null) {
      return (
        <div className="remote-reference-targets">
          <Button clickHandler={this.unselectRefSource}>
            <Trans i18nKey="RemoteReferenceTargets.back" />
          </Button>
          <RefTargets
            module={selected}
            targets={targets}
            onSelect={onSelect}
            />
        </div>
      )
    }

    if (selected != null) {
      return (
        <div className="remote-reference-targets">
          <Spinner />
        </div>
      )
    }

    return (
      <div className="remote-reference-targets">
        {Array.from(modules.values(), module => (
          <RemoteSource
            key={module.id}
            module={module}
            onClick={this.selectRefSource}
            />
        ))}
      </div>
    )
  }

  selectRefSource = (ev: React.MouseEvent) => {
    let target = ev.target as HTMLElement | null
    while (target && !target.dataset.id) {
      target = target.parentElement
    }

    if (!target) return

    const id = target.dataset.id!
    const { targets, modules, fetchReferenceTargets } = this.props
    const selected = modules.get(id)!

    this.setState({ selected })

    if (targets.get(id) == null) {
      fetchReferenceTargets(selected)
    }
  }

  unselectRefSource = () => this.setState({ selected: null })
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoteReferenceTargets)

type RemoteSourceProps = {
  module: api.Module,
  onClick: (ev: React.MouseEvent) => void,
}

function RemoteSource({ module, onClick }: RemoteSourceProps) {
  return (
    <div
      className="remote-reference-target-source"
      data-id={module.id}
      onClick={onClick}
      >
      <span className="title">{module.title}</span>
      <Icon name='arrow-right' size='small' />
    </div>
  )
}
