import Fetch from '@/utils/fetch'

const state = {
  loadingExplorer: true,
  SOURCE: []
}
const mutations = {
  SET_SOURCE: (state, data) => {
    state.SOURCE = data
  }
}
const actions = {
  async fetchSource({ commit, state }) {
    const data = await Fetch.get('/fd/V4/gateway/threat.classification.source.list', { page: 1, page_size: 999 })
    const { list = [] } = data || {}
    commit('SET_SOURCE', list)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
