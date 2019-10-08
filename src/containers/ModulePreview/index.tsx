import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'

import * as api from 'src/api'

import { updateImgSrcs } from 'src/helpers'

import { AlertDataKind } from 'src/store/types'
import { addAlert } from 'src/store/actions/alerts'

interface ModulePreviewProps {
  moduleId: string
  addAlert: (kind: AlertDataKind, message: string) => void
}

const mapDispatchToProps = (dispatch: any) => ({
  addAlert: (kind: AlertDataKind, message: string) => dispatch(addAlert(kind, message)),
})

interface ModulePreviewState {
  index: string
  files?: string[]
}

class ModulePreview extends React.Component<ModulePreviewProps> {
  state: ModulePreviewState = {
    index: 'Loading...',
  }

  private fetchModuleFiles = () => {
    api.Module.load(this.props.moduleId)
      .then(module => Promise.all([
        module.files(),
        module.read('index.cnxml'),
      ]))
      .then(([_, index]) => this.setState({ index }))
      .catch(e => {
        this.setState({
          index: `There is no index.cnxml file for this module. Details: {e.message}`,
        })
        this.props.addAlert('error', e.message)
      })
  }

  componentDidUpdate = (prevProps: ModulePreviewProps) => {
    if (prevProps.moduleId !== this.props.moduleId) {
      this.fetchModuleFiles()
    }
  }

  componentDidMount = () => {
    this.fetchModuleFiles()
  }

  public render() {
    const { index } = this.state

    return (
      <div
        className="modulePreview cnxml"
        dangerouslySetInnerHTML={{ __html: updateImgSrcs(index, this.props.moduleId) }}
      />
    )
  }
}

export default connect(mapDispatchToProps)(ModulePreview)
