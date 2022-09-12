<style lang="postcss" scoped>
.dialog-invoice-refundConfirm{

    .dialog-invoice-form{
      margin-top: 10px;
      .dialog-invoice-form-item {

        .dialog-invoice-form-input {
          width: 300px;
        }
      }
    }

  }
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="'确认退票'"
    width="500px"
    aside
    class="dialog-invoice-refundConfirm"
  >
    <DmScroll>
      <el-form ref="refundForm" :model="refundForm" :rules="REFUNDFORM_RULE" label-position="left" label-width="120px" size="mini" class="dialog-invoice-form" >
        <el-form-item label="开票邮箱" class="dialog-invoice-form-item"> {{ rowData.email }}  </el-form-item>
        <el-form-item label="退票扫描件" class="dialog-invoice-form-item" prop="refund_img">
          <el-popover v-if="refundForm.refund_img" placement="left-start">
            <img :src="refundForm.refund_img" class="image" style="height:575px;" alt="">
            <img slot="reference" :src="refundForm.refund_img" class="image" style="width:300px; height:150px;" alt="">
          </el-popover>
          <el-upload
            ref="upload"
            :action="url"
            :on-change="fileChange"
            :file-list="fileList"
            :show-file-list="false"
            :auto-upload="false"
            class="upload-demo">
            <el-button slot="trigger" size="mini" type="primary" style="margin-left:0px;">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" class="dialog-invoice-form-item" prop="refund_remark">
          <el-input v-model="refundForm.refund_remark" type="textarea" placeholder="请填写备注" class="dialog-invoice-form-input"/>
        </el-form-item>
        <el-form-item label="退票原因" class="dialog-invoice-form-item">
          {{ rowData.refund_reason }}
        </el-form-item>
        <el-form-item label="退票寄回物流" class="dialog-invoice-form-item">
          {{ rowData.refund_express_company }}
        </el-form-item>
        <el-form-item label="物流单号" class="dialog-invoice-form-item">
          {{ rowData.refund_express_code }}
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import InvoiceResource from '@/api/finance/invoiceApi'

export default {
  data() {
    return {
      loading: false,
      url: '',
      fileList: [],
      default: {
        'id': '',
        'refund_img': '',
        'refund_img-file': '',
        'refund_remark': ''
      },
      refundForm: {},
      REFUNDFORM_RULE: {
        refund_img: [],
        refund_remark: [{ required: true, message: ' ' }]
      },

      rowData: {}
    }
  },

  methods: {
    handleOpen(data) {
      this.rowData = Object.assign({}, data)
      this.refundForm = Object.assign({}, this.default)
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.loading = true
        this.refundForm.id = data.id
        setTimeout(() => { this.loading = false }, 1000)
      })
    },

    fileChange(file, fileList) {
      this.refundForm.refund_img_file = file.raw
      const img = new FileReader()
      img.readAsDataURL(file.raw)
      img.onload = () => {
        this.refundForm.refund_img = img.result
      }
    },

    handleSubmit(formName = 'refundForm') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.refundForm
          const paramsData = new FormData()
          paramsData.append('id', data.id)
          paramsData.append('refund_img', data.refund_img_file)
          paramsData.append('refund_remark', data.refund_remark)
          InvoiceResource.invoiceRefundConfirm(paramsData).then(res => {
            this.message.success('退票成功')
            this.$emit('handleload')
            this.$refs.dmdialog.handleClose()
          }).catch(e => { this.$refs.dmdialog.afterValidate() })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }
}
</script>

