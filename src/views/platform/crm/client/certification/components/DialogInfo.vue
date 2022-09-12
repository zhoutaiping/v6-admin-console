<style lang="scss" scoped>
.form-item {
  margin-bottom: 5px;
}
.form-input {
  width: 250px;
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :title="'申请详情'"
    :footer="false"
    width="600px"
    aside
  >
    <DmScroll>
      <el-form
        v-loading="loading"
        ref="infoForm"
        :model="infoForm"
        :rules="rules"
        size="mini"
        label-position="left"
        label-width="130px"
      >
        <el-form-item
          label="YUNDUN注册账号"
          class="form-item"
        >
          {{ rowData.email }}
        </el-form-item>
        <el-form-item
          label="当前认证名称"
          class="form-item"
        >
          {{ rowData.new_company_name }}
        </el-form-item>
        <el-form-item
          label="变更类型"
          class="form-item"
        >
          {{ rowData.edit_type_desc }}
        </el-form-item>
        <el-form-item
          v-if="rowData.certification_extend"
          label="统一社会信用代码"
          class="form-item"
        >
          {{ rowData.certification_extend.company && rowData.certification_extend.company.company_tyshxy_card }}
        </el-form-item>
        <el-form-item
          label="变更后营业执照"
          class="form-item"
        >
          <el-popover
            v-if="rowData.new_company_yyzz_pic"
            placement="left-start"
          >
            <img
              :src="rowData.new_company_yyzz_pic"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="rowData.new_company_yyzz_pic"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
        </el-form-item>
        <el-form-item
          label="工商变更证明附件"
          class="form-item"
        >
          <el-popover
            v-if="rowData.file_annex"
            placement="left-start"
          >
            <img
              :src="rowData.file_annex"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="rowData.file_annex"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
        </el-form-item>
        <el-form-item
          label="经办人身份证正面"
          class="form-item"
        >
          <el-popover
            v-if="rowData.personal_id_card_pic"
            placement="left-start"
          >
            <img
              :src="rowData.personal_id_card_pic"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="rowData.personal_id_card_pic"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
        </el-form-item>
        <el-form-item
          label="经办人身份证反面"
          class="form-item"
        >
          <el-popover
            v-if="rowData.personal_id_card_pic_negative"
            placement="left-start"
          >
            <img
              :src="rowData.personal_id_card_pic_negative"
              class="image"
              style="height:667px;"
              alt=""
            >
            <img
              slot="reference"
              :src="rowData.personal_id_card_pic_negative"
              class="image"
              style="height:150px;"
              alt=""
            >
          </el-popover>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import mealSource from '@/api/mealApi'
export default {
  data() {
    return {
      open: false,
      loading: false,
      rowData: {},
      infoForm: {},
      url: '',
      fileList: [],
      rules: {
        new_company_name: [{ required: true, message: '请输入新认证名称', trigger: ['change', 'blur'] }],
        new_company_yyzz_pic: [{ required: true, message: '请上传新营业执照', trigger: ['change', 'blur'] }]
      }
    }
  },
  methods: {
    handleOpen(data) {
      this.loading = true
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.resetForm('infoForm')
        this.rowData = Object.assign({}, data)
        setTimeout(() => {
          this.infoForm = Object.assign({}, {
            new_company_name: data.new_company_name,
            new_company_yyzz_pic: ''
          })
          this.loading = false
        }, 500)
      })
    },

    fileChange(file, fileList) {
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele', 'new_company_yyzz_pic')
    },

    upFile(params, fileUrl, key) {
      mealSource.ServiceUpload(params).then(res => {
        if (res[fileUrl]) {
          this.message.success('上传成功')
          this.infoForm[key] = res[fileUrl]
        } else {
          this.message.warning('上传失败')
          this.infoForm[key] = ''
        }
      })
    },
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields()
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.rowData.id,
            member_id: this.rowData.member_id,
            edit_type: this.rowData.edit_type,
            member_certification_id: this.rowData.member_certification_id,
            new_company_name: this.infoForm.new_company_name,
            new_company_yyzz_pic: this.infoForm.new_company_yyzz_pic,
            new_company_tyshxy_card: this.rowData.new_company_tyshxy_card,
            file_annex: this.rowData.file_annex,
            personal_id_card_pic: this.rowData.personal_id_card_pic,
            personal_id_card_pic_negative: this.rowData.personal_id_card_pic_negative
          }
          this.InvokeAllApi.post('/V4/Account.certification.update', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.open = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
