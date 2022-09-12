
const formModel = {
  open: false,
  loading: false,
  remark: '',
  'tp_name': '', // 模板名称
  'ukey': '', // 模板标识
  'calc_way': '', // 计费规则
  'calc_way_timeunit': 'day', // 计费周期
  'free_china': '0', // 国内定制(免费)流量
  'free_foreign': '0', // 国外定制(免费)流量
  'fee_china': '0', // 国内流量价格
  'fee_foreign': '0', // 国外流量价格
  'free_cdn_https': '0', // 赠送的https请求加速次数, 单位: 万次
  'fee_cdn_https': '0', // 增值服务价格, 单位: 元/万次
  'free_china_max': '0', // 国内带宽峰值定制(免费)
  'free_foreign_max': '0', // 国外带宽峰值定制(免费)
  'fee_china_max': '0', // 国内带宽峰值价格
  'fee_foreign_max': '0' // 国外带宽峰值价格
}
const validatePrice = (rule, value, callback) => {
  if (value === '' || isNaN(Number(value))) {
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}
const rules = {
  ukey: [{ required: true, trigger: ['blur', 'change'], message: '请选择模板类型' }],
  calc_way: [{ required: true, trigger: ['blur', 'change'], message: '请选择计费规则' }],
  calc_way_timeunit: [{ required: true, trigger: ['blur', 'change'], message: '请选择计费周期' }],
  free_china: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  free_foreign: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  fee_china: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  fee_foreign: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  free_china_max: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  free_foreign_max: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  fee_china_max: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  fee_foreign_max: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  free_cdn_https: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }],
  fee_cdn_https: [{ required: true, trigger: ['blur', 'change'], validator: validatePrice }]
}
export {
  formModel, rules
}
