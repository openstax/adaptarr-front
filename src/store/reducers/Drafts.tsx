import { DraftsAction } from 'src/store/actions/Drafts'
import { SET_CURRENT_DRAFT_LANG } from 'src/store/constants'

export interface State {
  currentDraftLang: string
}

export const initialState: State = {
  currentDraftLang: 'en'
}

export function reducer (state: State = initialState, action: DraftsAction) {
  switch (action.type) {
    case SET_CURRENT_DRAFT_LANG:
      return {
        ...state,
        currentDraftLang: action.data,
      }
  }
  return state
}
