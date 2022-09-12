<template>
  <div :class="b()">
    <div
      v-for="(item, index) in list"
      :key="index"
    >
      {{ item.title }}
      <template v-if="item.view || (item.list && item.list.length)">
        ：
      </template>
      <template v-if="item.view || item.view === 0">
        {{ item.view }}
      </template>
      <template v-else>
        <template v-if="item.type === 'ip' && ['in', 'not_in'].includes(item.logic)">
          <ColumnListMore
            :value="item.list"
            :lavel-view-list="watSelectIpList"
          />
        </template>
        <template v-else>
          <ColumnListMore :value="item.list" />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import column from '@/mixins/column'
import ColumnListMore from '@/components/Column/ColumnListMore'
import wafMixins from '@/views/platform/business/mixins/waf'
import { labelView } from '@/utils/filter'
import { formatRegionView } from '@/utils/format'
import { province as Province } from '@/constants/city-data'
import { isDef } from '@/utils'
import { mapGetters } from 'vuex'

const itemMap = {
  cpu_arch: 'cpuArch',
  device_os: 'deviceOS',
  device_risk: 'deviceRisk',
  device_type: 'device_type_types',
  req_method: 'req_method_methods',
  req_protocol: 'req_protocol_req_protocols',
  ip_type: 'ip_type_types',
  url_type: 'url_type_url_type_map'
}

export default create({
  name: 'ColumnRules',

  components: { ColumnListMore },

  mixins: [column, wafMixins],

  props: {
    items: Array
  },

  data() {
    return {
      list: []
    }
  },

  computed: {
    selectRegion() {
      return this.$store.state.waf.region
    },
    selectRegionMap() {
      return this.$store.state.waf.regionMap
    },
    ...mapGetters([
      'configRules'
    ])
  },

  watch: {
    items(val) {
      this.init()
    },
    configRules(val) {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const nList = []
      const items = this.formatLoadRules(this.items)
      items.forEach(_ => {
        const data = _.data
        const type = _.rule_type
        let list = []
        let view = ''
        let afterTitle = ''

        if (Array.isArray(data)) {
          const selectName = itemMap[type]
          if (selectName) {
            list = data.map(_ => labelView(_, this.wafSelects[selectName]))
          } else {
            list = data
          }
        }

        if (typeof data === 'object' && data.len >= 0) {
          view = data.len
        }

        if (type === 'region') {
          if (data.country.includes('CN') && !data.province.length) {
            data.province.push(...Province.map(_ => _.value))
          }
          const valueMap = formatRegionView([...data.country, ...data.province], this.selectRegionMap)
          for (const [key, item] of valueMap) {
            const title = labelView(key, this.selectRegion.list)
            if (item === 'all') {
              list.push(title)
            } else {
              list.push(...item.map(_ => labelView(_, this.selectRegion.list)))
            }
          }
        } else if (type === 'req_time') {
          const { startTime, endTime, weeks = [] } = data
          let weeksView = '每'
          weeks.forEach((item, index) => {
            if (index > 0) weeksView += '、'
            weeksView += labelView(item, this.wafSelects.week)
          })
          view = `${weeksView} 的 ${startTime} - ${endTime}`
        } else if (type === 'req_header_entry') {
          afterTitle = data.key || data.header
          view = data.value
          if (typeof data.value === 'object') {
            const _data = data.value
            if (isDef(_data.interval) && isDef(_data.reqs)) {
              view = `${_data.interval} 秒内请求头频率大于 ${_data.reqs} 次`
            }
            if (_data.len) {
              view = _data.len
            }
          }
        } else if (type === 'args' || type === 'post_args') {
          afterTitle = data.key
          view = data.len || data.value
        } else if (type === 'upstream_status') {
          afterTitle = data.status.join(',')
        } else if (type === 'url_type') {
          list.push(labelView(data, this.wafSelects[itemMap[type]]))
        }

        if (isDef(data.interval) && isDef(data.reqs)) {
          view = `${data.interval} 秒内频率大于 ${data.reqs} 次`
        }

        const title = `${labelView(type, this.configRules)}${afterTitle}[${labelView(_.logic, this.wafLogicMap[type])}]`

        nList.push({
          title,
          list,
          view,
          type,
          logic: _.logic
        })
      })
      this.list = nList
    }
  }
})
</script>
