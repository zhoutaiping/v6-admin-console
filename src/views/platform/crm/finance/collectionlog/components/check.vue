<style lang="postcss" scoped>
.DialogCheck{
  .detail-from{
    margin: 5px;
    .detail-from-input{
      width: 300px;
    }
  }
}
</style>
<template>
  <FDialog :title ="'审核'" :close-on-click-modal="false" :visible.sync="visible" size="500" class="DialogCheck" aside @close="handleClose">
    <DmScroll>
      <el-form v-loading="loading" ref="checkForm" :model="checkForm" :rules="rules" label-width="110px" size="mini" class="detail-from">
        <ElFormItem label="转账流水号" class="detail-from-item" prop="flow_code">
          <el-input v-model="checkForm.flow_code" readonly placeholder="转账流水号" class="detail-from-input"/>
        </ElFormItem>
        <ElFormItem label="用户邮箱" class="detail-from-item" prop="member_email">
          <el-input v-model="checkForm.member_email" readonly class="detail-from-input"/>
        </ElFormItem>
        <ElFormItem label="预关联邮箱" class="detail-from-item" prop="pre_member_email">
          <el-input v-model="checkForm.pre_member_email" readonly placeholder="" class="detail-from-input"/>
        </ElFormItem>
        <el-form-item label="审核结果" prop="type">
          <el-select v-model="checkForm.type" placeholder="审核结果" class="detail-from-input">
            <el-option label="审核通过" value="pass"/>
            <el-option label="审核不通过" value="noPass"/>
          </el-select>
        </el-form-item>
        <ElFormItem v-if="checkForm.screen_pic" label="收款截图" class="detail-from-item" prop="screen_pic">
          <el-popover placement="left-start">
            <img :src="checkForm.screen_pic" class="image" style="height:500px;" alt="">
            <img slot="reference" :src="checkForm.screen_pic" class="image" style="height:150px;" alt="">
          </el-popover>
        </ElFormItem>
        <ElFormItem v-if="checkForm.act_pay_pic" label="代打款证明" class="detail-from-item" prop="act_pay_pic">
          <el-popover placement="left-start">
            <img :src="checkForm.act_pay_pic" class="image" style="height:500px;" alt="">
            <img slot="reference" :src="checkForm.act_pay_pic" class="image" style="height:150px;" alt="">
          </el-popover>
        </ElFormItem>
        <ElFormItem label="审核备注" class="detail-from-item" prop="remark">
          <el-input v-model="checkForm.remark" type="textarea" placeholder="备注" class="detail-from-input"/>
        </ElFormItem>
      </el-form>
    </DmScroll>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" size="mini" @click="handleClose">取 消</el-button>
      <el-button :disabled="loading" type="primary" size="mini" @click="handleSubmit('checkForm')">确 定</el-button>
    </div>
  </FDialog>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      visible: false,
      url: '',
      fileList: [],
      checkForm: {
        flow_id: '',
        flow_code: '',
        member_email: '',
        pre_member_email: '',
        act_pay_pic: '',
        screen_pic: '',
        type: '',
        remark: ''
      },
      rules: {
        flow_id: [],
        flow_code: [],
        act_pay_pic: [],
        screen_pic: [],
        member_email: [],
        pre_member_email: [],
        type: [{ required: true, message: '请选择审核状态' }]
      }
    }
  },
  mounted() {

  },
  methods: {
    handleOpen(type, data) {
      this.$nextTick(() => {
        this.$refs.checkForm && this.$refs.checkForm.resetFields()
        this.visible = true
        this.loading = true
        this.checkForm = {
          flow_id: data.id,
          flow_code: data.flow_code,
          act_pay_pic: data.act_pay_pic,
          screen_pic: data.screen_pic,
          member_email: data.member_email,
          pre_member_email: data.pre_member_email,
          type: ''
        }
        setTimeout(() => { this.loading = false }, 500)
      })
    },

    handleClose() {
      this.visible = false
      this.$emit('loadGrid')
    },

    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleEdit(this.getParams())
        }
      })
    },

    getParams() {
      const paramsData = {
        flow_id: this.checkForm.flow_id,
        type: this.checkForm.type,
        remark: this.checkForm.remark
      }
      if (this.checkForm.type === 'noPass') paramsData.check_no_pass_remark = this.checkForm.remark
      return paramsData
    },

    handleEdit(params) {
      this.loading = true
      this.InvokeAllApi.post('/V4/financial.flow.relation.member.check.flow', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.visible = false
      })
      setTimeout(() => { this.loading = false }, 1000)
    }
  }
}
</script>
