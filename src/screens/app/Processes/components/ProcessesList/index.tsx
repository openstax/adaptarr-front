import * as React from 'react'
import { connect } from 'react-redux'

import Process from 'src/api/process'

import { State } from 'src/store/reducers'

import ProcessInfo from './ProcessInfo'

import './index.css'

interface ProcessesListProps {
  processes: Map<number, Process>
  selectedTeams: number[]
  activePreview?: number
  onProcessEdit: (process: Process) => void
  onShowPreview: (process: Process) => void
}

const mapStateToProps = ({ app: { processes, selectedTeams } }: State) => ({
  processes,
  selectedTeams,
})

const ProcessesList = (
  { activePreview, selectedTeams, onProcessEdit, onShowPreview, processes }: ProcessesListProps
) => (
  <ul className="processes__list">
    {
      Array.from(processes.values()).map(p => (
        <ProcessListItem
          key={p.id}
          process={p}
          activePreview={activePreview}
          selectedTeams={selectedTeams}
          onProcessEdit={onProcessEdit}
          onShowPreview={onShowPreview}
        />
      ))
    }
  </ul>
)

export default connect(mapStateToProps)(ProcessesList)

interface ProcessesListItemProps {
  process: Process
  selectedTeams: number[]
  activePreview?: number
  onProcessEdit: (p: Process) => void
  onShowPreview: (p: Process) => void
}

const ProcessListItem = (
  { process, selectedTeams, activePreview, onProcessEdit, onShowPreview }: ProcessesListItemProps
) => {
  if (!selectedTeams.includes(process.team)) return null

  const editProcess = () => {
    onProcessEdit(process)
  }

  const previewProcess = () => {
    onShowPreview(process)
  }

  return (
    <li className={`processes__item ${process.id === activePreview ? 'active' : ''}`}>
      <ProcessInfo
        process={process}
        onProcessEdit={editProcess}
        onProcessPreview={previewProcess}
      />
    </li>
  )
}
