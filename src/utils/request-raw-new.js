import axios from 'axios'
// import { Message } from 'element-ui'
import Message from 'ant-design-vue/lib/message'
import { uuid } from './uuid'
import { removeToken } from '@/utils/auth'
import store from '@/store'
import Cookies from 'js-cookie'
const service = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Request-Id': uuid(),
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
})

// 添加一个请求拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent

    const { url } = config
    const _FD = url.indexOf('/fd/')
    const sys_plat = _FD > -1 ? 'apiV4' : 'adminV5Api'
    config.url = url + '?sys_plat=' + sys_plat
    return config
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    const { status: statusCode, data: body } = response

    const { status, data } = body
    if (status) {
      const { code, message } = status
      if (Number(code) === 0 && message === '没有登录') {
        const { iam_login_url = '' } = data || {}
        Message.warning(message)
        if (iam_login_url) {
          Cookies.remove('iam_jwt_token')
          return Promise.reject(data)
        } else {
          store.dispatch('delSession')
          removeToken()
          setTimeout(() => { window.location.href = '/login' }, 500)
        }
      }

      if (statusCode === 200) {
        if (code >= 0 && message) {
          if (parseInt(code, 10) !== 1) {
            if (code === 16149) {
              localStorage.removeItem('userInfo')
              store.dispatch('delSession')
              setTimeout(() => { window.location.href = '/login' }, 500)
            } else if (Number(code) === 0 && message === '用户不存在') {
              Message.warning(message)
              localStorage.removeItem('userInfo')
              store.dispatch('delSession')
              setTimeout(() => { window.location.href = '/login' }, 500)
            } else if (Number(code) === 0 && message === '没有登录') {
              Message.warning(message)
              localStorage.removeItem('userInfo')
              store.dispatch('delSession')
              setTimeout(() => { window.location.href = '/login' }, 500)
            } else {
              const dataMessage = JSON.stringify(data) === '[]' ? '' : data
              Message.warning(message || dataMessage)
            }
            return Promise.reject(data)
          }
        } else {
          Message.error(message)
          return Promise.reject(data)
        }
      } else {
        Message.error(message)
        return Promise.reject(data)
      }
    }

    return data
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
