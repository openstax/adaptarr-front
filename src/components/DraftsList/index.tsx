import * as React from 'react'
import { Trans } from 'react-i18next'

import * as api from 'src/api'

import Button from 'src/components/ui/Button'

type Props = {
  drafts: api.Draft[]
  onDraftDeleteClick: (draft: api.Draft) => any
}

const draftsList = (props: Props) => {
  return (
    <div className="draftsList">
      {
        props.drafts.length ?
          <ul className="list draftsList__list">
            {
              props.drafts.map(draft => {
                return (
                  <li key={draft.module} className="list__item">
                    <span className="list__title">
                      {draft.title}
                    </span>
                    <span className="list__buttons">
                      <Button 
                        to={`/drafts/${draft.module}`}
                      >
                        <Trans i18nKey="Buttons.viewDraft" />
                      </Button>
                      <Button
                        color="red"
                        clickHandler={() => props.onDraftDeleteClick(draft)}
                      >
                        <Trans i18nKey="Buttons.delete" />
                      </Button>
                    </span>
                  </li>
                )
              })
            }
          </ul>
        : <Trans i18nKey="DraftsList.noDraftsFound"/>
      }
    </div>
  )
}

export default draftsList
