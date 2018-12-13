import axios from 'axios'

const instance = axios.create({
  baseURL: '/api/v1/'
})

instance.interceptors.request.use((config) => {
  config.headers = {
    'Content-Type': 'application/json',
  }

  return config
})

export default instance
