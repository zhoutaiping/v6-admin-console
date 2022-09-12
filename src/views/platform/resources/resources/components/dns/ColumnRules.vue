<template>
  <div :class="b()">
    <div
      v-for="(item, index) in list"
      :key="index"
    >
      {{ item.title }}：
      <template v-if="item.view">
        {{ item.view }}
      </template>
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import { labelView } from '@/utils/filter'
import { mapState } from 'vuex'
import { formartRegion } from '@/views/platform/business/constant/utils'
function formatItemView(data, config) {
  let str = ''

  config.forEach(item => {
    const value = data[item.key]
    if (item.type === 'select') {
      str = labelView(value, item.selects)
    } else if (item.type === 'number') {
      str = value
    }
  })

  return str
}
export default create({
  name: 'ColumnRules',
  props: {
    items: [Object, Array],
    regionOptions: {
      type: Array, default: () => []
    }
  },

  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapState({
      Region: state => state.disp.region,
      region_list: state => state.disp.region_list,
      Rules: state => {
        return [...state.disp.normalRules, ...state.disp.abnormalRules]
      }
    })
  },
  watch: {
    items(val) {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const nList = []
      const items = this.items
      const Rules = this.Rules || []
      Object.keys(items).forEach(rule_type => {
        const item = items[rule_type]
        const { data, logic } = item

        const ruleConfig = Rules.find(_ => _.value === rule_type)
        let title = ''
        let form = []
        if (ruleConfig) {
          title = `${ruleConfig.label}[${labelView(logic, ruleConfig.logic)}]`
          form = ruleConfig.form
        }
        let view = ''
        if (rule_type === 'ip_region') {
          view = this.regionText(data)
        } else {
          view = formatItemView(data, form)
        }

        nList.push({
          title,
          view: view
        })
      })

      this.list = nList
    },

    regionText(data) {
      let str = ''
      if (data && Object.keys(data).length && data.region) {
        if (data.region && data.region.length) {
          str = formartRegion(data.region, this.region_list)
        } else {
          str = (data.region).join(',')
        }
      }
      return str
    }

  }
})
</script>
