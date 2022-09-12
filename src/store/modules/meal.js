import Fetch from '@/utils/fetch'
import defaultSetting from '@/core/defaultSetting'
import { CountDown } from '@/utils/utils'
// import { deepClone } from '@/utils/index'
const meal = {
  state: {
    detail: {},
    operate: [],
    info: [],
    kuorong_setting: [],
    kuorong_key: {},
    user_kuorong: [],
    webaqjs_user_kuorong_info: [],
    shrink: [],
    customer_info: {},
    step_form: {},
    create_form: {}
  },
  mutations: {
    SET_DETAIL: (state, detail) => {
      state.detail = detail || {}
    },
    SET_OPERATE: (state, operate) => {
      state.operate = operate || []
    },
    SET_INFO: (state, info) => {
      state.info = info || []
    },
    SET_KUORONG_SETTING: (state, kuorong_setting) => {
      state.kuorong_setting = kuorong_setting || []
    },
    SET_KUORONG_KEY: (state, key) => {
      state.kuorong_key = key || {}
    },
    SET_USER_KUORONG: (state, list) => {
      state.user_kuorong = list || []
    },
    SET_WEBAQJS_USER_KUORONG: (state, list) => {
      state.webaqjs_user_kuorong_info = list || []
    },
    CUSTOMER_INFO: (state, data) => {
      state.customer_info = data || {}
    },
    SET_STEP_FORM: (state, data) => {
      state.step_form = data || {}
    },
    SET_CREATE_FORM: (state, data) => {
      state.create_form = data || {}
    }
  },
  actions: {
    customerinfo({ commit, state, dispatch }, params = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          const data = await Fetch.post('/fd/V4/order.customerinfo', params)
          commit('CUSTOMER_INFO', data)
          resolve(data)
        } catch (error) {
          reject(null)
        }
      })
    },
    detail({ commit, state, dispatch }, params = {}) {
      commit('SET_DETAIL', {})
      commit('SET_INFO', [])
      return new Promise(async (resolve, reject) => {
        try {
          const data = await Fetch.get('/V4/customer.plan.info', params)
          commit('SET_DETAIL', data)
          dispatch('info', data)
          resolve(data)
        } catch (error) {
          reject()
        }
      })
    },
    operate({ commit, state }, data_ = {}) {
      const list = []
      const meal_operate = data_ && data_.meal_operate || []
      const operateMap = defaultSetting.operateMap
      if (Object.keys(data_).length && meal_operate.length) {
        meal_operate.forEach(_ => {
          if (_ && operateMap[_]) list.push({ lable: operateMap[_], value: _ })
        })
      }
      commit('SET_OPERATE', list)
    },
    info({ commit, state }, data_ = {}) {
      let list = []
      if (Object.keys(data_).length) {
        list = [
          { title: '套餐ID', value: data_.id, unit: '' },
          { title: '关联账号', value: data_.member.email, unit: '' },
          { title: '产品名称', value: data_.plan_setting.meal.product_name, unit: '' },
          { title: '套餐名称', value: data_.plan_name, unit: '' },
          { title: '当前套餐状态', value: data_.plan_status === '2' ? '已到期' : '未到期', unit: '' },
          { title: '剩余时间', value: CountDown(data_.expire_time), unit: '' }
        ]
      }
      commit('SET_INFO', list)
    },
    async userKuorong({ commit, state }, data_ = {}) {
      const list = []
      const meal = data_ && data_.plan_setting || null
      const kuorong_key = meal && meal.kuorong || null
      let kuorong_val = {}
      if (meal && meal.cfg) {
        const cfg = meal.cfg
        kuorong_val = cfg && cfg.kuorong
      }
      try {
        const suoronguplimt = await Fetch.post('/fd/V4/order.plan.suoronguplimt',
          {
            plan_id: data_.id, member_id: data_.member_id, product_flag: data_.product_flag
          })
        if (kuorong_key && Object.keys(kuorong_key).length) {
          Object.keys(kuorong_key).forEach(_ => {
            if (_ && kuorong_key[_]) {
              list.push({
                title: kuorong_key[_].title || '',
                value: kuorong_val && kuorong_val[_] && kuorong_val[_].buy_num || 0,
                unit: kuorong_key[_].unit || '',
                key: _,
                beishu: kuorong_key[_].limit_beishu || 1,
                max: suoronguplimt && suoronguplimt[_] || 0
              })
            }
          })
        }
        commit('SET_USER_KUORONG', list)
      } catch (error) {
        commit('SET_USER_KUORONG', list)
      }
    },
    setShrink({ state }, data_ = {}) {
      const { data = state.data, vm = null, form = null } = data_
      const meal = data && data.plan_setting || {}
      const kuorong_key = meal && meal.kuorong || {}
      if (kuorong_key && Object.keys(kuorong_key).length) {
        Object.keys(kuorong_key).forEach(_ => {
          if (_ && kuorong_key[_]) {
            vm.$set(form, _, 0)
            vm.rules[_] = [{ required: true, message: ' ', type: 'number' }]
          }
        })
      }
      setTimeout(() => {
        vm.getPrice()
      }, 200)
    },
    kuorongConfig({ commit }, data_ = {}) {
      const arr = [] // 扩容配置
      const key = {} // 扩容key
      const detail = data_ || null
      const meal = detail && detail.plan_setting || {}
      const kuorong_key = meal && meal.kuorong || {}
      let kuorong_val = {}
      if (meal && meal.cfg) {
        const cfg = meal.cfg
        kuorong_val = cfg && cfg.kuorong
      }
      if (Object.keys(kuorong_key).length) {
        Object.keys(kuorong_key).forEach(_ => {
          const item = kuorong_key[_]
          const kuorong_value = kuorong_val[_] ? kuorong_val[_].buy_num || 0 : 0
          const max_value = Number(item.limit_max) > 0 ? Number(item.limit_max) * Number(item.limit_beishu) - kuorong_value : 0
          item['kuorong'] = kuorong_value
          item['max'] = max_value
          item['readonly'] = Number(item.limit_max) > 0 ? max_value <= 0 : false
          item['key'] = _
          arr.push(item)
          key[_] = 0
        })
      }
      commit('SET_KUORONG_KEY', key)
      commit('SET_KUORONG_SETTING', arr)
    },
    OderPlan({ commit, state }, params = {}) {
      return new Promise((resolve, reject) => {
        Fetch.post('/fd/V4/order.web.plan', params).then(data => {
          const arr = [] // 扩容配置
          const key = {} // 扩容key
          const kuorong = data && data.kuorong || null
          const kuorong_min = data && data.kuorong_min || null
          const kuorong_user = []
          if (kuorong && Object.keys(kuorong).length) {
            Object.keys(kuorong).forEach(_ => {
              const item = kuorong[_]
              const kuorong_value = kuorong_min[_] || 0
              const max_value = Number(item.limit_max) > 0 ? Number(item.limit_max) * Number(item.limit_beishu) - kuorong_value : 0
              item['kuorong'] = kuorong_value
              item['limit_beishu'] = Number(item.limit_beishu) > 0 ? Number(item.limit_beishu) : 1
              item['max'] = max_value
              item['min'] = kuorong_min[_] || 0
              item['readonly'] = Number(item.limit_max) > 0 ? max_value <= 0 : false
              item['key'] = _
              arr.push(item)
              key[_] = kuorong_min[_] || 0
              if (_ === 'domain_packet') {
                kuorong_user.push({
                  title: '扩容包', value: kuorong_min[_] || 0, unit: '个'
                })
              }
            })
          }
          commit('SET_KUORONG_KEY', key)
          commit('SET_WEBAQJS_USER_KUORONG', kuorong_user)
          commit('SET_KUORONG_SETTING', arr)
          resolve(data)
        }).catch(e => {
          reject({})
        })
      })
    },
    setOption({ commit, state, dispatch }, params = {}) {
      const { vm = null, form = {}, rules = {}} = params
      const check_meal = vm.meal.find(i => { return i.meal_flag === form.meal_flag }) || null
      const meal_detail = check_meal && check_meal.meal_detail && parseJSON(check_meal.meal_detail) || {}
      if (!meal_detail && Object.keys(meal_detail).length) {
        vm.message.warning('套餐配置不正确请联系售前！')
        return
      }
      if (form.product_flag === 'WEBAQJS') {
        dispatch('OderPlan', { meal_flag: form.meal_flag, member_id: form.member_id || vm.member_id }).then(res => {
          vm.$refs.kuorongPage && vm.$refs.kuorongPage.init()
        })
      }
      // 态势感知  默认值最小单位
      if (form.product_flag === 'TS') {
        vm.option.TS = {
          value: meal_detail && meal_detail.meal_price.min_buy,
          unit: meal_detail && meal_detail.meal_price.count_unit
        }
      }
      form.product_meal_id = check_meal && check_meal.id
      form.coupon_code = ''
      form.buy_time = 1
      form.time_unit = meal_detail && meal_detail.meal_price.time_unit || 'm'
      form.meal = {
        buy_num: 1,
        price_level: 0,
        unit: meal_detail && meal_detail.meal_price.time_unit || ''
      }
      // 时长价格区间
      vm.option.price_level = set_price_level(meal_detail && meal_detail.meal_price.count_type, meal_detail.meal_price.config)
      // 新购配置
      const add_keys = meal_detail.backstage_show && meal_detail.backstage_show.default_fields || []
      vm.option.meal_config = set_meal_config(meal_detail.default_fields, add_keys, meal_detail.meal_price.count_unit, meal_detail, vm, form, rules)
    }
  }
}
export default meal
function parseJSON(str) {
  let obj = {}
  try {
    obj = JSON.parse(str)
  } catch (e) {
    return false
  }
  return obj
}
function set_price_level(count_type, count_type_config) { // 时长价格区间
  const list = []
  if (count_type === 'one_to_many') {
    count_type_config.forEach(item => {
      list.push(Number(item.value))
    })
  }
  return list
}
function getFieldItem(field, i, count_unit) {
  const item = {
    title: field.title,
    value: field.value || 1,
    valueType: Array.isArray(field.value) ? 'array' : typeof field.value,
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
function setTiemOption(type, list) {
  const TEXT = { 'd': '天', 'm': '月', 'y': '年' }
  const Arr = []
  list.forEach(i => {
    Arr.push({
      'text': TEXT[i],
      'value': i,
      'status': '1'
    })
  })
  return Arr
}
function set_meal_config(default_fields, fields_key, count_unit, meal_detail, vm, form, rules) {
  const list = []
  if (fields_key && Object.keys(default_fields).length && fields_key.length) {
    fields_key.forEach(i => {
      const field = default_fields[i]
      if (field) {
        const item = getFieldItem(field, i, count_unit)
        const key_value = getKeyValue(item)
        list.push(item)
        vm.$set(form, i, key_value || '')
        vm.$set(rules, i, [{ required: true, message: ' ' }])
        if (i === 'buy_time' && field.unit.length > 0) { // 设置时间类型
          vm.option.time_option = setTiemOption(i, field.unit)
        }
      }
    })
  }
  return list
}
