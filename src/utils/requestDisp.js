import axios from 'axios'
import Message from 'ant-design-vue/lib/message'
const service = axios.create({
  baseURL: '/s_disp',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
})
// 添加一个请求拦截器
service.interceptors.request.use(config => {
  config.withCredentials = true
  return config
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const { status: statusCode, data: body } = response
    const { data } = body
    const { code, msg } = response.data
    const filert_msg = ['mongo: no documents in result']
    if (statusCode === 200) {
      if (Number(code) === 0 && msg) {
        if (filert_msg.indexOf(msg) > -1) {
          return Promise.reject(msg)
        } else {
          Message.error(msg)
          return Promise.reject(msg)
        }
      } else if (Number(code) !== 0 && Number(code) !== 1 && msg) {
        Message.error(msg)
        return Promise.reject(msg)
      }
    } else {
      Message.error('请求失败')
      return Promise.reject('请求失败')
    }
    return data || body
  },
  error => {
    Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service
