import Fetch from '@/utils/fetch'
import { formatObjToList } from '@/utils/format'
function formatLogicSelectByKey(key, list, selectLogisMap) {
  return list.map(key => {
    const item = selectLogisMap[key]
    const label = item[`name_${key}`] || item.label
    return {
      label,
      value: item.value
    }
  })
}

function formatSelect(data = []) {
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
      const label = data[value]
      list.push({
        label,
        value
      })
    })
  }
  return list
}

const state = {
  loadingSettings: true,
  domainId: '',
  logicMap: {},
  bots: {},
  logics: [],
  rules: [],
  sslRules: [],
  domainRules: [],
  domainSelects: [],
  groupIds: {},
  groupSelects: [],
  selectIpList: [],
  region: [],
  regionMap: {},
  selects: {
    status: [
      {
        label: '关闭',
        value: 0
      },
      {
        label: '启用',
        value: 1
      },
      {
        label: '暂停',
        value: 2
      },
      {
        label: '已到期',
        value: 3
      },
      {
        label: '降级',
        value: 4
      }
    ],
    week: [
      {
        label: '周一',
        value: 1
      },
      {
        label: '周二',
        value: 2
      },
      {
        label: '周三',
        value: 3
      },
      {
        label: '周四',
        value: 4
      },
      {
        label: '周五',
        value: 5
      },
      {
        label: '周六',
        value: 6
      },
      {
        label: '周日',
        value: 0
      }
    ],
    timeType: [
      {
        label: '秒',
        value: 'second'
      },
      {
        label: '分钟',
        value: 'minute'
      },
      {
        label: '小时',
        value: 'hour'
      },
      {
        label: '天',
        value: 'day'
      }
    ],
    actionLebelType: [
      {
        label: '默认',
        value: 'default'
      },
      {
        label: '普通',
        value: 'normal'
      },
      {
        label: '严格',
        value: 'strict'
      },
      {
        label: '验证码',
        value: 'captcha'
      }
    ],
    actionType: [
      {
        label: '通用',
        value: 'anticc'
      },
      {
        label: '观察',
        value: 'watch'
      },
      {
        label: '放行',
        value: 'pass'
      },
      {
        label: '阻断',
        value: 'deny'
      },
      {
        label: '封禁',
        value: 'block'
      },
      {
        label: '人机验证',
        value: 'verification'
      },
      {
        label: '加白',
        value: 'white'
      },
      {
        label: '蜜网牵引',
        value: 'web_pot'
      },
      {
        label: '重定向',
        value: 'redirect'
      }
    ],
    actionBotType: [
      {
        label: '通用',
        value: 'anticc'
      },
      {
        label: '观察',
        value: 'watch'
      },
      {
        label: '阻断',
        value: 'deny'
      },
      {
        label: '封禁',
        value: 'block'
      },
      {
        label: '人机验证',
        value: 'verification'
      },
      {
        label: '蜜网牵引',
        value: 'web_pot'
      },
      {
        label: '重定向',
        value: 'redirect'
      }
    ],
    verificationType: [
      {
        label: 'Cookie验证',
        value: 'cookie'
      },
      {
        label: 'JS验证',
        value: 'js'
      },
      {
        label: '智能验证码',
        value: 'captcha'
      }
    ],
    protocol: [
      {
        label: 'Http',
        value: 'http'
      },
      {
        label: 'Https',
        value: 'https'
      }
    ],
    ruleFrom: [],
    cpuArch: [
      {
        label: 'x86',
        value: 'x86'
      },
      {
        label: 'armeabi',
        value: 'armeabi'
      },
      {
        label: 'armeabi-v7a',
        value: 'armeabi-v7a'
      },
      {
        label: 'arm64-v8a',
        value: 'arm64-v8a'
      }
    ],
    deviceOS: [
      {
        label: '安卓',
        value: 'android'
      },
      {
        label: 'IOS',
        value: 'ios'
      },
      {
        label: 'Windows',
        value: 'windows'
      }
    ],
    deviceRisk: [
      {
        label: '模拟器',
        value: 'simulator'
      },
      {
        label: 'Root',
        value: 'root'
      },
      {
        label: 'VPN',
        value: 'vpn'
      },
      {
        label: '代理',
        value: 'proxy'
      },
      {
        label: 'Hook',
        value: 'hook'
      },
      {
        label: '越狱',
        value: 'jailbreak'
      }
    ],
    action: [
      {
        label: '观察',
        value: 'watch'
      },
      {
        label: '放行',
        value: 'pass'
      },
      {
        label: '阻断',
        value: 'deny'
      }
    ],
    webHoneyType: [
      {
        label: '后台诱导',
        value: 'admin'
      },
      {
        label: '威胁设备诱导',
        value: 'threaten_equipment'
      }
    ]
  }
}

const mutations = {
  SET_DOMAIN_ID: (state, data) => {
    state.domainId = data
    // TODO 修复组件无法监听改变，应该有更好的实现
    state.groupIds = {
      aR: '',
      cc: '',
      sP: '',
      zL: '',
      bot: ''
    }
  },
  SET_SELECT_REGION: (state, data) => {
    state.region = data
  },

  SET_SELECT_REGION_MAP: (state, data) => {
    state.regionMap = data
  },
  SET_GROUP_LIST: (state, data) => {
    data.forEach(_ => {
      state.groupIds[_.from] = _.id
    })
    state.groupList = data
  },

  SET_DOMAIN_SELECTS: (state, data) => {
    const { list = [] } = data
    state.domainSelects = list.map(_ => {
      return {
        label: _.domain,
        value: _.domain
      }
    })
  },

  SET_SETTINGS: (state, { data, type }) => {
    const selectLogis = []
    Object.keys(data.logic).forEach(key => {
      const item = data.logic[key]
      selectLogis.push({
        label: item.name,
        value: item.cfg,
        ...item
      })
    })

    const selectLogisMap = {}
    selectLogis.forEach(item => {
      selectLogisMap[item.value] = item
    })

    const rules = []
    const logicMap = {}
    Object.keys(data.rules).forEach(key => {
      const item = data.rules[key]
      rules.push({
        label: item.name,
        value: key
      })
      // logicMap[key] = formatLogicSelectByKey(key, selectLogis.filter(_ => item.logic.includes(_.value)))
      logicMap[key] = formatLogicSelectByKey(key, item.logic, selectLogisMap)

      if (item.data instanceof Object) {
        Object.keys(item.data).forEach(itemKey => {
          state.selects[`${key}_${itemKey}`] = formatSelect(item.data[itemKey])
        })
      }
    })

    if (type === 'plus') {
      state.rules = rules
      state.domainRules = rules
      state.logics = selectLogis
      state.logicMap = logicMap
      state.bots = data.bots
      state.loadingSettings = false
    } else {
      state.sslRules = rules
      state.loadingSettings = false
    }
  },

  SET_DOMAIN_SETTINGS: (state, data) => {
    const rules = []
    Object.keys(data.rules).forEach(key => {
      const item = data.rules[key]
      rules.push({
        label: item.name,
        value: key
      })
    })
    state.domainRules = rules
  }
}
function formatOptions(item) {
  return {
    label: item.name,
    value: item.key
  }
}
const actions = {
  async fetchSettings({ commit, state, dispatch }, { domainId, type = 'plus' } = {}) {
    if (type === 'plus' && !state.rules.length) {
      const data = await Fetch.get('/fd/V4/firewall.tpl.cfg', { type })
      commit('SET_SETTINGS', { data, type })
    }
  },

  async initAreaView({ commit }) {
    const { countrys, provinces, ipRegions } = await Fetch.get('/fd/V4/share_data.region')
    if (!countrys) return
    const list = [{
      value: 'CNPR',
      label: '中国大陆'
    }, {
      value: 'CNHMT',
      label: '港澳台'
    }]
    list.push(...formatObjToList(countrys))
    const chinaList = formatObjToList(provinces).map(_ => {
      return {
        label: _.label,
        value: _.value
      }
    })
    list.push(...chinaList)

    const selectRegion = {
      world: [],
      china: chinaList,
      list
    }

    const regionMap = {
      CNPR: new Set(Object.keys(provinces)),
      CNHMT: new Set(['HK', 'MO', 'TW'])
    }

    ipRegions.forEach(item => {
      list.push({
        label: item.name,
        value: item.key
      })
      regionMap[item.key] = new Set(item.child.map(_ => _.key))
      let options = item.child.map(_ => {
        list.push({
          label: _.name,
          value: _.key
        })
        let _options
        if (_.child) {
          regionMap[_.key] = new Set(_.child.map(_ => _.key))
          _options = _.child.map(formatOptions)
        }

        return {
          options: _options,
          value: _.key,
          label: _.name
        }
      })

      regionMap['CN'] = new Set(['CNPR', 'CNHMT'])
      // TODO
      if (item.key === 'CN') {
        options = [
          {
            label: '中国大陆',
            options: chinaList
          },
          {
            label: '港澳台',
            options
          }
        ]
      }

      selectRegion.world.push({
        label: item.name,
        value: item.key,
        options
      })
    })

    commit('SET_SELECT_REGION', selectRegion)
    commit('SET_SELECT_REGION_MAP', regionMap)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
