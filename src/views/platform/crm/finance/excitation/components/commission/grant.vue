<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="'佣金发放'"
    width="500px"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item
        label="佣金发放时间"
        prop="paid_arrival_time"
      >
        <el-date-picker
          v-model="form.paid_arrival_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
          placeholder=" "
          class="input-box"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          type="textarea"
          class="input-box"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      form: { is_grant: '1', paid_arrival_time: '', remark: '', ids: [] },
      rules: {
        id: [],
        remark: [],
        paid_arrival_time: [{ required: true, message: ' ' }]
      }
    }
  },
  methods: {
    handleOpen(data) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        if (this.$refs.Form) {
          this.$refs.Form.clearValidate()
        }
        this.form.ids = data && data.map(i => { return i.id }) || []
      })
    },

    handleSubmit(form = 'Form') {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.Fetch.post('/V4/cbms.order.commission.grant', { ...this.form })
            .then((res) => {
              this.Message('ACTION_SUCCESS')
              this.$emit('init')
              this.$refs.dmdialog.handleClose()
            })
            .catch((e) => {
              this.$refs.dmdialog.afterValidate()
            })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.input-box {
  width: 250px;
}
</style>
