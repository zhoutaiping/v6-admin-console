import { mapMutations, mapState, mapActions } from 'vuex'
import { deepClone } from '@/utils'

const LEN_TYPES = ['len_less_than', 'len_greater_than', 'len_equals']
const LIMIT_TYPES = ['key_rate_greater_than', 'value_rate_greater_than']

export default {
  computed: mapState({
    wafSelects: state => state.waf.selects,
    wafRules: state => state.waf.rules,
    wafSSLRules: state => state.waf.sslRules,
    wafDomainRules: state => state.waf.domainRules,
    wafDomainId: state => state.waf.domainId,
    wafLogics: state => state.waf.logics,
    wafLogicMap: state => state.waf.logicMap,
    wafGroupIds: state => state.waf.groupIds,
    wafBots: state => state.waf.bots,
    wafDomainSelects: state => state.waf.domainSelects,
    wafLoadingSettings: state => state.waf.loadingSettings,
    watSelectIpList: state => state.waf.selectIpList
  }),

  methods: {
    ...mapMutations({
      'WAF_SET_DOMAIN_ID': 'waf/SET_DOMAIN_ID',
      'WAF_SET_GROUP_LIST': 'waf/SET_GROUP_LIST'
    }),
    ...mapActions({
      'wafFetchSettings': 'waf/fetchSettings',
      'initAreaView': 'waf/initAreaView'
    }),

    formatSendRules(list) {
      list = deepClone(list)
      list.forEach(item => {
        const { rule_type: type, data, logic } = item

        if (type === 'args' || type === 'post_args') {
          const { key, value } = data
          let nData = { key, value }
          if (value instanceof Object) {
            nData = {
              key,
              len: value.len
            }
          }

          if (logic === 'not_exist') {
            item.data = [key]
          } else {
            item.data = [nData]
          }
        } else if (type === 'req_header_entry') {
          const { key, value } = data
          let val = value
          if (value instanceof Object) {
            val = value.len
          }
          if (logic === 'contains' || logic === 'not_contains') {
            item.data = {
              [key]: [val]
            }
          } else if (LIMIT_TYPES.includes(logic)) {
            item.data = {
              header: key,
              ...value
            }
          } else if (logic === 'not_exist') {
            item.data = [key]
          } else {
            item.data = {
              [key]: val
            }
          }
        } else if (type === 'url_type') {
          item.data = [item.data]
        }
      })
      return list
    },

    formatLoadRules(list = []) {
      list = deepClone(list)
      list.forEach(item => {
        const { rule_type: type, data, logic } = item

        if (type === 'args' || type === 'post_args') {
          // TODO
          const itemValue = data[0]
          if (itemValue.len) {
            itemValue.value = {
              len: itemValue.len
            }
          }
          if (logic === 'not_exist') {
            item.data = {
              key: data[0]
            }
          } else {
            item.data = itemValue
          }
        } else if (type === 'ip_url_rate_limit') {
          // TODO InputRulesCommonData bug
          delete item.data.status
        } else if (type === 'req_header_entry') {
          const key = Object.keys(data)[0]
          const value = Object.values(data)[0]

          if (logic === 'contains' || logic === 'not_contains') {
            item.data = {
              key,
              value: value[0]
            }
          } else if (LEN_TYPES.includes(logic)) {
            item.data = {
              key,
              value: {
                len: value
              }
            }
          } else if (LIMIT_TYPES.includes(logic)) {
            item.data = {
              key: data.header,
              value: {
                interval: data.interval,
                reqs: data.reqs
              }
            }
          } else if (logic === 'not_exist') {
            item.data = {
              key: data[0]
            }
          } else {
            item.data = {
              key,
              value
            }
          }
        } else if (type === 'url_type') {
          item.data = item.data[0]
        }
      })
      return list
    }
  }
}
