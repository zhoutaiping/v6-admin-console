import axios from 'axios'
import Message from 'ant-design-vue/lib/message'
axios.defaults.withCredentials = true
const service = axios.create({
  baseURL: '/tag',
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
    const { code, error, msg } = response.data
    if (statusCode === 200) {
      if (Number(code) !== 1 && (error || msg)) {
        Message.error(error || msg)
        return Promise.reject(error || msg)
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
