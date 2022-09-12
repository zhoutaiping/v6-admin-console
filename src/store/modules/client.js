import Fetch from '@/utils/fetch'
function formatLabel(data) {
  let list = []
  if (Array.isArray(data)) {
    list = data.map(_ => {
      return {
        label: _,
        value: _
      }
    })
  } else {
    Object.keys(data).forEach(value => {
      list.push({
        label: data[value],
        value
      })
    })
  }
  return list
}
const state = {
  loadingExplorer: true,
  label: {}
}
const mutations = {
  SET_LABEL: (state, data) => {
    Object.keys(data).forEach(key => {
      state.label[key] = formatLabel(data[key])
    })
  }
}
const actions = {
  async fetchExplorer({ commit, state }) {
    state.loadingExplorer = true
    const data = await Fetch.get('/fd/V4/customer.manage.getbasicconf')
    commit('SET_LABEL', data.basic_conf)
    state.loadingExplorer = false
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
