<style lang="scss">
.el-dialog__body {
  padding-top: 10px;
  padding-bottom:0;
}
</style>
<template>
  <el-dialog :close-on-press-escape="true" :visible="open" title="审核申请" width="400px" @close="handleClose">
    <div>
      <el-form ref="checkForm" :model="checkForm" :rules="rules" size="mini" label-position="left">
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="checkForm.status" clearable>
            <el-option v-for="(item, index) in STATUS" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" size="mini" @click="handleClose">取 消</el-button>
      <el-button :disabled="loading" type="primary" size="mini" @click="handleSubmit('checkForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      loading: false,
      checkForm: {
        status: ''
      },
      STATUS: [
        { label: '通过', value: '1' },
        { label: '不通过', value: '3' }
      ],
      rules: {
        status: [{ required: true, message: '请选择审核状态', trigger: ['change', 'blur'] }]
      },
      rowData: {}
    }
  },
  methods: {
    handleOpen(data) {
      this.loading = true
      this.$nextTick(() => {
        this.rowData = data
        setTimeout(() => {
          this.resetForm('checkForm')
        }, 100)
        this.open = true
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields()
    },
    handleClose() {
      this.open = false
    },
    handleSubmit(formName) {
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.rowData.id,
            check_status: this.checkForm.status
          }
          this.InvokeAllApi.post('/V4/Account.certification.editStatus', params).then(res => {
            this.loading = false
            this.Message('ACTION_SUCCESS')
            this.open = false
            this.$emit('handleLoad')
          }).catch(e => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
