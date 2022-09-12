<template>
  <div>
    <DmData ref="DmData" :auto-init="false" @init="fetchList" >
      <DmTable :loading="loading" min-height >
        <el-table :data="list">
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">
              {{ formartValue(scope.row, item.prop) }}
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import { mapState } from 'vuex'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/cbms.cb.channel.history.list',
      bindParams: {},
      column: [
        { label: 'ID', prop: 'id' },
        { label: '用户ID', prop: 'member_id' },
        { label: '客户实名认证名称', prop: 'member_name_auth' },
        { label: '渠道类型', prop: 'type' },
        { label: '操作类型', prop: 'op_type' },
        { label: '注册邮箱', prop: 'member_email' },
        { label: '所属销售', prop: 'sales' },
        { label: '渠道新增解除时间', prop: 'op_time' }
      ],
      option: {
        type: [
          { label: '经销渠道', value: '1' },
          { label: '非正式签约渠道', value: '2' }
        ],
        op_type: [
          { label: '新增', value: '1' },
          { label: '解除', value: '2' },
          { label: '续期', value: '3' }
        ],
        cop_status: [
          { label: '合作中', value: '1' },
          { label: '已解除', value: '2' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      cbmsMap: (state) => state.finance.cbms_map
    })
  },
  watch: {
    cbmsMap: {
      handler(val) {
        if (this.cbmsMap.cop_status && Object.keys(this.cbmsMap.cop_status).length) {
          this.option.cop_status = Object.keys(this.cbmsMap.cop_status).map(i => { return { label: this.cbmsMap.cop_status[i], value: i } })
        }
        if (this.cbmsMap.channel_type && Object.keys(this.cbmsMap.channel_type).length) {
          this.option.type = Object.keys(this.cbmsMap.channel_type).map(i => { return { label: this.cbmsMap.channel_type[i], value: i } })
        }
        if (this.cbmsMap.op_type_cb_channel_history && Object.keys(this.cbmsMap.op_type_cb_channel_history).length) {
          this.option.op_type = Object.keys(this.cbmsMap.op_type_cb_channel_history).map(i => { return { label: this.cbmsMap.op_type_cb_channel_history[i], value: i } })
        }
      }
    }
  },
  methods: {
    init(bindParams = {}) {
      this.bindParams = { ...bindParams }
      this.$refs.DmData.initPage()
    },
    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'cop_status') {
        return this.option.cop_status.find(i => { return i.value === val }) ? this.option.cop_status.find(i => { return i.value === val }).label : ''
      } else if (prop === 'type') {
        return this.option.type.find(i => { return i.value === val }) ? this.option.type.find(i => { return i.value === val }).label : ''
      } else if (prop === 'op_type') {
        return this.option.op_type.find(i => { return i.value === val }) ? this.option.op_type.find(i => { return i.value === val }).label : ''
      }
      return val
    }
  }
}
</script>
