import request from '@/utils/requestTag'

export default {
  post(url, data, config) {
    return request({
      url,
      method: 'POST',
      data,
      config
    })
  },
  put(url, data) {
    return request({
      url,
      method: 'PUT',
      data
    })
  },
  delete(url, data) {
    return request({
      url,
      method: 'DELETE',
      data
    })
  },
  get(url, params) {
    return request({
      url,
      method: 'GET',
      params
    })
  }
}
