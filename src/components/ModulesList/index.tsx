import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import * as api from 'src/api'
import sortArrayByTitle from 'src/helpers/sortArrayByTitle'

import ModuleInfo from 'src/components/ModuleInfo'
import Button from 'src/components/ui/Button'

import { ModulesMap } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  modules: {
    modulesMap: ModulesMap
  }
  filter: string
  onModuleClick: (mod: api.Module) => any
  onModuleRemoveClick: (mod: api.Module) => any
}

const mapStateToProps = ({ modules }: State) => {
  return {
    modules,
  }
}

const modulesList = (props: Props) => {
  const filterReg = new RegExp('^' + props.filter, 'i')
  let modules: api.Module[] = []
  props.modules.modulesMap.forEach(mod => {
    if (filterReg.test(mod.title)) {
      modules.push(mod)
    }
  })
  modules.sort(sortArrayByTitle)

  return (
    <div className="modulesList">
      {
        modules.length ?
          <ul className="modulesList__list">
            {
              modules.map(mod => {
                return (
                  <li
                    key={mod.id}
                    className="modulesList__item"
                  >
                    <span onClick={() => props.onModuleClick(mod)}>
                      <ModuleInfo mod={mod}/>
                    </span>
                    <Button type="danger" clickHandler={() => props.onModuleRemoveClick(mod)}>
                      <Localized id="module-list-remove">
                        Remove
                      </Localized>
                    </Button>
                  </li>
                )
              })
            }
          </ul>
        : null
      }
    </div>
  )
}

export default connect(mapStateToProps)(modulesList)
