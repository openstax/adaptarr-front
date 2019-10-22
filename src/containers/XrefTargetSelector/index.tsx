import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor } from 'slate'

import * as api from 'src/api'

import LocalReferenceTargets from 'src/containers/LocalReferenceTargets'
import RemoteReferenceTargets from 'src/containers/RemoteReferenceTargets'

import { ReferenceTarget } from 'src/store/types'

import './index.css'

interface XrefTargetSelectorProps {
  /**
   * Current editor session.
   */
  editor: Editor,
  /**
   * Function to call when user selects a reference target.
   */
  onSelect: (target: ReferenceTarget | null, source: api.Module | null) => void,
}

export default class XrefTargetSelector extends React.Component<XrefTargetSelectorProps> {
  state: {
    tab: 'local' | 'remote',
  } = {
    tab: 'local',
  }

  render() {
    const { editor, onSelect } = this.props
    const { tab } = this.state

    return (
      <div className="reference-targets">
        <div className="tabs">
          <span
            className={`tabs__tab ${tab === 'local' ? 'selected' : ''}`}
            onClick={this.selectTabLocal}
          >
            <Localized id="reference-target-list-tab-local">
              This document
            </Localized>
          </span>
          <span
            className={`tabs__tab ${tab === 'remote' ? 'selected' : ''}`}
            onClick={this.selectTabRemote}
          >
            <Localized id="reference-target-list-tab-remote">
              Other documents
            </Localized>
          </span>
        </div>
        <div className={tab === 'local' ? 'visible' : 'hidden'}>
          <LocalReferenceTargets editor={editor} onSelect={onSelect} />
        </div>
        <div className={tab === 'remote' ? 'visible' : 'hidden'}>
          <RemoteReferenceTargets onSelect={onSelect} />
        </div>
      </div>
    )
  }

  selectTabLocal = () => this.setState({ tab: 'local' })

  selectTabRemote = () => this.setState({ tab: 'remote' })
}
