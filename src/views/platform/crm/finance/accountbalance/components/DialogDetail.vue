<style lang="postcss">
.DialogDetail {
  .el-dialog__header {
    border-bottom: 0.5px solid #cdcdcd;
    .el-dialog__title {
      padding-left: 5px;
      border-left: 3px solid #409eff;
    }
  }
  .el-dialog__body {
    padding: 5px 5px !important;
  }
  .el-dialog__footer {
    padding: 10px 0 0;
    .dialog-footer {
      padding: 10px;
      border-top: 0.5px solid #cdcdcd;
    }
  }
}
.el-table th {
  border-top: 1px solid rgb(223, 229, 236);
  background-color: $--color-primary;
  color: #ffffff;
  padding: 8px 0;
}
</style>
<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    width="1000px"
    class="DialogDetail"
    @close="handleClose"
  >
    <tab-list
      :data="list"
      :tabkey="tabkey"
      :pay_type="pay_type"
    />
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="info"
        @click="open = false"
      >关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

import tabList from './tabList'
export default {
  components: {
    tabList
  },
  data() {
    return {
      open: false,
      loading: false,
      list: [],
      pay_type: {
        'bank': '银行转账',
        'alipay': '支付宝',
        '': ''
      },
      tabkey: 1,
      title: '',
      title_text: { 'flow': '余额明细', 'opDetail': '操作详情' }
    }
  },

  computed: {},

  methods: {
    async handleOpen(data, type) {
      this.open = true
      this.title = this.title_text[type]
      const params = {
        member_id: data.id,
        log_type: type
      }
      this.list = []
      this.tabkey += 1
      await this.InvokeAllApi.get('V4/financial.flow.member.balance.change.list', params).then(res => {
        const list = JSON.parse(JSON.stringify(res.list)) || []
        this.list = list
      })
    },

    handleClose() {
      this.open = false
    },

    rowMouse(row, column, cell, event) {
    }
  }
}
</script>
