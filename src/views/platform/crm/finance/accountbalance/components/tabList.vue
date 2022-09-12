<template>
  <el-table
    :data="data"
    :key="tabkey"
    :height="400"
    border
    style="width:100%"
  >
    <el-table-column
      v-for="(item,key) in FLOW_COLUMN"
      :key="key"
      :label="item.label"
      :width="item.width"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        {{ formartValue(scope.row, item.prop) }}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    pay_type: {
      type: Object,
      default: () => {}
    },
    tabkey: {
      type: Number, default: () => 1
    }
  },
  data() {
    return {
      FLOW_SOURCE_TEXT: {
        1: '银行转帐', 2: '支付宝转账', 3: '微信转账', 4: '支付宝充值', 5: '微信充值', 6: '线下转账余额',
        7: '线上充值余额', 8: '直接退款到银行', 9: '直接退款到支付宝', 10: '直接退款到微信', 11: '白山支付宝充值',
        12: '白山微信充值', 13: '网银充值'
      },
      FLOW_TYPE_TEXT: {
        1: '收款', 2: '打款', 3: '回款', 4: '退款', 5: '提现'
      },
      FLOW_STATUS_TEXT: { 1: '正常', 2: '作废' },

      FLOW_COLUMN: [
        { label: 'ID', prop: 'id', width: '80' },
        { label: '流水类型', prop: 'flow_type', width: '100' },
        { label: '流水来源', prop: 'flow_source', width: '' },
        { label: '流水号', prop: 'flow_code', width: '200' },
        { label: '流水金额', prop: 'flow_money', width: '150' },
        { label: '流水时间', prop: 'flow_time', width: '180' },
        { label: '详情', prop: 'detail', width: '' }
      ],
      OPDETAIL_COLUMN: [
        { label: 'ID', prop: 'id', width: '80' },
        { label: '流水类型', prop: 'flow_type', width: '100' },
        { label: '流水来源', prop: 'flow_source', width: '150' },
        { label: '流水号', prop: 'flow_code', width: '200' },
        { label: '流水金额', prop: 'flow_money', width: '150' },
        { label: '流水时间', prop: 'flow_time', width: '180' },
        { label: '详情', prop: 'detail', width: '' }
      ]
    }
  },
  methods: {
    formartValue(row, prop) {
      let row_text = row[prop] || '--'
      switch (prop) {
        case 'flow_type':
          row_text = this.FLOW_TYPE_TEXT[row[prop]] || '--'
          break
        case 'flow_source':
          row_text = this.FLOW_SOURCE_TEXT[row[prop]] || '--'
          break
        case 'flow_status':
          row_text = this.FLOW_STATUS_TEXT[row[prop]] || '--'
          break
        default:
          break
      }
      return row_text
    }
  }
}
</script>
<style lang="postcss">
</style>

