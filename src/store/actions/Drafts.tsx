import { Module, Draft } from 'src/api'

import { RequestStatus } from 'src/store/types'

export async function deleteDraft(draft: Draft): Promise<RequestStatus> {
  try {
    await draft.delete()
    return {status: 'OK'}
  } catch (e) {
    console.log('deleteDraft():', e.message)
    return {status: 'ERROR', message: e.message}
  }
}
