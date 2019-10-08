import { DraftsAction } from 'src/store/actions/drafts'
import { SET_CURRENT_DRAFT_LANG, SET_CURRENT_DRAFT_PERMISSIONS } from 'src/store/constants'
import { SlotPermission } from 'src/api/process'

export interface State {
  currentDraftLang: string
  currentDraftPermissions: SlotPermission[]
}

export const initialState: State = {
  currentDraftLang: 'en',
  currentDraftPermissions: [],
}

// eslint-disable-next-line default-param-last
export function reducer(state: State = initialState, action: DraftsAction) {
  switch (action.type) {
  case SET_CURRENT_DRAFT_LANG:
    return {
      ...state,
      currentDraftLang: action.data,
    }

  case SET_CURRENT_DRAFT_PERMISSIONS:
    return {
      ...state,
      currentDraftPermissions: action.data,
    }

  default:
    return state
  }
}
