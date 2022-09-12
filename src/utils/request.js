import axios from 'axios'
import Message from 'ant-design-vue/lib/message'
import { removeToken } from '@/utils/auth'
const service = axios.create({
  baseURL: '/api',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
})

// 添加一个请求拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  const { url } = config
  const _FD = url.indexOf('/fd/')
  const sys_plat = _FD > -1 ? 'apiV4' : 'adminV5Api'
  config.url = url + '?sys_plat=' + sys_plat
  return config
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const { status: statusCode, data: body } = response
    const { status, data } = body
    const { code, message } = status

    if (Number(code) === 0 && message === '没有登录') {
      Message.warning(message)
      this.dispatch('delSession')
      removeToken()
      setTimeout(() => { window.location.href = '/login' }, 500)
    }

    if (statusCode === 200) {
      if (code && message) {
        if (parseInt(code, 10) !== 1) {
          if (code === 16149) {
            this.dispatch('delSession')
            removeToken()
            setTimeout(() => { window.location.href = '/login' }, 500)
          } else if (Number(code) === 0 && message === '用户不存在') {
            Message.warning(message)
            this.dispatch('delSession')
            removeToken()
            setTimeout(() => { window.location.href = '/login' }, 500)
          } else if (Number(code) === 0 && message === '没有登录') {
            Message.warning(message)
            this.dispatch('delSession')
            removeToken()
            setTimeout(() => { window.location.href = '/login' }, 500)
          } else if (
            Number(code) === 0 &&
            message === 'mongo: no documents in result'
          ) {
            //
          } else {
            Message.warning(message)
          }
          return Promise.reject(message)
        }
      } else {
        Message.error(message)
        return Promise.reject(message)
      }
    } else {
      Message.error(message)
      return Promise.reject(message)
    }

    if (data && data.data) {
      return data.data
    } else {
      return data
    }
  },
  error => {
    Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service
