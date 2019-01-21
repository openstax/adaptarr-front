import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import * as api from 'src/api'

import Button from 'src/components/ui/Button'

import { State } from 'src/store/reducers'

type Props = {
  modules: {
    assignedToMe: api.Module[]
  }
  drafts: api.Draft[]
  onCreateDraft: (mod: api.Module) => any
}

const mapStateToProps = ({ modules }: State) => {
  return {
    modules,
  }
}

const assignedToMe = (props: Props) => {
  return (
    <div className="draftsList">
      {
        props.modules.assignedToMe.length ?
          <ul className="list draftsList__list">
            {
              props.modules.assignedToMe.map(mod => {
                return (
                  <li key={mod.id} className="list__item">
                    <span className="list__title">
                      {mod.title}
                    </span>
                    <span className="list__buttons">
                      {
                        props.drafts.some(draft => draft.module === mod.id) ?
                          <Button 
                            to={`/modules/${mod.id}`}
                          >
                            <Trans i18nKey="Buttons.viewDraft" />
                          </Button>
                        :
                          <Button
                            color="green"
                            clickHandler={() => props.onCreateDraft(mod)}
                          >
                            <Trans i18nKey="Buttons.newDraft" />
                          </Button>
                      }
                    </span>
                  </li>
                )
              })
            }
          </ul>
        : <Trans i18nKey="AssignedToMe.noAssigned"/>
      }
    </div>
  )
}

export default connect(mapStateToProps)(assignedToMe)
