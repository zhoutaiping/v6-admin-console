<style lang="scss" scoped>
.form-box {
  margin-top: 10px;
}
.form-box-item {
  margin-bottom: 10px;
}
.item-box {
  margin-bottom: 10px;
}
.input-box {
  width: 300px;
}
.upload_div {
  width: 100%;
  float: left;
  display: flex;
}
.upload_div .el-upload-list__item-name {
  display: none;
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="'审核'"
    width="600px"
    aside
    class="dialog-invoice-review"
  >
    <DmScroll>
      <el-form ref="Form" :model="ReviewForm" :rules="rules" label-position="left" label-width="130px" class="form-box" >
        <el-form-item label="审核操作" class="form-box-item" prop="audit">
          <el-select v-model="ReviewForm.audit" placeholder="" class="input-box">
            <el-option v-for="(item,index) in AUDIT" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :prop="'invoice_taxcode'" label="发票号" class="form-box-item">
          <el-input v-model="ReviewForm.invoice_taxcode" placeholder=" " class="input-box"/>
        </el-form-item>
        <el-form-item :prop="'invoice_time'" label="开具时间" class="form-box-item">
          <el-date-picker
            v-model="ReviewForm.invoice_time"
            :default-value="new Date()"
            placeholder=" "
            type="date"
            value-format="yyyy-MM-dd"
            class="input-box"
          />
        </el-form-item>
        <el-form-item :prop="'refund_remark'" label="备注" class="form-box-item">
          <el-input v-model="ReviewForm.refund_remark" type="textarea" placeholder="备注" class="input-box"/>
        </el-form-item>
        <el-form-item :prop="ReviewForm.audit==='yes'?'':''" label="发票扫描文件" class="form-box-item" label-width="120px" >
          <el-popover v-if="ReviewForm.invoice_img" placement="left-start">
            <img :src="ReviewForm.invoice_img" class="image" style="height:667px;">
            <img slot="reference" :src="ReviewForm.invoice_img" class="image" style="width:300px; height:150px;">
          </el-popover>
          <el-upload
            ref="upload"
            :action="url"
            :on-preview="handlePreview"
            :on-change="fileChange"
            :file-list="fileList"
            :show-file-list="false"
            :auto-upload="false"
            class="upload-demo">
            <el-button slot="trigger" size="mini" type="primary" style="margin-left:10px;">选取图片</el-button>
          </el-upload>
        </el-form-item>
        <h3>金额信息</h3><hr>
        <el-form-item label="关联订单ID" class="form-box-item">
          {{ rowData.order_ids }}
        </el-form-item>
        <el-form-item label="开票总金额" class="form-box-item">
          {{ rowData.invoice_amount }}
        </el-form-item>
        <el-form-item label="开票产品名称" class="form-box-item" prop="invoice_product_name">
          <el-input v-model="ReviewForm.invoice_product_name" placeholder=" " class="input-box"/>
        </el-form-item>
        <h3>发票信息</h3><hr>
        <el-form-item label="发票类型" class="item-box">
          <span>{{ INVOICE_TYPE_TEXT[rowData.invoice_type]|| '--' }}</span>
        </el-form-item>
        <el-form-item label="发票抬头" class="item-box">
          <span>{{ rowData.invoice_title|| '--' }}</span>
        </el-form-item>
        <el-form-item label="税务登记证号" class="item-box">
          <span>{{ rowData.company_taxer_code|| '--' }}</span>
        </el-form-item>
        <el-form-item label="基本开户银行名称" class="item-box">
          <span>{{ rowData.company_bank|| '--' }}</span>
        </el-form-item>
        <el-form-item label="基本开户账号" class="item-box">
          <span>{{ rowData.company_bank_code|| '--' }}</span>
        </el-form-item>
        <el-form-item label="注册场所地址" class="item-box">
          <span>{{ rowData.company_reg_address|| '--' }}</span>
        </el-form-item>
        <el-form-item label="注册固定电话" class="item-box">
          <span>{{ rowData.company_reg_tel|| '--' }}</span>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
// import Form from '@/utils/form'
import * as FORM from './c-from.js'
import InvoiceResource from '@/api/finance/invoiceApi'
export default {
  data() {
    return {
      open: false,
      url: '', fileList: [],
      default: {
        id: '', audit: '', invoice_time: '', invoice_product_name: '', invoice_taxcode: '', invoice_img: '', refund_remark: ''
      },
      rules: {
        audit: [{ required: true, message: ' ' }],
        invoice_taxcode: [{ required: true, message: ' ' }],
        invoice_time: [{ required: true, message: ' ' }],
        invoice_product_name: [{ required: true, message: ' ' }]
      },
      ReviewForm: { },
      REVIEW_RULE: FORM.REVIEW_RULE,
      INVOICE_TYPE_TEXT: { 1: '增值税普通发票', 2: '增值税专用发票' },
      AUDIT: [{ label: '审核通过', value: 'yes' }, { label: '审核不通过', value: 'no' }],
      rowData: {}
    }
  },

  methods: {
    handleOpen(data) {
      this.rowData = Object.assign({}, data)
      this.ReviewForm = Object.assign({}, this.default)
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.loading = true
        this.ReviewForm.id = data.id
        this.ReviewForm.invoice_taxcode = data.invoice_taxcode || ''
        this.ReviewForm.invoice_time = data.invoice_time || ''
        this.ReviewForm.invoice_product_name = data.invoice_product_name || ''
        this.ReviewForm.refund_remark = data.refund_remark || ''

        setTimeout(() => { this.loading = false }, 1000)
      })
    },

    fileChange(file, fileList) {
      this.ReviewForm.invoice_img_field = file.raw
      const img = new FileReader()
      img.readAsDataURL(file.raw)
      img.onload = () => {
        this.ReviewForm.invoice_img = img.result
      }
    },

    getFile(event) {
      this.form.screenshot = event.target.files[0]
    },

    handlePreview(file) {
    },

    handleSubmit(formName = 'Form') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = new FormData()
          data.append('id', this.ReviewForm.id)
          data.append('audit', this.ReviewForm.audit)
          data.append('invoice_taxcode', this.ReviewForm.invoice_taxcode)
          data.append('invoice_img', this.ReviewForm.invoice_img_field)
          data.append('refund_remark', this.ReviewForm.refund_remark)
          data.append('invoice_time', this.ReviewForm.invoice_time)
          data.append('invoice_product_name', this.ReviewForm.invoice_product_name)
          InvoiceResource.invoiceAudit(data).then(res => {
            this.Message('ACTION_SUCCESS')
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

