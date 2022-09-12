import request from './request-raw-new'
// import qs from 'qs'

export default {
  post(url, data, params, config) {
    return request({
      url,
      method: 'POST',
      data,
      params,
      config
    })
  },
  put(url, data, params) {
    return request({
      url,
      method: 'PUT',
      data,
      params
    })
  },
  delete(url, data, params) {
    return request({
      url,
      method: 'DELETE',
      data,
      params
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
