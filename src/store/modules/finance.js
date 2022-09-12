import Fetch from '@/utils/fetch'
import { deepClone } from '@/utils/index'
import defaultSetting from '@/core/defaultSetting'
const finance = {
  state: {
    product_list: [], // 产品列表
    meal_list: [],
    conf: {
      afterSales_list: [],
      basic_conf: {},
      industry: [],
      user_list: [],
      role_list: [],
      group: []
    },
    role_list: [],
    agent_emails: {},
    cbms_info: {},
    cbms_map: {},
    channel_type: [],
    setting_info: {}
  },
  mutations: {
    SET_PRODUCT: (state, product_list) => {
      state.product_list = product_list || []
    },
    SET_MEAL: (state, meal_list) => {
      state.meal_list = meal_list || []
    },
    ROLE_LIST: (state, role_list) => {
      state.role_list = role_list || []
    },
    AGENT_EMAIL: (state, agent_emails) => {
      state.agent_emails = agent_emails || []
    },
    BASIC_CONF: (state, data) => {
      state.conf.basic_conf = data.basic_conf || {}
      state.conf.industry = data.industry || []
      state.conf.user_list = data.user_list || []
      state.conf.role_list = data.role_list || []
      state.conf.afterSales_list = data.afterSales_list || []
      state.conf.group = data.group || []
    },
    CBMS_INFO: (state, data) => {
      state.cbms_info = data || {}
    },
    CBMS_MAP: (state, data) => {
      state.cbms_map = data || {}
    },
    CHANNEL_TYPE: (state, list) => {
      state.channel_type = list || []
    },
    SETTING_INFO: (state, data) => {
      state.setting_info = data || {}
    }

  },
  actions: {
    delSession({ commit }) {
      localStorage.clear()
    },
    getProduct({ commit }, params = { status: '1' }) {
      return new Promise(async(resolve, reject) => {
        await Fetch.get('/V4/product.list', params)
          .then((res) => {
            commit('SET_PRODUCT', res.data)
            resolve(res)
          })
          .catch((e) => {
            reject([])
          })
      })
    },
    getMeal({ commit }, params = { status: '1', page: '1', per_page: '9999' }) {
      return new Promise(async(resolve, reject) => {
        await Fetch.get('/V4/product.meal.list', params)
          .then((res) => {
            commit('SET_MEAL', res.data)
            resolve(res)
          })
          .catch((e) => {
            reject([])
          })
      })
    },
    getbasicconf({ commit }, params = {}) {
      return new Promise(async(resolve, reject) => {
        await Fetch.get('/fd/V4/customer.manage.getbasicconf', params)
          .then((res) => {
            const data = res
            const role = deepClone(res.role_list)
            const user = deepClone(res.user_list)
            const group = defaultSetting.Group(role, user)
            data['group'] = group
            commit('BASIC_CONF', data)
            resolve(data)
          })
          .catch((e) => {
            reject([])
          })
      })
    },
    getCbmsInfo({ commit }, params = {}) {
      return new Promise(async(resolve, reject) => {
        await Fetch.get('/V4/cbms.common.info', params)
          .then((res) => {
            commit('CBMS_INFO', res)
            resolve(res)
          })
          .catch((e) => {
            reject([])
          })
      })
    },
    getCbmsMap({ commit }, params = {}) {
      return new Promise(async(resolve, reject) => {
        await Fetch.get('/V4/cbms.cb.map', params)
          .then((res) => {
            commit('CBMS_MAP', res)
            let channel_type = []
            if (Object.keys(res.channel_type).length) {
              channel_type = Object.keys(res.channel_type).map((i) => {
                return { label: res.channel_type[i], value: i }
              })
            }
            commit('CHANNEL_TYPE', channel_type)
            resolve(res)
          })
          .catch((e) => {
            reject([])
          })
      })
    },
    settingInfo({ commit }, params) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await Fetch.get('/V4/cbms.cb.channel.setting.info', params)
          commit('SETTING_INFO', data)
          resolve(data)
        } catch (error) {
          reject({})
        }
      })
    },
    getRoleLst({ commit }, params = {}) {
      return new Promise(async(resolve, reject) => {
        await Fetch.get('/V4/rbac.role.getList', params)
          .then((res) => {
            commit('ROLE_LIST', res.list || [])
            resolve(res.list || [])
          })
          .catch((e) => {
            reject([])
          })
      })
    },
    agent_email({ commit }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await Fetch.get('/fd/V4/order.agent.list', {})
          commit('AGENT_EMAIL', data)
          resolve(data)
        } catch (error) {
          reject({})
          return
        }
      })
    }
  }
}
export default finance
