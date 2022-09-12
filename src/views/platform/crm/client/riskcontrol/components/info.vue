<template>
  <DmDialog
    ref="dmdialog"
    :title="'详情'"
    :footer="false"
    width="780px"
    aside>
    <el-form
      :model="form"
      label-position="left"
      label-width="120px">
      <DmCardPanel title="用户基本信息">
        <el-form-item
          label="用户邮箱"
          class="item-box">{{ rowData.member_email }}</el-form-item>
      </DmCardPanel>
      <DmCardPanel title="确认同人信息">
        <DmData ref="DmData" :auto-init="false" @init="fetchList">
          <DmTable :loading="loading" min-height>
            <el-table :data="list">
              <el-table-column
                label="疑似同人邮箱"
                prop="member_email"
                show-overflow-tooltip />
              <el-table-column
                label="实名认证名称"
                prop="certification_name"
                width="120" />
              <el-table-column
                label="匹配维度"
                prop="risk_dimension" />
              <el-table-column
                label="同人确认"
                prop="fellow_status"/>
            </el-table>
          </DmTable>
        </DmData>
      </DmCardPanel>
    </el-form>
  </DmDialog>
</template>

<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/risk.customer.detail',
      bindParams: {},
      loading: false,
      form: {},
      tab: 'setting',
      rowData: {}
    }
  },
  methods: {
    handleOpen(data, option) {
      this.bindParams = { id: data.id }
      this.loading = true
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.tab = 'setting'
        this.rowData = Object.assign({}, data)
        setTimeout(() => {
          this.$refs.DmData && this.$refs.DmData.initPage()
        }, 100)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-divider--horizontal {
  margin: 5px 0;
}
.item-box {
  margin-bottom: 5px;
}
</style>
