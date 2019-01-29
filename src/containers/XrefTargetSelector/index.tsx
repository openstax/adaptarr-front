import * as React from 'react'
import { Trans } from 'react-i18next'
import { Editor } from 'slate'

import * as api from 'src/api'

import LocalReferenceTargets from 'src/containers/LocalReferenceTargets'
import RemoteReferenceTargets from 'src/containers/RemoteReferenceTargets'

import { ReferenceTarget } from 'src/store/types'

import './index.css'

export type Props = {
  /**
   * Current editor session.
   */
  editor: Editor,
  /**
   * Function to call when user selects a reference target.
   */
  onSelect: (target: ReferenceTarget, source: api.Module | null) => void,
}

export default class XrefTargetSelector extends React.Component<Props> {
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
            className={tab === 'local' ? 'selected' : ''}
            onClick={this.selectTabLocal}
            >
            <Trans i18nKey="XrefTargetSelector.tabName.local" />
          </span>
          <span
            className={tab === 'remote' ? 'selected' : ''}
            onClick={this.selectTabRemote}
            >
            <Trans i18nKey="XrefTargetSelector.tabName.remote" />
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
