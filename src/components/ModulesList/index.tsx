import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Module, Team } from 'src/api'
import { sortArrayByTitle } from 'src/helpers'

import ModuleInfo from 'src/components/ModuleInfo'
import Button from 'src/components/ui/Button'

import { ModulesMap } from 'src/store/types'
import { State } from 'src/store/reducers'

interface ModulesListProps {
  // Show only modules from specific team
  team?: Team | number
  modules: {
    modulesMap: ModulesMap
  }
  filter: string
  onModuleClick: (mod: Module) => any
  onModuleRemoveClick: (mod: Module) => any
}

const mapStateToProps = ({ modules }: State) => ({
  modules,
})

const ModulesList = (props: ModulesListProps) => {
  const filterReg = new RegExp(props.filter, 'gi')
  const modules: Module[] = []
  props.modules.modulesMap.forEach(mod => {
    if (filterReg.test(mod.title)) {
      if (
        props.team &&
        mod.team === (typeof props.team === 'number' ? props.team : props.team.id)
      ) {
        modules.push(mod)
      } else {
        modules.push(mod)
      }
    }
  })
  modules.sort(sortArrayByTitle)

  return (
    <div className="modulesList">
      {
        modules.length ?
          <ul className="modulesList__list">
            {
              modules.map(mod => (
                <SingleModule
                  key={mod.id}
                  mod={mod}
                  onModuleClick={props.onModuleClick}
                  onModuleRemove={props.onModuleRemoveClick}
                />
              ))
            }
          </ul>
          : null
      }
    </div>
  )
}

export default connect(mapStateToProps)(ModulesList)

interface SingleModuleProps {
  mod: Module
  onModuleClick: (mod: Module) => void
  onModuleRemove: (mod: Module) => void
}

const SingleModule = ({ mod, onModuleClick, onModuleRemove }: SingleModuleProps) => {
  const onClick = () => {
    onModuleClick(mod)
  }

  const onRemove = () => {
    onModuleRemove(mod)
  }

  return (
    <li className="modulesList__item">
      <span onClick={onClick}>
        <ModuleInfo mod={mod}/>
      </span>
      <Button type="danger" clickHandler={onRemove}>
        <Localized id="module-list-remove">
          Remove
        </Localized>
      </Button>
    </li>
  )
}
