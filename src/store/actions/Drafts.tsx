import { SET_CURRENT_DRAFT_LANG, SET_CURRENT_DRAFT_PERMISSIONS } from '../constants'
import { SlotPermission } from 'src/api/process'

export interface SetCurrentDraftLang {
  type: SET_CURRENT_DRAFT_LANG,
  data: string,
}

export interface SetCurrentDraftPermissions {
  type: SET_CURRENT_DRAFT_PERMISSIONS,
  data: SlotPermission[],
}

export type DraftsAction = SetCurrentDraftLang | SetCurrentDraftPermissions

export const setCurrentDraftLang = (code: string): SetCurrentDraftLang => {
  return {
    type: SET_CURRENT_DRAFT_LANG,
    data: code,
  }
}

export const setCurrentDraftPermissions = (permissions: SlotPermission[]): SetCurrentDraftPermissions => {
  return {
    type: SET_CURRENT_DRAFT_PERMISSIONS,
    data: permissions,
  }
}
