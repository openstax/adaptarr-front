import { SET_CURRENT_DRAFT_LANG } from '../constants'

export interface SetCurrentDraftLang {
  type: SET_CURRENT_DRAFT_LANG,
  data: string,
}

export type DraftsAction = SetCurrentDraftLang

export const setCurrentDraftLang = (code: string): SetCurrentDraftLang => {
  return {
    type: SET_CURRENT_DRAFT_LANG,
    data: code,
  }
}
