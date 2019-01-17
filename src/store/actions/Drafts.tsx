import { Module, Draft } from 'src/api'

import { RequestStatus } from 'src/store/types'

export async function createDraft(of: Module): Promise<RequestStatus> {
  try {
    const draft = await of.createDraft()
    return {status: 'OK', message: draft}
  } catch (e) {
    console.log('createDraft():', e.message)
    return {status: 'ERROR', message: e.message}
  }
}

export async function deleteDraft(draft: Draft): Promise<RequestStatus> {
  try {
    await draft.delete()
    return {status: 'OK'}
  } catch (e) {
    console.log('deleteDraft():', e.message)
    return {status: 'ERROR', message: e.message}
  }
}
