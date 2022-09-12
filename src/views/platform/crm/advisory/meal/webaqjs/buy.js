import moment from 'moment'
import { isArray } from '@/utils/array'
function getPriceLevelMap(count_type, count_type_config) {
  // 时长价格区间
  const priceLevelMap = []
  if (count_type === 'one_to_many') {
    count_type_config.forEach(item => {
      priceLevelMap.push(Number(item.value))
    })
  }
  return priceLevelMap
}

function getFilterFlagStatus(flag) {
  return ['LS', 'DX'].indexOf(flag) < 0
}
function parseJSON(str) {
  let obj = {}
  try {
    obj = JSON.parse(str)
  } catch (e) {
    return false
  }
  return obj
}
function getFieldItem(field, i, count_unit) {
  const item = {
    title: field.title,
    value: field.value || 1,
    valueType: isArray(field.value) ? 'array' : typeof field.value,
    key: i,
    unit: field.unit || count_unit || '',
    readonly: Number(field.readonly) === 1,
    beishu: field.beishu || 1,
    default_value: field.default_value
  }
  return item
}
function getKeyValue(item) {
  const value = item['valueType'] !== 'array' ? item['value'] : item['value'][0].value || item['value'][0] || ''
  return value
}

function getSortPriceLevel(arr, number) {
  let level = 0
  let newArr = []
  newArr = arr.concat()
  newArr.push(parseInt(number, 10))
  newArr = newArr.sort(function(a, b) {
    return a - b
  })
  newArr.forEach((value, index) => {
    if (value === number) {
      if (index === 0) {
        level = newArr[index + 1]
      } else if (value > arr[index - 1] && value < arr[index + 1]) {
        level = newArr[index - 1]
      } else if (value === arr[index - 1]) {
        level = newArr[index - 1]
      } else if (value === arr[index + 1]) {
        level = newArr[index + 1]
      } else if (index === arr.length - 1) {
        level = newArr[index - 1]
      }
    }
  })
  return level
}

function getExcTime(datetime_1, count, time_unit) {
  const date_1 = datetime_1
    ? moment(datetime_1) - moment(new Date()) >= 0
      ? moment(datetime_1)
      : moment(new Date())
    : moment() // 开始时间
  const unit = {
    d: 'day',
    m: 'months',
    y: 'year'
  }
  const date_2 = date_1.add(Number(count), unit[time_unit])
  const newDate = moment(date_2).format('YYYY-MM-DD HH:mm:ss')
  return newDate
}

function getMealText(list, flag) {
  let text = ''
  const model = list.filter(i => i.meal_flag === flag)
  if (model.length) text = model[0].product_name + '--' + model[0].meal_name
  return text
}
const BuyForm = {
  surplus_flow: '', // 帐户余额
  plan_diy_name: '',
  product_meal_id: '', // 套餐id.
  product_flag: '', // 产品标识.
  meal_flag: '', // 套餐标识.
  plan_name: '', // 套餐名称
  email: '',
  order_type: 'normal', // 订单类型: normal常规订单 user_test用户测试 user_refund客户补偿
  buy_type: '', // 试用订单
  buy_num: 1, // 购买时长 数量
  time_unit: 'm', // 购买时长 单位
  user_id: 0,
  member_id: '', // 用户id
  plan_id: '', // 套餐id
  remark: '', // 备注
  from: 'user', // 来源
  no_fee: 0, // 是否免费
  diff_price_time: 0, // 默认优惠
  diff_price_act: 0, // 折扣优惠
  useAct: true,
  useCoupon: false,
  discount_sale_type: 'amount', // 销售优惠类型
  discount_sale_amount: 0, // 销售优惠-金额
  discount_used: 'sale,time,act,coupon', // 优惠类型
  coupon_code: '', // 优惠券号码
  pay_price: 0,
  pay_type: 6, // 支付类型
  meal: {
    buy_num: '',
    price_level: '0',
    unit: ''
  },
  priceLevelMap: [], // 价格区间
  meal_config: [], // 套餐参数配置
  couponList: [] // 优惠券列表
}

const rules = {
  email: [{ required: true, message: '请选择YUNDUN报备用户' }],
  order_type: [{ required: true, message: '请选择开通目的' }],
  product_flag: [{ required: true, message: '请选择产品' }],
  meal_flag: [{ required: true, message: '请选择套餐' }],
  plan_diy_name: '',
  time_unit: [],
  remark: [],
  coupon_code: [],
  diff_price_time: [],
  diff_price_act: [],
  useAct: [],
  discount_sale_type: [],
  discount_sale_amount: [{ required: true, validator: checkNumber }],
  total_price: [],
  pay_price: [{ required: true, validator: checkNumber }],
  pay_type: [{ required: true, message: '请选择支付方式', trigger: ['change'] }]
}

const checkTime = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error('请选择延期时长'))
  } else {
    callback()
  }
}
const checkNumber = (rule, value, callback) => {
  if (value === '' || value === null) {
    callback(new Error('请输入数字'))
  } else if (isNaN(Number(value))) {
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}
export {
  getPriceLevelMap,
  getFilterFlagStatus,
  parseJSON,
  getFieldItem,
  getSortPriceLevel,
  getKeyValue,
  getMealText,
  BuyForm,
  rules,
  checkTime,
  getExcTime
}
