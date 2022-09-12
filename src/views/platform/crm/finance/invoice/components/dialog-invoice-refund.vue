<style lang="scss" >
.dialog-invoice-refund{
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
  <el-dialog :visible.sync="open" :close-on-click-modal="true" :close-on-press-escape="true" title="退票申请" width="500px" class="dialog-invoice-refund" @close="handleClose('refundForm')">
    <el-form ref="refundForm" :model="refundForm" :rules="REFUNDFORM_RULE" label-position="left" label-width="120px" size="mini" class="dialog-invoice-form" >
      <el-form-item label="退票原因" class="dialog-invoice-form-item" prop="refund_reason">
        <el-input v-model="refundForm.refund_reason" type="textarea" placeholder="请填写退票原因" class="dialog-invoice-form-input"/>
      </el-form-item>
      <el-form-item label="退回邮寄物流" class="dialog-invoice-form-item" prop="refund_express_company">
        <el-input v-model="refundForm.refund_express_company" placeholder="请填写物流名称" class="dialog-invoice-form-input"/>
      </el-form-item>
      <el-form-item label="物流单号" class="dialog-invoice-form-item" prop="refund_express_code">
        <el-input v-model="refundForm.refund_express_code" placeholder="请填写物流单号" class="dialog-invoice-form-input"/>
      </el-form-item>
      <el-form-item label="备注" class="dialog-invoice-form-item" prop="refund_remark">
        <el-input v-model="refundForm.refund_remark" type="textarea" placeholder="请填写备注" class="dialog-invoice-form-input"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose('refundForm')">取 消</el-button>
      <el-button :disabled="loading" type="primary" @click="handleSubmit('refundForm')">确 定</el-button>
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
      refundForm: new Form({
        'id': '',
        'refund_reason': '',
        'refund_remark': '',
        'refund_express_company': '',
        'refund_express_code': '' }, {}),
      REFUNDFORM_RULE: FORM.REFUNDFORM_RULE
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.refundForm.reset()
    })
  },
  methods: {
    handleOpen(data) {
      this.loading = true
      this.open = true
      this.setFieldValue(data)
      setTimeout(() => { this.loading = false }, 1000)
    },

    setFieldValue(data) {
      this.refundForm.id = data.id
    },

    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.open = false
    },

    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            'id': this.refundForm.id,
            'refund_reason': this.refundForm.refund_reason,
            'refund_remark': this.refundForm.refund_remark,
            'refund_express_company': this.refundForm.refund_express_company,
            'refund_express_code': this.refundForm.refund_express_code
          }
          this.loading = true
          InvoiceResource.invoiceRefund(params).then(res => {
            this.loading = false
            this.message.success('申请退票成功')
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

