<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handlePay"
    title="启用带宽付费"
    aside
    class="yd-dialog--order"
  />
</template>
<script>
export default {
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
      })
    },

    handlePay() {}
  }
}
</script>
