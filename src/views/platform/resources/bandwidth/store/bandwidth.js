import InvokeAllApi from '@/utils/invokeAllApi'

function formatSelect(data) {
  const list = []
  Object.keys(data).forEach(value => {
    list.push({
      value: isNaN(value) ? value : parseInt(value),
      label: data[value]
    })
  })
  return list
}

const SPEED_LIMIT_TYPE_VAR = {
  CUSTOMER: 1,
  HOST: 2
}

const state = {
  label: {
    SPEED_LIMIT_TYPE_VAR,
    SPEED_LIMIT_TYPE: [
      {
        label: '客户维度',
        value: SPEED_LIMIT_TYPE_VAR.CUSTOMER
      },
      {
        label: '主机维度',
        value: SPEED_LIMIT_TYPE_VAR.HOST
      }
    ],
    RECORD_TYPE: [
      {
        label: '自定义',
        value: 1
      },
      {
        label: '系统默认',
        value: 2
      }
    ],
    STATUS: [
      {
        label: '启用',
        value: 1
      },
      {
        label: '关闭',
        value: 2
      }
    ],
    speed_limit_type: [],
    record_type: [],
    product_flag_list: [],
    speed_limit_type_user: []
  },
  selectMeal: []
}

const mutations = {
  SET_LABEL: (state, data) => {
    const label = JSON.parse(JSON.stringify(state.label))
    Object.keys(data).forEach(key => {
      label[key] = formatSelect(data[key])
    })
    state.label = label
  },

  SET_MEAL: (state, list) => {
    state.selectMeal = list.map(_ => {
      return {
        label: _.plan_name,
        value: _.id
      }
    })
  }
}

const actions = {
  async featchConst({ commit }) {
    const data = await InvokeAllApi.get('/fd/V4/bandwidth.const.list', {
      get_type: 'const'
    })
    commit('SET_LABEL', data)
  },

  async fetchMeal({ state, commit }) {
    const product_flag = state.label.product_flag_list.map(_ => _.label)
    const { list } = await InvokeAllApi.get('/V4/customer.plan.list', { product_flags: product_flag.join(',') })
    commit('SET_LABEL', list)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
