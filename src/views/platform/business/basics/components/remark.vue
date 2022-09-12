<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="备注"
    width="600px"
  >
    <div>
      <DmAlert>
        批量设置备注信息
      </DmAlert>
      <el-form ref="Form" :model="form" :rules="rules">
        <el-form-item prop="remark">
          <el-input v-model="form.remark" :rows="4" type="textarea" class="input-box" />
        </el-form-item>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      form: {
        remark: ''
      },

      API: {
        'disp-group-batch.remark': '/fd/V4/disp.group.batch.remark',
        'disp-ippool-batch.remark': '/fd/V4/disp.ippool.batch.remark',
        'disp-domain-forward-batch.remark': '/V4/WebCdnProtection.Domain.batchRemark'
      },
      rules: {
        ids: [],
        remark: [{ required: true, message: ' ' }]
      },
      check: [],
      type: ''
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.check = data
        this.type = option
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
      })
    },

    handleSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const params = {
            ...this.form
          }

          if (this.type === 'disp-ippool-batch.remark') {
            params.ids = this.check.map(e => { return e.ippool_id })
          } else if (this.type === 'disp-group-batch.remark') {
            params.ids = this.check.map(e => { return e.group_id })
          } else if (this.type === 'disp-domain-forward-batch.remark') {
            params.domain_id = this.check.map(e => { return e.id })
          }

          if (!this.type || !this.API[this.type]) {
            this.message.warning('操作失败！请联系管理员')
            return
          }
          this.Fetch.put(this.API[this.type], params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$refs.Dialog.afterValidate()
            this.$refs.Dialog.handleClose()
            this.$emit('init')
          }).catch(e => {
            this.$refs.Dialog.afterValidate()
          })
        } else {
          this.$refs.Dialog.afterValidate()
          return false
        }
      })
    }
  }
}
</script>
