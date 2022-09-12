import Fetch from '@/utils/fetch'

const state = {
  saas_template: []
}

const mutations = {
  SAAS_TEMPLATE: (state, data) => {
    state.saas_template = Object.keys(data).map(i => {
      return { label: data[i], value: i }
    })
  }
}

const actions = {
  async featchSaasTemplate({ commit }) {
    try {
      const data = await Fetch.get('/fd/V4/zero.trust.saas.template', {})
      commit('SAAS_TEMPLATE', data)
    } catch (error) {
      commit('SAAS_TEMPLATE', [])
      return
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
