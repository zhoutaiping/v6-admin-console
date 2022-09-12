。<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :fetch-submit="fetchSubmit"
    width="600px"
    title="解除关联"
  >
    <DmScroll>
      <DmAlert>
        <p>
          提醒：解除关联前，需确保该终端客户下的所有订单均已完成支付，且已开具发票。
        </p>
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >

        <el-form-item label="解除原因" prop="lift_reason">
          <DmSelect
            v-model="form.lift_reason"
            :selects="option.lift_reason"
            placeholder="解除原因"
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="原因说明" prop="remark">
          <el-input
            v-model="form.lift_reason_detail"
            placeholder=""
            type="textarea"
            class="input-box"
          />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>

<script>
export default {
  data() {
    return {
      form: { },
      default_form: {
        id: '',
        lift_reason: '',
        lift_reason_detail: ''
      },
      rules: {
        id: [{ required: true, message: ' ' }],
        lift_reason: [{ required: true, message: ' ' }],
        lift_reason_detail: []
      },
      option: {
        lift_reason: [
          { label: '中止渠道关系', value: '1' },
          { label: '设置错误', value: '2' }
        ]
      },
      mode: 'Create'
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (data && Object.keys(data).length) {
          this.form = Object.assign({}, JSON.parse(JSON.stringify(data)))
        } else {
          this.form = Object.assign({}, this.default_form)
          this.form.id = ''
        }
      })
    },

    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const api = '/V4/cbms.cb.channel.end.user.remove.relation'
          const data = {
            id: this.form.id,
            lift_reason: this.form.lift_reason,
            lift_reason_detail: this.form.lift_reason_detail
          }
          this.Fetch.post(api, data).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.dialog.handleClose()
          }).catch(e => {
            this.$refs.dialog.afterValidate()
          })
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
