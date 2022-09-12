<template>
  <el-table v-loading="loading" :data="data" border>
    <el-table-column
      v-for="(item, c_index) in column"
      :key="c_index"
      :label="item.label"
      :width="item.width"
    >
      <template slot-scope="scope">
        {{ formartValue(scope.row, item.props) }}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => []
    },
    column: {
      type: Array,
      default: () => []
    },
    orderType: {
      type: Object,
      default: () => {}
    },
    buyType: {
      type: Array,
      default: () => []
    },
    orderStatus: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      list: [],
      loading: false
    }
  },
  watch: {
    data(val) {
      this.init(val)
    }
  },
  methods: {
    async init(val) {
      this.loading = true
      setTimeout(() => { this.loading = false }, 1000)
    },

    formartValue(row, prop) {
      let row_text = row[prop]
      switch (prop) {
        case 'order_type':
          row_text = this.orderType[row[prop]] || ''
          break
        case 'buy_type':
          row_text = this.buyType[row[prop]]
          break
        case 'status':
          row_text = this.orderStatus[row[prop]]
          break
        default:
          break
      }
      return row_text || '--'
    }
  }
}
</script>
