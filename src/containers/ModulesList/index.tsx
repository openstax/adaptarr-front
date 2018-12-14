import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import axios from 'src/config/axios'

import Button from 'src/components/ui/Button'
import ModuleInfo from 'src/components/ModuleInfo'
import Icon from 'src/components/ui/Icon'

import { ModulesMap, ModuleShortInfo } from 'src/store/types'
import { State } from 'src/store/reducers'
import AdminUI from 'src/components/AdminUI'
import SuperSession from 'src/components/SuperSession'

import { FetchModulesMap, fetchModulesMap } from 'src/store/actions/Modules'

type Props = {
  modulesMap: {
    modulesMap: ModulesMap
  }
  onModuleClick: (mod: ModuleShortInfo) => any
  fetchModulesMap: () => void
}

const mapStateToProps = ({ modulesMap }: State) => {
  return {
    modulesMap,
  }
}

const mapDispatchToProps = (dispatch: FetchModulesMap) => {
  return {
    fetchModulesMap: () => dispatch(fetchModulesMap()),
  }
}

class ModuleList extends React.Component<Props> {

  state: {
    moduleTitleValue: string
    showSuperSession: boolean
  } = {
    moduleTitleValue: '',
    showSuperSession: false,
  }

  private listOfModules = (modulesMap: ModulesMap) => {
    let modules: ModuleShortInfo[] = []

    modulesMap.forEach(mod => {
      modules.push(mod)
    })

    return modules.map((mod: ModuleShortInfo) => {
      return (
        <li key={mod.id} className="modulesList__item">
          <ModuleInfo mod={mod} onClick={() => this.handleModuleClick(mod)}/>
        </li>
      )
    })
  }

  private handleModuleClick = (mod: ModuleShortInfo) => {
    console.log('handleModuleClick', mod.title)
    this.props.onModuleClick(mod)
  }

  private updateModuleTitleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ moduleTitleValue: e.target.value })
  }

  private addNewModule = () => {
    axios.post('modules', {title: this.state.moduleTitleValue})
      .then(res => {
        this.props.onModuleClick(res.data)
        this.props.fetchModulesMap()
      })
      .catch(e => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
        } else {
          console.error(e.message)
        }
      })
  }

  private superSessionSuccess = () => {
    this.addNewModule()
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    console.log('failure', e.message)
  }

  public render() {
    const { moduleTitleValue, showSuperSession } = this.state
    const modulesMap = this.props.modulesMap.modulesMap

    return (
      <div className="modulesList">
        {
          showSuperSession ?
            <SuperSession
              onSuccess={this.superSessionSuccess} 
              onFailure={this.superSessionFailure}
              onAbort={() => this.setState({ showSuperSession: false })}/>
          : null
        }
        <AdminUI>
          <div className="modulesList__new">
            <input 
              type="text" 
              placeholder="Title"
              value={moduleTitleValue}
              onChange={(e) => this.updateModuleTitleValue(e)} />
            <Button 
              isDisabled={moduleTitleValue.length === 0}
              clickHandler={this.addNewModule}
            >
              <Icon name="plus" />
              <Trans i18nKey="Buttons.addNew" />
            </Button>
          </div>
        </AdminUI>
        {
          modulesMap.size > 0 ?
            <ul className="modulesList__list">
              {this.listOfModules(modulesMap)}
            </ul>
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModuleList)
