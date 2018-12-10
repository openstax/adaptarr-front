import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://adaptarr.test/api/v1/',
})

export default instance
