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
    <Info ref="info" />
    <Edit ref="edit" @init="$refs.DmData.initPage()" />
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Info from '../components/channels/info'
import Edit from '../components/channels/edit'
import { mapState } from 'vuex'
export default {
  components: { Info, Edit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/cbms.cb.channel.end.user.history.list',
      bindParams: {},
      column: [
        { label: 'ID', prop: 'id' },
        { label: '用户ID', prop: 'end_member_id' },
        { label: '客户实名认证名称', prop: 'member_name_auth' },
        { label: '关联类型', prop: 'relation_mode' },
        { label: '终端邮箱', prop: 'end_member_email' },
        { label: '渠道邮箱', prop: 'channel_member_email' },
        { label: '所属销售', prop: 'sales' },
        { label: '操作类型', prop: 'op_type' },
        { label: '操作时间', prop: 'op_time' },
        { label: '备注', prop: 'remark' }
      ],
      option: {
        relation_mode: [
          { label: '代理', value: '1' },
          { label: '代销', value: '2' }
        ],
        op_type: [
          { label: '新增终端客户', value: '1' },
          { label: '变更关联类型', value: '2' },
          { label: '解除关联', value: '3' }
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
        if (this.cbmsMap.relation_mode && Object.keys(this.cbmsMap.relation_mode).length) {
          this.option.relation_mode = Object.keys(this.cbmsMap.relation_mode).map(i => { return { label: this.cbmsMap.relation_mode[i], value: i } })
        }
        if (this.cbmsMap.op_type_cb_channel_end_user_history && Object.keys(this.cbmsMap.op_type_cb_channel_end_user_history).length) {
          this.option.op_type = Object.keys(this.cbmsMap.op_type_cb_channel_end_user_history).map(i => { return { label: this.cbmsMap.op_type_cb_channel_end_user_history[i], value: i } })
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
      if (prop === 'relation_mode') {
        return this.option.relation_mode.find(i => { return Number(i.value) === Number(val) }) ? this.option.relation_mode.find(i => { return Number(i.value) === Number(val) }).label : ''
      } else if (prop === 'op_type') {
        return this.option.op_type.find(i => { return Number(i.value) === Number(val) }) ? this.option.op_type.find(i => { return Number(i.value) === Number(val) }).label : ''
      }
      return val
    }
  }
}
</script>
