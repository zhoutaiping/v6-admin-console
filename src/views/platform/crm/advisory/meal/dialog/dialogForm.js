import Rul from '@/utils/verify'
import moment from 'moment'

const FORM_RENEWALFEE = {
  visible: false,
  loading: false,
  data: {
    member: {}
  },
  product_meal_id: '',
  meal_flag: '', // 套餐标识.
  plan_name: '', // 套餐名称
  order_type: 'normal', // 订单类型: normal常规订单 user_test用户测试 user_refund客户补偿
  buy_time: '', // 购买类型时长
  buy_number: '', // 购买流量
  time_unit: '', // 购买类型时长单位
  monitoring_node: '', // 监控节点
  meal_config: [], // 套餐参数配置
  sales_amount: 0,
  discount_sale_type: 'amount', // 销售优惠类型
  discount_sale_amount: 0,
  diff_price_act: '', // 产品折扣
  diff_price_time: '', // 默认优惠
  diff_price_sale: '', // 销售优惠
  diff_price_coupon: '0', // 优惠券金额
  coupon_code: '',
  couponList: [],
  meal: {
    buy_num: '',
    price_level: '0',
    unit: ''
  },
  remark: '',
  no_fee: '0',
  pay_type: '6',
  pay_price: '0', // 支付价格
  total_price: '0', // 应付费用
  priceLevelMap: [] // 价格区间
}

const FORM_RENEWALFEE_RULE = {
  buy_time: [{ required: true }],
  pay_price: [{ required: true }],
  pay_type: [{ required: true }],
  balance: [{ required: true }]
}

// 升级FROM
const FORM_UPLEVEL = {
  visible: false,
  loading: false,
  data: {
    member: {}
  },
  order_type: 'normal',
  meal_flag: '', // 套餐标识
  diff_price_act: '', // 产品折扣
  diff_price_time: '', // 默认优惠
  diff_price_sale: '', // 销售优惠
  sales_amount: 0,
  discount_sale_type: 'amount', // 销售优惠类型
  coupon_code: '', // 优惠码
  couponList: [],
  diff_price_coupon: '0', // 优惠券金额
  no_fee: '0',
  pay_type: '6',
  pay_price: '0.00',
  remark: ''
}

const FORM_UPLEVEL_RULE = {}

const FORM_NEWPACKAGE = {
  visible: false,
  loading: false,
  data: {
    member: {}
  },
  product_meal_id: '',
  meal_flag: '', // 套餐标识.
  plan_name: '', // 套餐名称
  order_type: 'normal', // 订单类型: normal常规订单 user_test用户测试 user_refund客户补偿
  buy_time: '', // 购买类型时长
  buy_number: '', // 购买流量
  time_unit: '', // 购买类型时长单位
  monitoring_node: '', // 监控节点
  meal_config: [], // 套餐参数配置
  discount_sale_type: 'amount', // 销售优惠类型
  discount_sale_amount: 0,
  sales_amount: 0,
  diff_price_act: '', // 产品折扣
  diff_price_time: '', // 默认优惠
  diff_price_sale: '', // 销售优惠
  diff_price_coupon: '0', // 优惠券金额
  coupon_code: '',
  couponList: [],
  no_fee: '0',
  pay_type: '6',
  Rules: {},
  kuorong: {},
  meal: {
    buy_num: '',
    price_level: '0',
    unit: ''
  },
  remark: '',
  pay_price: 0, // 支付价格
  total_price: 0, // 应付费用
  priceLevelMap: [] // 价格区间
}

const FORM_NEWPACKAGE_RULE = {}

const FORM_RAISE = {
  visible: false,
  loading: false,
  data: {
    member: {}
  },
  product_meal_id: '',
  meal_flag: '', // 套餐标识.
  plan_name: '', // 套餐名称
  order_type: 'normal', // 订单类型: normal常规订单 user_test用户测试 user_refund客户补偿
  buy_time: 1, // 购买类型时长
  buy_number: '', // 购买流量
  time_unit: 'd', // 购买类型时长单位
  monitoring_node: '', // 监控节点
  meal_config: [], // 套餐参数配置
  discount_sale_type: 'amount', // 销售优惠类型
  discount_sale_amount: 0,
  diff_price_act: '', // 产品折扣
  diff_price_time: '', // 默认优惠
  diff_price_sale: '', // 销售优惠
  sales_amount: 0,
  diff_price_coupon: '0', // 优惠券金额
  coupon_code: '',
  remark: '',

  pay_type: '6',
  Rules: {},
  zengzhi: {},
  price_levels: [],
  price_levels_default: '',
  meal: {
    buy_num: '',
    price_level: '0',
    unit: ''
  },
  no_fee: '0',
  pay_price: '0', // 支付价格
  total_price: '0', // 应付费用
  priceLevelMap: [] // 价格区间
}
const FORM_RAISE_RULE = {}

const FORM_CANCEL = {
  visible: false,
  loading: false,
  data: {
    member: {}
  },
  expire_time: '', // 退订时间
  product_meal_id: '',
  meal_flag: '', // 套餐标识.
  plan_name: '', // 套餐名称
  order_type: 'normal', // 订单类型: normal常规订单 user_test用户测试 user_refund客户补偿
  buy_time: '', // 购买类型时长
  buy_number: '', // 购买流量
  time_unit: '', // 购买类型时长单位
  monitoring_node: '', // 监控节点
  meal_config: [], // 套餐参数配置
  sales_amount: 0,
  discount_sale_type: 'amount', // 销售优惠类型
  discount_sale_amount: 0,
  diff_price_act: '', // 产品折扣
  diff_price_time: '', // 默认优惠
  diff_price_sale: '', // 销售优惠
  diff_price_coupon: '0', // 优惠券金额
  coupon_code: '',
  couponList: [],
  meal: {
    buy_num: '',
    price_level: '0',
    unit: ''
  },
  no_fee: '0',
  pay_type: '6',
  pay_price: '0', // 支付价格
  total_price: '0', // 应付费用
  priceLevelMap: [], // 价格区间
  end_time: '',
  end_time_text: '',
  old_expire_time: '',
  reason_top: '', // 一级流失原因，
  reason_second: '', // 二级流失原因，
  loss_remark: '', // 流失原因备注，
  remark: ''
}

const FORM_CANCEL_RULE = {}

// 设置时长单位
function setMealTimetype(type, time_unit) {
  const time_type = []
  if (type !== 'buy_time' && time_unit.length > 0) {
    return true
  }
  const text = { d: '天', m: '月', y: '年' }
  time_unit.forEach(function(val, index) {
    time_type.push({
      text: text[val],
      value: val,
      status: '1'
    })
  })
  return time_type
}
// default_fields 默认字段配置， list --默认字段集合 default_unit -- 默认单位 from-- form表单
function getMealConfig(default_fields, list, default_unit) {
  const meal_config = []
  let time_type = []
  if (list.length) {
    list.forEach(function(record, index) {
      const field = default_fields[record]
      if (field) {
        const config_item = {
          title: field['title'],
          value: field['value'],
          key: record,
          unit: field['unit'] ? field['unit'] : default_unit,
          readonly: field['readOnly']
        }
        time_type = setMealTimetype(record, field['unit'])
        meal_config.push(config_item)
      }
    })
  }
  return { meal_config, time_type }
}

function getMealInfo(detail) {
  const info = []
  const filter = ['meal_price', 'kuorong', 'zengzhi', 'backstage_show', 'default_fields']
  if (detail) {
    for (var item in detail) {
      if (filter.indexOf(item) < 0 && typeof detail[item] === 'object' && !!detail[item]) {
        if (detail[item].title && detail[item].value) {
          info.push({
            title: detail[item].title,
            value: detail[item].value,
            unit:
              detail[item].value === true || detail[item].value === false
                ? ''
                : detail[item].unit === 'num'
                  ? '(条/次/个)'
                  : detail[item].unit || ''
          })
        }
      }
    }
  }
  return info
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

function setMaxTime(buy_time, time_unit, formData, field) {
  const plusnum = Rul.plusnum.test(buy_time)

  if (time_unit === 'm' && field) {
    if (buy_time > 10) {
      formData.buy_time = 10
    } else if (buy_time < 1) {
      formData.buy_time = 1
    } else {
      if (!plusnum) {
        formData.buy_time = Math.ceil(buy_time)
      }
    }
  }
  if (time_unit === 'd' && field) {
    if (buy_time > 30) {
      formData.buy_time = 30
    } else if (buy_time < 1) {
      formData.buy_time = 1
    } else {
      if (!plusnum) {
        formData.buy_time = Math.ceil(buy_time)
      }
    }
  }
  if (time_unit === 'y' && field) {
    if (buy_time < 1) {
      formData.buy_time = 1
    } else {
      if (!plusnum) {
        formData.buy_time = Math.ceil(buy_time)
      }
    }
  }
}

function getDefault_Kuorong_Info(fieldList, fieldList_Value) {
  const info = []
  for (var record in fieldList) {
    const params = {
      title: fieldList[record].title || '--',
      value: fieldList_Value[record] ? fieldList_Value[record].buy_num || 0 : 0,
      unit: fieldList[record].unit || ''
    }
    info.push(params)
  }
  return info
}
// 获取增值列表
function getMealZengzhi(list, cfg_kuorong, default_unit, form) {
  const zengzhiList = []
  const zengzhiFiled = {}
  for (var record in list) {
    const field = list[record]
    const price_levels = Object.keys(field.price_levels).map((i) => {
      return { text: i + default_unit, value: i }
    })
    const config_item = {
      title: field['title'] || '增值配置',
      beishu: field['limit_beishu'],
      value: field['default'] || 0,
      key: record,
      unit: field['unit'] ? field['unit'] : default_unit,
      price_levels: field['price_type'] !== 'one_to_many' ? [] : price_levels
    }

    if (cfg_kuorong['bgp_line']) {
      if (Number(cfg_kuorong['bgp_line']['buy_num']) > 0 && record === 'bgp_bandwidth') {
        zengzhiFiled[record] = {
          buy_num: 1,
          price_level: ''
        }
        zengzhiList.push(config_item)
      }

      if (Number(cfg_kuorong['bgp_line']['buy_num']) === 0 && record === 'bandwidth') {
        zengzhiFiled[record] = {
          buy_num: 1,
          price_level: ''
        }
        zengzhiList.push(config_item)
      }
    } else {
      if (record === 'bandwidth') {
        zengzhiFiled[record] = {
          buy_num: 1,
          price_level: ''
        }
        zengzhiList.push(config_item)
      }
    }
  }
  return { zengzhiList, zengzhiFiled }
}

export {
  FORM_RENEWALFEE,
  FORM_RENEWALFEE_RULE,
  FORM_UPLEVEL,
  FORM_UPLEVEL_RULE,
  FORM_NEWPACKAGE,
  FORM_NEWPACKAGE_RULE,
  FORM_CANCEL,
  FORM_CANCEL_RULE,
  setMealTimetype,
  getMealConfig,
  getMealInfo,
  setMaxTime,
  getDefault_Kuorong_Info,
  getExcTime,
  getMealZengzhi,
  FORM_RAISE,
  FORM_RAISE_RULE
}
