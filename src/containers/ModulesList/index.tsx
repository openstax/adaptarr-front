import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import Button from '../../components/ui/Button'
import ModuleInfo from '../../components/ModuleInfo'
import Icon from '../../components/ui/Icon'

import { ModulesMap, ModuleShortInfo } from '../../store/types'
import { State } from '../../store/reducers'

type Props = {
  modulesMap: {
    modulesMap: ModulesMap
  }
  onModuleClick: (mod: ModuleShortInfo) => any
}

const mapStateToProps = ({ modulesMap }: State) => {
  return {
    modulesMap,
  }
}

class ModuleList extends React.Component<Props> {

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

  public render() {
    const modulesMap = this.props.modulesMap.modulesMap

    return (
      <div className="modulesList">
        <div className="modulesList__new">
          <input type="text" placeholder="Title" />
          <Button>
            <Icon name="plus" />
            <Trans i18nKey="Buttons.addNew" />
          </Button>
        </div>
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

export default connect(mapStateToProps)(ModuleList)
