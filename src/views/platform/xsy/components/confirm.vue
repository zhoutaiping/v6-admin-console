<template>
  <el-dialog
    :visible="open"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    title="审核订单"
    width="500px"
    @close="open = false"
  >
    <DmAlert>
      审核通过后将自动同步到销售CRM系统，请谨慎操作！
    </DmAlert>
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
      order_ids: []
    }
  },

  methods: {
    handleOpen(data) {
      this.open = true
      this.order_ids = data.map(i => { return Number(i.order_id) })
    },

    handleSubmit(type) {
      const form = {
        order_ids: this.order_ids,
        order_confirm_status: type,
        order_confirm_status_op: 1
      }
      this.loading = true
      this.InvokeAllApi.post('/V4/xsy.order.update', form).then(res => {
        this.loading = false
        this.Message('ACTION_SUCCESS')
        this.$emit('init')
        this.open = false
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>
