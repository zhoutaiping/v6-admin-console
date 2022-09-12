<style lang="scss" >
.dialog-base-report {
  .form {
    margin-top: 10px;
  }
  .form-input {
    width: 250px;
  }
  .coupon-list-item {
    margin: 6px 0 6px 2px;
    border-left: 1px solid #dcdfe6;
    border-radius: 0;
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="'变更认证'"
    width="600px"
    aside
    class="dialog-base-report"
  >
    <DmScroll>
      <el-form
        ref="reportForm"
        :model="reportForm"
        :rules="rules"
        label-position="left"
        label-width="150px"
        size="mini"
        class="form"
      >
        <el-form-item label="YUNDUN注册账号">{{ row_data.customer_email }}</el-form-item>
        <el-form-item label="认证类型">{{ CERTIFICATION_TYPE[row_data.certification_type] }}</el-form-item>
        <el-form-item label="当前客户认证名称">{{ row_data.certification_name }}</el-form-item>
        <el-form-item
          label="变更类型"
          prop="edit_type"
        >
          <el-select
            v-model="reportForm.edit_type"
            clearable
            class="form-input"
          >
            <el-option
              label="工商变更"
              value="1"
            />
            <el-option
              label="主体变更"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="变更后客户认证名称"
          prop="new_company_name"
        >
          <el-input
            v-model="reportForm.new_company_name"
            placeholder="认证名称"
            clearable
            class="form-input"
          />
        </el-form-item>
        <el-form-item
          label="统一信用代码"
          prop="new_company_tyshxy_card"
        >
          <el-input
            v-model="reportForm.new_company_tyshxy_card"
            placeholder="统一社会信用代码"
            clearable
            class="form-input"
          />
        </el-form-item>
        <el-form-item
          label="变更前营业执照"
          prop="company_yyzz_pic"
        >
          <el-popover
            v-if="row_data.certification_extend && row_data.certification_extend.company_yyzz_pic"
            placement="left-start"
          >
            <img
              :src="row_data.certification_extend && row_data.certification_extend.company_yyzz_pic"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="row_data.certification_extend && row_data.certification_extend.company_yyzz_pic"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
        </el-form-item>
        <el-form-item
          label="变更后营业执照"
          prop="new_company_yyzz_pic"
        >
          <el-popover
            v-if="reportForm.new_company_yyzz_pic"
            placement="left-start"
          >
            <img
              :src="reportForm.new_company_yyzz_pic"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="reportForm.new_company_yyzz_pic"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
          <el-upload
            ref="upload"
            :action="url"
            :on-preview="handlePreview"
            :on-change="fileChange"
            :file-list="yyzz_fileList"
            :show-file-list="false"
            :auto-upload="false"
            class="upload-demo"
          >
            <el-button
              slot="trigger"
              size="mini"
              type="primary"
              style="margin:1px;"
            >{{ reportForm.new_company_yyzz_pic ? '重新上传' :'上传' }}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="工商变更证明附件"
          prop="file_annex"
        >
          <el-popover
            v-if="reportForm.file_annex"
            placement="left-start"
          >
            <img
              :src="reportForm.file_annex"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="reportForm.file_annex"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
          <el-upload
            ref="upload"
            :action="url"
            :on-preview="handlePreview"
            :on-change="fileChangeAnnex"
            :file-list="file_annex_fileList"
            :show-file-list="false"
            :auto-upload="false"
            class="upload-demo"
          >
            <el-button
              slot="trigger"
              size="mini"
              type="primary"
              style="margin:1px;"
            >{{ reportForm.file_annex ? '重新上传' :'上传' }}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="身份证正面"
          prop="personal_id_card_pic"
        >
          <el-popover
            v-if="reportForm.personal_id_card_pic"
            placement="left-start"
          >
            <img
              :src="reportForm.personal_id_card_pic"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="reportForm.personal_id_card_pic"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
          <el-upload
            ref="upload"
            :action="url"
            :on-preview="handlePreview"
            :on-change="fileChangeCard"
            :file-list="card_pic_fileList"
            :show-file-list="false"
            :auto-upload="false"
            class="upload-demo"
          >
            <el-button
              slot="trigger"
              size="mini"
              type="primary"
              style="margin:1px;"
            >{{ reportForm.file_annex ? '重新上传' :'上传' }}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="身份证背面"
          prop="personal_id_card_pic_negative"
        >
          <el-popover
            v-if="reportForm.personal_id_card_pic_negative"
            placement="left-start"
          >
            <img
              :src="reportForm.personal_id_card_pic_negative"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="reportForm.personal_id_card_pic_negative"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
          <el-upload
            ref="upload"
            :action="url"
            :on-preview="handlePreview"
            :on-change="fileChangeCard2"
            :file-list="card_pic_fileList2"
            :show-file-list="false"
            :auto-upload="false"
            class="upload-demo"
          >
            <el-button
              slot="trigger"
              size="mini"
              type="primary"
              style="margin:1px;"
            >{{ reportForm.file_annex ? '重新上传' :'上传' }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
// import * as FORM from './c-form.js'
import mealSource from '@/api/mealApi'
export default {
  props: {
  },
  data() {
    return {
      loading: false,
      open: false,
      row_data: {},
      reportForm: {
        new_company_name: '',
        new_company_tyshxy_card: '',
        edit_type: '',
        new_company_yyzz_pic: '',
        file_annex: '',
        personal_id_card_pic: '',
        personal_id_card_pic_negative: ''
      },
      rules: {
        new_company_name: [{ required: true, message: '请输入认证名称', trigger: ['change', 'blur'] }],
        new_company_tyshxy_card: [{ required: true, message: '请输入统一社会信用认证码', trigger: ['change', 'blur'] }],
        edit_type: [{ required: true, message: '请选择变更类型', trigger: ['change', 'blur'] }],
        new_company_yyzz_pic: [{ required: true, message: '请上传新营业执照', trigger: ['change', 'blur'] }],
        file_annex: [{ required: true, message: '请上传文件附件', trigger: ['change', 'blur'] }],
        personal_id_card_pic: [{ required: true, message: '请上传身份证正面', trigger: ['change', 'blur'] }],
        personal_id_card_pic_negative: [{ required: true, message: '请上传身份证背面', trigger: ['change', 'blur'] }]
      },
      CERTIFICATION_TYPE: { 1: '个人', 2: '企业', 3: '工商' },
      url: '',
      yyzz_fileList: [],
      file_annex_fileList: [],
      card_pic_fileList: [],
      card_pic_fileList2: []
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    handleOpen(data, type) {
      this.$nextTick(() => {
        this.loading = true
        this.$refs.dmdialog.handleOpen()
        setTimeout(() => { this.resetForm('reportForm') }, 0)
        this.row_data = data
        setTimeout(() => { this.loading = false }, 1000)
      })
    },
    handlePreview() { },
    fileChange(file, fileList) {
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', 'new_company_yyzz_pic')
    },
    fileChangeAnnex(file, fileList) {
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', 'file_annex')
    },
    fileChangeCard(file, fileList) {
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', 'personal_id_card_pic')
    },
    fileChangeCard2(file, fileList) {
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', 'personal_id_card_pic_negative')
    },
    upFile(params, fileUrl, key) {
      mealSource.ServiceUpload(params).then(res => {
        if (res[fileUrl]) {
          this.message.success('上传成功')
          this.setImgUrl(key, res[fileUrl])
        } else {
          this.message.warning('上传失败')
          this.setImgUrl(key, '')
        }
      })
    },
    setImgUrl(img, url) {
      if (img) this.reportForm[img] = url
    },
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields()
    },
    getParams() {
      const params = {
        member_id: this.row_data.member_id,
        member_certification_id: this.row_data.member_certification_id,
        check_status: this.row_data.check_status,
        edit_type: this.reportForm.edit_type,
        new_company_name: this.reportForm.new_company_name,
        new_company_tyshxy_card: this.reportForm.new_company_tyshxy_card,
        new_company_yyzz_pic: this.reportForm.new_company_yyzz_pic,
        file_annex: this.reportForm.file_annex,
        personal_id_card_pic: this.reportForm.personal_id_card_pic,
        personal_id_card_pic_negative: this.reportForm.personal_id_card_pic_negative
      }
      return params
    },
    handleSubmit(formName = 'reportForm') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.InvokeAllApi.post('/V4/Account.certification.edit', this.getParams()).then(res => {
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
