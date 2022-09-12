import axios from 'axios'
// import { Message } from 'element-ui'
import Message from 'ant-design-vue/lib/message'
import { removeToken } from '@/utils/auth'
const service = axios.create({
  baseURL: '/api', // api 的 base_url
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
})
// 添加一个请求拦截器
service.interceptors.request.use(config => {
  const { url } = config
  const sys_plat = url.includes('/fd/') ? 'apiV4' : 'adminV5Api'
  config.url = url + '?sys_plat=' + sys_plat
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
      if (code && (message || errorMsg)) {
        if (Number(code) !== 1) {
          if (code === 16149) {
            this.dispatch('delSession')
            removeToken()
            setTimeout(() => {
              window.location.href = '/login'
            }, 500)
          } else if (Number(code) === 0 && message || errorMsg === '用户不存在') {
            Message.warning(message || errorMsg)
            this.dispatch('delSession')
            removeToken()
            setTimeout(() => { window.location.href = '/login' }, 500)
          } else if (Number(code) === 0 && message || errorMsg === '没有登录') {
            Message.warning(message || errorMsg)
            this.dispatch('delSession')
            removeToken()
            setTimeout(() => { window.location.href = '/login' }, 500)
          } else if (
            Number(code) === 0 &&
            message === 'mongo: no documents in result'
          ) {
            //
          } else {
            Message.warning(message || errorMsg)
          }
          return Promise.reject(code)
        }
      } else {
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
