import moment from 'moment'
import defaultSetting from '@/core/defaultSetting'
const PAYBACK = {
  title: '确认回款',
  loading: false,
  visible: false,
  rowData: {},
  flow_source: '',
  flow_code: '',
  order_code: '',
  screen_pic: '',
  screen_pic_img: '',
  payback_type: '2',
  payback_code: '',
  remark: '',
  payback: 0,
  pay_price: 0, // 应付
  pay_off_price: 0 // 实付
}
const PAYBACK_RULE = {

}

const FORM_DETAIL = {
  title: '订单详情',
  loading: false,
  visible: false,
  actionTab: 'detailInfo',
  rowData: { id: '' },
  meal_info: [],
  sale_user_ids: [], // 销售列表
  sales: [], // 选择的销售
  supports: [], // 选择的技术支持
  support_user_ids: [], // 技术支持列表
  listMap: {
    map_buy_type: [],
    map_meal: [],
    map_order_status: [],
    map_order_type: [],
    map_product: [],
    members: []
  },
  paybackList: [],
  editLog: [],
  log_action_map: {}
}
const FORM_DETAIL_RULE = {

}
const FORM_EDIT = {
  title: '编辑订单',
  loading: false,
  visible: false,
  rowData: {},
  sale_user_ids: [], // 销售列表
  sales: [], // 选择的销售
  supports: [], // 选择的技术支持
  support_user_ids: [], // 技术支持列表
  discount_sale_type: 'amount',
  discount_sale_amount: 0,
  order_code: '',
  MealInfo: [],
  remark: '',
  listMap: {
    map_buy_type: [],
    map_meal: [],
    map_order_status: [],
    map_order_type: [],
    map_product: [],
    members: []
  }

}
const FORM_EDIT_RULE = {

}

function arrMerge(arr1 = [], arr2 = []) {
  return Array.prototype.concat.apply([], arguments)
}

function arrNumToStr(ArrList) {
  return defaultSetting.arrNumToStr(ArrList)
}

function ObjType(item) {
  const typeArr = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol']
  const type = Object.prototype.toString.call(item).slice(8, -1)
  const index = typeArr.indexOf(type)

  return typeArr[index] || ''
}

function getExcTime(datetime_1, count, time_unit) {
  const date_1 = datetime_1 ? moment(datetime_1) - moment(new Date()) >= 0 ? moment(datetime_1) : moment(new Date()) : moment() // 开始时间
  const unit = {
    'd': 'day',
    'm': 'months',
    'y': 'year'
  }
  const date_2 = date_1.add(Number(count), unit[time_unit])
  const newDate = moment(date_2).format('YYYY-MM-DD HH:mm:ss')
  return newDate
}
function validatePrice(rule, value, callback) {
  if (isNaN(Number(value))) {
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}
const ADJUSTORDER_RULE = {
  email: [{ required: true, message: '请输入YUNDUN注册账号', trigger: 'change' }],
  id: [{ required: true, message: '请选择套餐', trigger: 'change' }],
  order_type: [{ required: true, message: '请选择订单目的', trigger: 'change' }],
  buy_type: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
  pay_type: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
  pay_price: [{ required: true, validator: validatePrice, trigger: 'change' }]
}
const ADJUSTORDER_BUY_TYPE = [
  { label: '新购', value: 'create', status: '1' },
  { label: '扩容', value: 'kuorong', status: '1' },
  { label: '续费', value: 'renew', status: '0' },
  { label: '升降级', value: 'uplevel', status: '0' }
]

const AdjustOrder = {
  email: '',
  id: ''
}

const createModel = {
  start_time: '',
  end_time: '',
  product_flag: '', // 产品标识.
  plan_diy_name: '',
  product_meal_id: '', // 套餐id.
  meal_flag: '', // 套餐标识.
  plan_name: '', // 套餐名称
  order_type: 'adjustment', // 订单类型: normal常规订单 user_test用户测试 user_refund客户补偿
  buy_time: '', // 购买类型时长
  buy_number: '', // 购买流量
  buy_num: '',
  time_unit: '', // 购买类型时长单位
  monitoring_node: '', // 监控节点
  meal_config: [], // 套餐参数配置
  couponList: [], // 优惠券列表
  meal: {
    buy_num: '',
    price_level: '0',
    unit: ''
  },
  priceLevelMap: [] // 价格区间
}
const expansionModel = {
  data: {
    member: {}
  },
  product_meal_id: '',
  meal_flag: '', // 套餐标识.
  plan_name: '', // 套餐名称
  order_type: 'adjustment', // 订单类型: normal常规订单 user_test用户测试 user_refund客户补偿
  buy_time: '', // 购买类型时长
  buy_number: '', // 购买流量
  time_unit: '', // 购买类型时长单位
  monitoring_node: '', // 监控节点
  meal_config: [], // 套餐参数配置
  coupon_code: '',
  couponList: [],
  no_fee: '0',
  pay_type: '6',
  kuorong: {},
  meal: {
    buy_num: '',
    price_level: '0',
    unit: ''
  },
  remark: '',
  priceLevelMap: [] // 价格区间
}

const DialogConfirm = {
  title: '确认订单',
  loading: false,
  visible: false,
  is_invoice: '1',
  contract_order: '1',
  contract_code: '',
  contract_time: '',
  invoice: '1',
  contract_start_time: '',
  contract_end_time: '',
  remark: '',
  rowData: {},
  invoice_info: {},
  is_no_commission: '2',
  is_strategic_coustomer: '2',
  order_match_opportunity: 2, // 云平台订单是否匹配商机 1-匹配 2-未匹配
  xsy_customer_id: '',
  xsy_opportunity_id: ''
}
export {
  PAYBACK, PAYBACK_RULE,
  FORM_DETAIL, FORM_DETAIL_RULE,
  FORM_EDIT, FORM_EDIT_RULE, arrMerge, arrNumToStr, ObjType,
  AdjustOrder, ADJUSTORDER_RULE, getExcTime,
  createModel, expansionModel, DialogConfirm, ADJUSTORDER_BUY_TYPE
}
