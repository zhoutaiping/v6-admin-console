<style lang="postcss" scoped>
</style>

<template>
  <el-dialog
    :visible="open"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    title="审核应收单"
    class="el-dialog--DialogConfirm"
    width="500px"
    @close="handleClose"
  >
    <div style="text-align:center">
      <i class="el-icon-info" />审核通过后将自动同步到财务金蝶系统，请谨慎操作！
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        :disabled="loading"
        type="danger"
        plain
        @click="handleSubmit(3)"
      >不通过</el-button>
      <el-button
        :disabled="loading"
        type="primary"
        @click="handleSubmit(2)"
      >通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      open: false,
      id: ''
    }
  },

  methods: {
    handleOpen(data) {
      this.open = true
      this.id = data.id
    },

    handleClose() {
      this.open = false
    },

    handleSubmit(type) {
      const api = '/V4/receivable.sys.financial.confirm'
      this.loading = true
      this.InvokeAllApi.post(api, {
        id: this.id,
        financial_confirm_status: type
      }).then(res => {
        this.loading = false
        this.Message('ACTION_SUCCESS')
        this.$emit('handleload')
        this.handleClose()
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>
