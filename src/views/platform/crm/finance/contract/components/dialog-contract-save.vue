<style lang="postcss" scoped>
  .dialog-contract-save{
    .dialog-contract-save-form{
      margin-top: 10px;
      .dialog-contract-save-form-item {

        .dialog-contract-save-form-input {
          width: 300px;
        }
      }
    }
  }
</style>
<template>
  <FDialog :visible.sync="open" :close-on-click-modal="true" :close-on-press-escape="true" title="合同申请" size="600" class="dialog-contract-save" aside @close="handleClose('contractForm')">
    <DmScroll>
      <el-form ref="contractForm" :model="contractForm" :rules="contract_rule" label-position="left" label-width="80px" size="mini" class="dialog-contract-save-form">
        <h3>甲方信息</h3><hr>
        <el-form-item label="用户邮箱" class="dialog-contract-save-form-item" prop="email">
          <el-input v-model="contractForm.email" placeholder="例如：XXX@sina.com" class="dialog-contract-save-form-input"/>
        </el-form-item>
        <el-form-item label="用户名称" class="dialog-contract-save-form-item" prop="user_name">
          <el-input v-model="contractForm.user_name" :readonly="true" placeholder="例如：xxx公司" class="dialog-contract-save-form-input"/>
        </el-form-item>
        <el-form-item label="开始时间" class="dialog-contract-save-form-item" prop="create_at">
          <el-date-picker v-model="contractForm.create_at" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" class="dialog-contract-save-form-input"/>
        </el-form-item>
        <el-form-item label="到期时间" class="dialog-contract-save-form-item" prop="expire_date">
          <el-date-picker v-model="contractForm.expire_date" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="选择日期" class="dialog-contract-save-form-input"/>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            ref="upload"
            :action="url"
            :on-preview="handlePreview"
            :on-change="fileChange"
            :file-list="fileList"
            :show-file-list="false"
            :auto-upload="false"
            class="upload-demo">
            <el-button slot="trigger" size="mini" icon="el-icon-search" style="margin-left:5px;">选择文件</el-button>
            <el-button :disabled="!contractForm.Fiele" size="mini" icon="el-icon-upload" style="margin-left:5px;" @click="submitUpload('key')">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <h3>关联订单</h3><hr>
        <DmTable>
          <el-table :data="list" :max-height="250" show-summary class="tab-order" size="mini">
            <el-table-column label="" type="selection" width="55px"/>
            <el-table-column label="订单号" prop="order_code"/>
            <el-table-column label="订单金额" prop="amount"/>
            <el-table-column label="产品" prop="product"/>
            <el-table-column label="套餐" prop="meal"/>
          </el-table>
        </DmTable>
      </el-form>

    </DmScroll>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose('contractForm')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('contractForm')">确 定</el-button>
    </div>
  </FDialog>
</template>
<script>
import Form from '@/utils/form'
import * as FORM from './c-from.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
      open: false,
      contractForm: new Form({
        email: '', user_name: '上海云盾信息技术有限公司', create_at: '', expire_date: '', Fiele: null
      }, {}),
      contract_rule: FORM.CONTRACTFORM_RULE,
      list: [],
      url: '',
      fileList: [],
      INVOICE_TYPE: [{ label: '增值税普通发票', value: '1' }, { label: '增值税专用发票', value: '2' }]
    }
  },

  methods: {
    handleOpen(select) {
      this.loading = true
      this.open = true
      this.contractForm.reset()
      // this.list = select
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },

    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.open = false
      this.$emit('handleload')
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.open = false
        } else {
          return false
        }
      })
    },

    handlePreview() {

    },

    fileChange() {

    },
    submitUpload() {

    }
  }

}
</script>
