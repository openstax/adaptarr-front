import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'

import i18n from 'src/i18n'
import axios from 'src/config/axios'

import updateImgSrcs from 'src/helpers/updateImgSrcs'

import { RequestInfoKind } from 'src/store/types'
import { addAlert } from 'src/store/actions/Alerts'

type Props = {
  moduleId: string
  addAlert: (kind: RequestInfoKind, message: string) => void
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addAlert: (kind: RequestInfoKind, message: string) => dispatch(addAlert(kind, message)),
  }
}

class ModulePreview extends React.Component<Props> {
  
  state: {
    index: string
    files: string[]
  } = {
    index: 'Loading...',
    files: [],
  }

  private fetchModuleFiles = () => {
    axios.get(`modules/${this.props.moduleId}/files/index.cnxml`)
      .then(res => {
        this.setState({ index: res.data })
      })
      .catch(e => {
        this.setState({ index: i18n.t("Module.fetchError", {details: e.message}) })
        this.props.addAlert('error', e.message)
      })

    axios.get(`modules/${this.props.moduleId}/files`)
      .then(res => {
        this.setState({ files: res.data })
      })
      .catch(e => {
        this.props.addAlert('error', i18n.t("Module.fetchFilesError", {details: e.message}))
      })
  }

  componentDidUpdate = (prevProps: Props) => {
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
        dangerouslySetInnerHTML={{__html: updateImgSrcs(index, this.props.moduleId)}}
      >
      </div>
    )
  }
}

export default connect(mapDispatchToProps)(ModulePreview)
