<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="'编辑'"
    width="500px"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        label="选择指定账期进行更新"
        prop="period"
      >
        <el-date-picker
          v-model="form.period"
          type="month"
          value-format="yyyy-MM"
          clearable
          placeholder="账期"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      form: { period: '' },
      rules: {
        period: [{ required: true, message: ' ' }]
      }
    }
  },
  methods: {
    handleOpen() {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        if (this.$refs.Form) {
          this.$refs.Form.clearValidate()
        }
      })
    },

    handleSubmit(form = 'Form') {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.Fetch.post('/V4/balance.advance.create', { ...this.form })
            .then((res) => {
              this.Message('ACTION_SUCCESS')
              this.$emit('initPage')
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
