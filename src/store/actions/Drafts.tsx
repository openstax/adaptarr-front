import axios from '../../config/axios'

import { RequestStatus } from '../types'

export const createDraft = async (id: string): Promise<RequestStatus> => {
  const res: RequestStatus = await axios.post(`modules/${id}`)
    .then(res => {
      return {status: res.status, message: res.data}
    })
    .catch(e => {
      console.log('createDraft():', e.message)
      return {status: res.status, message: e.message}
    })
  
  return res
}

export const deleteDraft = async (id: string): Promise<RequestStatus> => {
  const res: RequestStatus = await axios.delete(`modules/${id}`)
    .then(res => {
      return {status: res.status, message: res.data}
    })
    .catch(e => {
      console.log('deleteDraft():', e.message)
      return {status: res.status, message: e.message}
    })
  
  return res
}
