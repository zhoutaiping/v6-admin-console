<style lang="scss" >
.dialog-invoice-post{
    .dialog-invoice-form{
      margin-top: 10px;
      .dialog-invoice-form-item {
        .dialog-invoice-form-input {
          width: 300px;
        }
      }
    }
    .el-dialog__header {
      border-bottom: 0.5px solid #cdcdcd;
      .el-dialog__title {
        padding-left: 5px;
        border-left: 3px solid #409EFF;
      }
    }
    .el-dialog__body{
      padding: 10px 10px !important;
    }
    .el-dialog__footer{
      padding: 10px 0 0;
      .dialog-footer {
        padding: 10px;
        border-top: 0.5px solid #cdcdcd;
      }
    }
  }
</style>
<template>
  <el-dialog :visible.sync="open" :close-on-click-modal="true" :close-on-press-escape="true" title="确认退票" width="500px" class="dialog-invoice-post" @close="handleClose('postForm')">
    <el-form ref="postForm" :model="refundForm" :rules="POSTFORM_RULE" label-position="left" label-width="80px" size="mini" class="dialog-invoice-form" >
      <el-form-item label="备注" class="dialog-invoice-form-item" prop="refund_remark">
        <el-input v-model="refundForm.refund_remark" type="textarea" placeholder="备注" class="dialog-invoice-form-input"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose('postForm')">取 消</el-button>
      <el-button :disabled="loading" type="primary" @click="handleSubmit('postForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Form from '@/utils/form'
import * as FORM from './c-from.js'
import InvoiceResource from '@/api/finance/invoiceApi'
export default {
  data() {
    return {
      open: false,
      loading: false,
      refundForm: new Form({ id: '', refund_remark: '' }, {}),
      POSTFORM_RULE: FORM.POSTFORM_RULE
    }
  },

  methods: {
    handleOpen(data) {
      this.loading = true
      this.open = true
      this.refundForm.reset()
      this.refundForm.id = data.id
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },

    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.open = false
    },

    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.refundForm.id,
            refund_remark: this.refundForm.refund_remark
          }
          this.loading = true
          InvoiceResource.invoiceRefundConfirm(params).then(res => {
            this.loading = false
            this.Message('ACTION_SUCCESS')
            this.$emit('handleload')
            this.open = false
          }).catch(e => { this.loading = false })
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>

