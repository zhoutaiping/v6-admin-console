import Fetch from '@/utils/fetch'
import FetchDisp from '@/utils/invokeDispApi'
import InvokeAssetApi from '@/utils/invokeAssetApi'
import { deepClone } from '@/utils'
import defaultSetting from '@/core/defaultSetting'
const disp = {
  state: {
    node_type: [],
    ip_pool: {},
    ip_pool_list: [],
    disp_ippool_info: {},
    disp_group_info: {},
    disp_group: {},
    disp_group_list: [],
    template: {
      normal: [],
      abnormal: [],
      bind: {}
    },
    normalRules: [],
    abnormalRules: [],
    actions: [],
    tagTree: [],
    region: [],
    region_list: [],
    region_tree: {},
    line: [],
    ip_group: [],
    line_group: [],
    policy_ip: [],
    web_domain: {},
    domain_basic: {}
  },
  mutations: {
    SET_DOMAIN_BASIC: (state, data) => {
      state.domain_basic = data
    },
    SET_NODE_TYPE: (state, data) => {
      state.node_type = data
    },
    SET_IP_POOL: (state, data) => {
      state.ip_pool = data
    },
    SET_IP_POOL_LIST: (state, list) => {
      state.ip_pool_list = list
    },
    SET_DISP_GROUP: (state, data) => {
      state.disp_group = data
    },
    SET_DISP_GROUP_LIST: (state, list) => {
      state.disp_group_list = list
    },
    SET_DISP_GROUP_INFO: (state, data) => {
      state.disp_group_info = data
    },
    SET_DISP_IPPOOL_INFO: (state, data) => {
      state.disp_ippool_info = data
    },
    SET_TEMPLATE_BIND: (state, data) => {
      const { normal = [], abnormal = [] } = data
      state.template.normal = normal.map(formatTemplateIdSelect)
      state.template.abnormal = abnormal.map(formatTemplateIdSelect)
      state.template.bind = data.bind && Object.keys(data.bind).length ? data.bind : {}
    },
    SET_SETTINGS: (state, { data, type }) => {
      if (type === 'abnormal') {
        state.abnormalRules = formatRules(data.abnormal)
        state.actions = formatActions(data.do)
      } else {
        state.normalRules = formatRules(data)
      }
      state.loadingSettings = false
    },
    SET_BIG: (state, region) => {
      state.region = region
    },
    SET_REGION: (state, region) => {
      state.region_list = region
    },
    SET_TREE_REGION: (state, region) => {
      state.region_tree = treeRegion(region)
    },
    SET_TAG: (state, data) => {
      state.tagTree = defaultSetting.setTagTree(data)
    },
    SET_LINE: (state, data) => {
      state.line = getTreeList(data)
    },
    SET_IP_GROUP: (state, list) => {
      state.ip_group = list
    },
    SET_LINE_GROUP: (state, list) => {
      state.line_group = list
    },
    SET_POLICY_IP: (state, list) => {
      state.policy_ip = list
    },
    SET_WEB_DOMAIN: (state, data) => {
      Object.keys(data).forEach(k => {
        state.web_domain[k] = data[k]
      })
    }
  },
  actions: {
    getDomainBasic({ commit, state }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await Fetch.get('/V4/WebCdnProtection.Domain.getDomainBasic', params)
          data.info = data.list && data.list[0] || {}
          commit('SET_DOMAIN_BASIC', data)
          resolve(data)
        } catch (e) {
          reject(e)
        }
      })
    },
    getWebDomain({ commit, state }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await Fetch.get('/fd/V4/web.domain.set.get', params)
          commit('SET_WEB_DOMAIN', data)
          resolve(data)
        } catch (e) {
          reject(e)
        }
      })
    },
    saveWebDomain({ state }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await Fetch.put('/fd/V4/web.domain.set.save', params)
          resolve(data)
        } catch (e) {
          reject(e)
        }
      })
    },
    getTagsByTypeKey({ state }, key = '') {
      return new Promise(async(resolve, reject) => {
        let list = []
        list = state.tagTree.filter(_ => _.apply_scope === key)
        resolve(list)
      })
    },
    getTagsByKey({ state }, key = '') {
      if (!key) return []
      const tagItem = state.tagTree.find(_ => _.value === key)
      return tagItem.Children
    },
    fetchNodeType({ commit, state }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await Fetch.get('/fd/V4/dispatch.node.type.get', params)
          commit('SET_NODE_TYPE', data)
          resolve()
        } catch (error) {
          reject()
        }
      })
    },
    fetchIpPool({ commit, state }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await FetchDisp.get('/ip/pool/list', params)
          const ip_pool = data && data.list && data.list[0] || {}
          commit('SET_IP_POOL', ip_pool)
          commit('SET_IP_POOL_LIST', data.list)
          resolve()
        } catch (error) {
          reject()
        }
      })
    },
    fetchDispGroud({ commit, state }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await FetchDisp.get('/disp/group/list', params)
          const group = data && data.list && data.list[0] || {}
          commit('SET_DISP_GROUP', group)
          commit('SET_DISP_GROUP_LIST', data.list)
          resolve()
        } catch (error) {
          reject()
        }
      })
    },
    fetchDispIppoolInfo({ commit, state }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await Fetch.get('/fd/V4/disp.ippool.info', params)
          commit('SET_DISP_IPPOOL_INFO', data)
          resolve()
        } catch (error) {
          reject()
        }
      })
    },
    fetchDispGroupInfo({ commit, state }, params = {}) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await Fetch.get('/fd/V4/disp.group.info', params)
          commit('SET_DISP_GROUP_INFO', data)
          resolve()
        } catch (error) {
          reject()
        }
      })
    },
    fetchLineGroup({ commit, state }, params = { page: 1, pagesize: 9999, per_size: 9999 }) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await FetchDisp.get('/line_group/list', params)
          commit('SET_LINE_GROUP', data.list)
          resolve()
        } catch (error) {
          reject()
        }
      })
    },
    async fetchTemplateBind({ commit }, params) {
      try {
        const data = await Fetch.get('/fd/V4/dispatch.template.bind.get', params)
        commit('SET_TEMPLATE_BIND', data)
      } catch (error) {
        commit('SET_TEMPLATE_BIND', {})
      }
    },
    async fetchSettings({ commit, state }, { type = 'normal', template_id = '' } = {}) {
      const API_MAP = {
        normal: '/fd/V4/dispatch.template.rule.get',
        abnormal: '/fd/V4/dispatch.abnormal.template.rule.get'
      }
      if (type === 'abnormal') {
        const data = await Fetch.get(API_MAP[type], { template_id: template_id })
        commit('SET_SETTINGS', { data, type })
      } else {
        const data = await Fetch.get(API_MAP[type])
        commit('SET_SETTINGS', { data, type })
      }
    },
    async featchRegion({ commit, state }, params = { page: 1 }) {
      const data = await InvokeAssetApi.get('/region/get', params)
      const list = JSON.parse(JSON.stringify(data.list))
      const region = require('@/utils/region')
      const BIG = region.getBig(list)
      commit('SET_BIG', BIG)
      commit('SET_REGION', list)
    },
    async featchTreeRegion({ commit, state }, params = { }) {
      const data = await FetchDisp.get('/line/tree/region', params)
      commit('SET_TREE_REGION', data)
    },
    async feachTagTree({ commit }, params = {}) {
      try {
        const data = await FetchDisp.get('/tag/tree', params)
        commit('SET_TAG', data)
      } catch (error) {
        return
      }
    },
    async feachLine({ commit }) {
      try {
        const data = await FetchDisp.get('/line/tree', {})
        commit('SET_LINE', data)
      } catch (error) {
        return
      }
    },
    async feachIpGroup({ commit }, params = {}) {
      try {
        const data = await FetchDisp.get('/ip/group/list', params)
        commit('SET_IP_GROUP', data.list)
      } catch (error) {
        return
      }
    },
    async featchPolicyIp({ commit }, params = { }) {
      try {
        const data = await FetchDisp.get('/disp/policy/ip/select', params)
        commit('SET_POLICY_IP', data.list || [])
      } catch (error) {
        return
      }
    }
  }
}
function formatTemplateIdSelect(item) {
  return {
    label: item.template_name,
    value: item.id
  }
}
function formatRules(list = []) {
  const rules = []
  list.forEach(item => {
    const logic = item.logic.map(_ => {
      return {
        label: _.label,
        value: _.vstr
      }
    })
    const form = []
    const formDefault = {}
    const data = item.data
    if (data && Object.keys(data).length) {
      Object.keys(data).forEach(key => {
        const selects = Array.isArray(data[key]) ? data[key].filter(Boolean) : data[key]
        form.push({
          key,
          type: selects.length ? 'select' : 'number',
          selects
        })
        if (key === 'region') {
          formDefault[key] = []
        } else {
          formDefault[key] = selects.length ? selects[0].value : ''
        }
      })
    }
    rules.push({
      label: item.label,
      value: item.match_type,
      allowCreate: Boolean(item.input),
      form,
      formDefault,
      logic
    })
  })
  return rules
}
export default disp
function formatActions(list) {
  const actions = []
  list.forEach(item => {
    const actionItem = {
      label: item.label,
      value: item.match_type,
      formDefault: formatActionsItemDefault(item),
      formOptions: deepClone(item)
    }
    if (item.rules) actionItem.formOptions.rules = formatRules(item.rules)
    actions.push(actionItem)
  })
  return actions
}
function formatActionsItemDefault(data) {
  const formDefault = {}
  const FORM_DEFAULT = {
    again_limit: {
      data: {
        again_limit: ''
      }
    },
    contin_dispatch: {
      data: {
        confirm: 'no'
      }
    },
    limit_strategy: {
      option: 'stop_disp',
      stop: {
        option: 'minute',
        data: {
          stop: 1
        }
      }
    },
    theshold: {
      option: 'minute',
      data: {
        theshold: 1
      }
    },
    recovery: {
      option: 'nodo'
    },
    normal_list: {
      data: []
    }
  }
  Object.keys(data).forEach(key => {
    if (FORM_DEFAULT[key]) formDefault[key] = FORM_DEFAULT[key]
  })
  return formDefault
}
function getTreeList(list) {
  const arr = []
  list.forEach(i => {
    i.label = i.name
    i.value = i.id.toString()
    i.ID = i.id
    i.PId = i.pid
    i.Children = []
    if (i.childs && i.childs.length) i.Children = getTreeList(i.childs)
    arr.push(i)
  })
  return arr
}
function treeRegion(data = []) {
  function setlevel(list, index) {
    const level_list = list
    level_list.forEach(i => {
      i.key_level = index
      if (i.childs.length > 0) setlevel(i.childs, index + 1)
    })
    return level_list
  }
  return setlevel(data, 1)
}
