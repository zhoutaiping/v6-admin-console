<template>
  <DmDialog
    ref="Dialog"
    :mode="mode"
    width="750px"
    title="详情"
    submit-text="确定"
    @submit="handleSubmit"
  >
    <DmAlert>
      已分配IP数 {{ info.ip_used }} / {{ info.total }}
    </DmAlert>
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            label="IP"
            prop="ip"
            min-width="200"
          />
          <el-table-column
            label="分配成员"
            prop="email"
            min-width="200"
          />
          <el-table-column
            label="分配时间"
            prop="created_at"
            min-width="200"
          />
        </el-table>
      </DmTable>
    </DmData>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import consoleData from '@/mixins/consoleData'

export default createDialog({
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: '/ip/detail',
      // API_METHOD: 'post',
      bindParams: {
        ip_id: ''
      },
      fetch: this.FetchGateWay,
      info: {
        ip_used: null,
        total: null
      }
      // list: []
    }
  },

  methods: {
    initOptions(form) {
      this.bindParams.ip_id = form.id
      this.info.total = form.amount_of_ip
      this.info.ip_used = form.ip_used
      this.fetchList()
    },

    async handleSubmit(form) {
      this.handleClose()
    }
  }
})
</script>
