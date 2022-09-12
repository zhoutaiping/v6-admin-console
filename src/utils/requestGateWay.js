import axios from 'axios'
// import { Message } from 'element-ui'
import Message from 'ant-design-vue/lib/message'
import { removeToken } from '@/utils/auth'

const service = axios.create({
  baseURL: '/gateway', // api 的 base_url
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
})
// 添加一个请求拦截器
service.interceptors.request.use(config => {
  var md5 = require('md5')
  const time = new Date().getTime().toString().substring(0, 10)
  config.headers['GatewayToken'] = md5('gateway_dyf_ztp' + time) + time
  return config
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const { status: statusCode, data: body } = response

    const { status = {}, data } = body
    const { code, message, errorMsg } = status
    if (Number(code) === 0 && message === '没有登录') {
      Message.warning(message)
      this.dispatch('delSession')
      removeToken()
      setTimeout(() => { window.location.href = '/login' }, 500)
    }

    if (statusCode === 200) {
      if (code !== 1 && (message || errorMsg)) {
        Message.error(message || errorMsg)
        return Promise.reject(code)
      }
    } else {
      Message.error(message || errorMsg)
      return Promise.reject(code)
    }
    return data || body
  },
  error => {
    // console.log(error)
    Message.error(error.message || error.errorMsg)
    return Promise.reject(error)
  }
)

export default service
