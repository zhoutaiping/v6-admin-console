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
function findRegin(list, value) {
  let find = ''
  for (let i = 0; i < list.length; i++) {
    if (list[i].value === value) {
      find = list[i].label
      break
    } else {
      if (list[i].children && list[i].children.length) {
        find = findRegin(list[i].children, value)
        if (find) break
      }
    }
  }
  return find
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
      const Region = this.Region || []
      if (data && Object.keys(data).length && data.region) {
        if (data.region && data.region.length) {
          const str_item = []
          data.region.forEach(i => {
            str_item.push(findRegin(Region, i))
          })
          str = str_item.join('/')
        } else {
          str = (data.region).join(',')
        }
      }
      return str
    }

  }
})
</script>
