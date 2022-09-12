import { deepClone } from '@/utils'
import Rul from '@/utils/verify'
export default {
  munuItems: [
    {
      title: '商业化运营平台',
      key: 'crm',
      icon: '',
      desc: '客服管理、订单财务管理、系统权限 ....'
    },
    {
      title: '安全运营系统',
      key: 'gateway',
      icon: '',
      desc: '....'
    },
    {
      title: '业务配管系统',
      key: 'bausiness',
      icon: '',
      desc: '基础设施....'
    },
    {
      title: '资源运营系统',
      key: 'resources',
      icon: '',
      desc: 'IDC资产管理、IP资源调度 ....'
    },
    {
      title: '消息中心设置',
      key: 'msg',
      icon: '',
      desc: '消息中心管理'
    },
    {
      title: 'SOC安全运营',
      key: 'soc',
      icon: '',
      desc: '主机IP....'
    },
    {
      title: 'DNS安全运营',
      key: 'dns',
      icon: '',
      desc: '套餐列表....'
    },
    {
      title: '销售易运营',
      key: 'xsy',
      icon: '',
      desc: 'CRM订单、流水 ....'
    },
    {
      title: '可信访问',
      key: 'access',
      icon: '',
      desc: '应用可信访问'
    },
    {
      title: '反馈管理系统',
      key: 'feedback',
      icon: '',
      desc: '反馈管理'
    }
  ],
  operateMap: {
    uplevel: '更换套餐',
    payment: '启用带宽付费',
    kuorong: '扩容',
    shrink: '缩容',
    up: '升级',
    down: '降级',
    zengzhi: '增值',
    renew: '续费',
    formal: '试用转正',
    retry: '试用延期',
    cancel: '退订',
    bindDomain: '绑定域名',
    setconfig: '套餐配置修改',
    enablepay: '启用付费',
    disablePay: '停用付费',
    ads: 'ADS套餐编辑',
    edittime: '业绩时间编辑'
  },
  price_api: {
    cancel: '/fd/V4/order.end_price',
    renew: '/fd/V4/order.renew_price',
    kuorong: '/fd/V4/order.kuorong_price',
    up: '/fd/V4/order.up_price',
    down: '/fd/V4/order.down_price',
    zengzhi: '/fd/V4/order.zengzhi_price'
  },
  pay_api: {
    cencel: '/fd/V4/order.end_pay'
  },
  order_type: [
    {
      label: '正式开通',
      value: 'normal'
    },
    {
      label: '试用开通',
      value: 'user_refund'
    }
  ],
  sale_type: [
    {
      label: '金额',
      value: 'amount'
    },
    {
      label: '折扣',
      value: 'rate'
    }
  ],
  coupon: [
    {
      label: '使用',
      value: '1'
    },
    {
      label: '不使用',
      value: '2'
    }
  ],
  time_unit: [
    {
      label: '日',
      value: 'd'
    },
    {
      label: '月',
      value: 'm'
    },
    {
      label: '年',
      value: 'y'
    }
  ],
  upProduct: ['HW', 'SMGC', 'ADS', 'SDK', 'TP', 'WEBAQJS'], // // 新购套餐展示在前面的产品
  upMeal: [
    // 新购套餐展示在前面的套餐
    'YD-TCPAQJS-DZ',
    'YD-TCPAQJS-QJ',
    'YD-TCPAQJS-SY',
    'YD-TCPAQJS-GJ'
  ],
  handleUpMeal: function handleUpMeal(list, filter, key) {
    let new_list = list
    if (key) {
      filter.forEach((_) => {
        const item = new_list.find((i) => i[key] === _)
        if (item) {
          new_list = new_list.filter((i) => i[key] !== _)
          new_list.splice(0, 0, item)
        }
      })
    }
    return new_list
  },
  discountUsed: function discountUsed(
    useCoupon = '',
    useAct = '',
    discount_used = ''
  ) {
    let text_ = 'sale'
    if (useCoupon !== '') {
      text_ = text_ + ',coupon'
    }
    if (useAct !== '') {
      text_ = text_ + ',act'
    }
    if (discount_used !== '') {
      text_ = text_ + ',time'
    }
    return text_
  },
  setKeyValue: function setKeyValue(data, keys, form) {
    keys.forEach((key) => {
      let val = data && data[key] && data[key] !== '' ? data[key] : 0
      if (key === 'discount_sale_type' && (!data[key] || data[key] === '')) {
        val = 'amount'
      } else if (key === 'expire_time' && (!data[key] || data[key] === '')) {
        val = ''
      }
      form[key] = val
    })
  },
  fliterKey: function fliterKey(data, Keys) {
    const value = deepClone(data)
    Keys.forEach((e) => {
      delete value[e]
    })
    return value
  },
  setTagTree: function setTagTree(data) {
    const tags = []
    Object.keys(data).forEach((r) => {
      if (data[r] && Object.keys(data[r]).length) {
        const type = {
          label: data[r].type.name,
          value: data[r].type.ukey,
          apply_scope: data[r].type.apply_scope || '',
          must: data[r].type.must || 0,
          allow_more: data[r].type.allow_more || 0,
          [data[r].type.ukey]: '',
          nodelevel: 'type'
        }
        const Children = getTagTree(data[r].tags)
        if (Children.length) type.Children = Children
        tags.push(type)
      }
    })
    return tags
  },

  Group: function Group(role, user) {
    const newRole = role.filter((i) => i.role_flag !== 'CRM_ADMIN') || []
    const newUser = user || []
    if (!newRole.length) return []
    newRole.forEach((r) => {
      r.label = r.role_name || r.id || '--'
      r.value = r.id
      r.children = []
      newUser.forEach((u) => {
        if (u.role_id === r.id) {
          u.label = u.name || u.user_id || '--'
          u.value = u.user_id || ''
          u.disabled = !u.name || Number(u.status) === 0
          r.children.push(u)
        }
      })
    })
    return newRole
  },
  channel_setting: {
    channel_expire_time: [
      {
        label: '不限制',
        value: 'nolimit'
      },
      {
        label: '指定',
        value: 'appoint'
      }
    ],
    relieve_expire_time: [
      {
        label: '不限制',
        value: 'nolimit'
      },
      {
        label: '指定',
        value: 'appoint'
      }
    ],
    channel_time_type: [
      {
        label: '天',
        value: 'day'
      },
      {
        label: '月',
        value: 'month'
      },
      {
        label: '年',
        value: 'year'
      }
    ],
    auth_type: [
      {
        label: '个人',
        value: 'personal'
      },
      {
        label: '企业',
        value: 'enterprise'
      },
      {
        label: '政府',
        value: 'government'
      }
    ],
    relieve_time_type: [
      {
        label: '天',
        value: 'day'
      },
      {
        label: '月',
        value: 'month'
      },
      {
        label: '年',
        value: 'year'
      }
    ],
    support_type: [
      {
        label: '代理 ',
        value: 'agent'
      },
      {
        label: '代销',
        value: 'sell'
      }
    ],
    default_type: [
      {
        label: '代理 ',
        value: 'agent'
      },
      {
        label: '代销',
        value: 'sell'
      }
    ],
    time_type: {
      day: '天 ',
      month: '月',
      year: '年'
    }
  },
  channel_setting_key: [
    'channel_expire_time',
    'channel_time_num',
    'channel_time_type',
    'relieve_expire_time',
    'relieve_time_num',
    'relieve_time_type',
    'support_type',
    'default_type'
  ],
  channel_setting_form: {
    channel_expire_time: '',
    channel_time_num: '',
    channel_time_type: '',
    relieve_expire_time: '',
    relieve_time_num: '',
    relieve_time_type: '',
    support_type: [],
    default_type: ''
  },
  channel_setting_rules: {
    channel_expire_time: [
      {
        required: true,
        message: ' '
      }
    ],
    channel_time_num: [
      {
        required: true,
        message: ' '
      }
    ],
    channelchannel_time_type_name: [
      {
        required: true,
        message: ' '
      }
    ],
    relieve_expire_time: [
      {
        required: true,
        message: ' '
      }
    ],
    relieve_time_num: [
      {
        required: true,
        message: ' '
      }
    ],
    relieve_time_type: [
      {
        required: true,
        message: ' '
      }
    ],
    support_type: [
      {
        required: true,
        message: '请选择',
        type: 'array'
      }
    ],
    default_type: [
      {
        required: true,
        message: ' '
      }
    ]
  },

  validatorBuyTime(buy_time = 1, time_unit = 'm', form = {}) {
    const plusnum = Rul.plusnum.test(buy_time)
    if (time_unit === 'm') {
      if (buy_time > 10) {
        form.buy_time = 10
      } else if (buy_time < 1) {
        form.buy_time = 1
      } else {
        if (!plusnum) {
          form.buy_time = Math.ceil(buy_time)
        }
      }
    } else if (time_unit === 'd') {
      if (buy_time > 30) {
        form.buy_time = 30
      } else if (buy_time < 1) {
        form.buy_time = 1
      } else {
        if (!plusnum) {
          form.buy_time = Math.ceil(buy_time)
        }
      }
    } else if (time_unit === 'y') {
      if (buy_time < 1) {
        form.buy_time = 1
      } else {
        if (!plusnum) {
          form.buy_time = Math.ceil(buy_time)
        }
      }
    }
  },

  getSetting(data, key) {
    const val = {}
    key.forEach((i) => {
      val[i] = data[i]
    })
    return val
  },
  getProductGroup: function getProductGroup(arr) {
    const P_M_List = []
    const P_List = []
    arr.forEach((M) => {
      const find_index = P_List.indexOf(M.product_flag)
      if (find_index < 0 && M.status === '1') {
        P_List.push(M.product_flag)
        P_M_List.push({
          label: M.product_name,
          value: M.product_flag,
          children: [
            {
              label: M.meal_name,
              value: M.meal_flag,
              product_flag: M.product_flag
            }
          ]
        })
      } else {
        P_M_List.forEach((P_M) => {
          if (P_M.value === M.product_flag) {
            P_M['children'].push({
              label: M.meal_name,
              value: M.meal_flag,
              product_flag: M.product_flag
            })
          }
        })
      }
    })
    return P_M_List
  },
  arrNumToStr: (ArrList) => {
    let arr = []
    if (Array.isArray(ArrList)) {
      arr = ArrList
    } else {
      arr = ArrList.replace(/\[|"|]/g, '').split(',')
    }
    const newArr = arr.map(record => {
      return record + ''
    })
    return newArr
  },
  formartList: (data) => {
    let list = []
    if (Object.keys(data).length) {
      list = Object.keys(data).map((i) => {
        return {
          label: data[i],
          value: i,
          member_id: data[i]
        }
      })
    }
    return list
  },
  riskmembers: (list) => {
    const Arr = deepClone(list)
    return Arr.map((i) => {
      return {
        label: i.member_email,
        value: i.member_email,
        member_id: i.member_id
      }
    })
  }
}

function getTagTree(data) {
  const arr = []
  Object.keys(data).forEach((i) => {
    if (Object.keys(data[i]).length && data[i]) {
      data[i].label = data[i].tag
      data[i].value = data[i].tag_id || data[i].id || ''
      if (Object.keys(data[i].childs).length && data[i].childs) {
        data[i].Children = getTagTree(data[i].childs)
      }
      arr.push(data[i])
    }
  })
  return arr
}
