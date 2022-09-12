<template>
  <DmDialog
    ref="dmdialog"
    :title="'详情'"
    :footer="false"
    width="700px"
    aside
  >
    <div>
      <el-tabs v-model="activeName" type="border-card" >
        <el-tab-pane label="渠道详情" name="detail">
          <el-form :model="end_user_relation">
            <el-form-item label="终端邮箱">{{ formartVal(rowData,'end_member_email') }}</el-form-item>
            <el-form-item label="客户实名认证名称">{{ formartVal(rowData,'certification_name') }}</el-form-item>
            <el-form-item label="渠道邮箱">{{ formartVal(rowData,'channel_member_email') }}</el-form-item>
            <el-form-item label="所属销售">{{ formartVal(rowData,'sales') }}</el-form-item>
            <el-form-item label="关联类型">{{ formartVal(end_user_relation,'relation_mode') }}</el-form-item>
            <el-form-item label="关联时间">{{ formartVal(end_user_relation,'updated_at') }}</el-form-item>
            <el-form-item label="备注">{{ end_user_relation.remark }}</el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="log">
          <DmTable min-height>
            <el-table :data="history">
              <el-table-column v-for="tab in column" :key="tab.prop" :label="tab.label">
                <template slot-scope="scope">
                  {{ formartVal(scope.row, tab.prop) }}
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </el-tab-pane>
      </el-tabs>
    </div>
  </DmDialog>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      activeName: 'detail',
      history: [],
      end_user_relation: {},
      channel: {},
      rowData: {},
      column: [
        { label: 'ID', prop: 'id' },
        { label: '操作类型', prop: 'op_type' },
        { label: '关联类型', prop: 'relation_mode' },
        { label: '操作时间', prop: 'op_time' },
        { label: '备注', prop: 'remark' }
      ],
      option: {
        op_type: [
          { label: '新增终端客户', value: '1' },
          { label: '变更关联类型', value: '2' },
          { label: '解除关联', value: '3' }
        ],
        relation_mode: [
          { label: '代理', value: '1' },
          { label: '代销', value: '2' }
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
    handleOpen(data) {
      this.loading = true
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.detail({ id: data.id })
        this.rowData = Object.assign({}, data)
      })
    },

    async detail(params) {
      try {
        const data = await this.Fetch.get('/V4/cbms.cb.channel.end.user.detail', params)
        this.channel = data.channel
        this.end_user_relation = data.end_user_relation
        this.history = data.history
      } catch (error) {
        this.channel = {}
        this.end_user_relation = {}
        this.history = []
        return
      }
    },

    formartVal(data = {}, prop = '') {
      let val = data[prop]
      if (prop === 'cop_status') {
        val = this.option.cop_status.find(i => { return i.value === val }) ? this.option.cop_status.find(i => { return i.value === val }).label : ''
      } else if (prop === 'type') {
        val = this.option.type.find(i => { return i.value === val }) ? this.option.type.find(i => { return i.value === val }).label : ''
      } else if (prop === 'op_type') {
        val = this.option.op_type.find(i => { return i.value === val }) ? this.option.op_type.find(i => { return i.value === val }).label : ''
      } else if (prop === 'relation_mode') {
        val = this.option.relation_mode.find(i => { return Number(i.value) === Number(val) }) ? this.option.relation_mode.find(i => { return Number(i.value) === Number(val) }).label : ''
      }
      return val
    }
  }
}
</script>
