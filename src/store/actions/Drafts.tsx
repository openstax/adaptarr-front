import axios from 'src/config/axios'

import { RequestStatus } from 'src/store/types'

export const createDraft = async (id: string): Promise<RequestStatus> => {
  const res: RequestStatus = await axios.post(`modules/${id}`)
    .then(res => {
      return {status: 'OK', message: res.data}
    })
    .catch(e => {
      console.log('createDraft():', e.message)
      return {status: 'ERROR', message: e.message}
    })
  
  return res
}

export const deleteDraft = async (id: string): Promise<RequestStatus> => {
  const res: RequestStatus = await axios.delete(`modules/${id}`)
    .then(res => {
      return {status: 'OK', message: res.data}
    })
    .catch(e => {
      console.log('deleteDraft():', e.message)
      return {status: 'ERROR', message: e.message}
    })
  
  return res
}
