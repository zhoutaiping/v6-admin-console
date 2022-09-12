<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :mode="mode"
    :fetch-submit="fetchSubmit"
    :title-label="'渠道配置'"
    width="700px"
  >
    <DmScroll>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <DmCardPanel title="渠道配置信息">
          <el-form-item label="渠道类别" prop="channel_name">
            <el-input v-model="form.channel_name" class="input-box"/>
          </el-form-item>
          <el-form-item label="渠道有效期" prop="channel_expire_time">
            <DmSelect
              v-model="form.channel_expire_time"
              :selects="option.channel_expire_time"
              placeholder="时长"
              style="width:120px"
              @change="e => {
                form.channel_time_num = 0
                form.channel_time_type = 'day'
              }"
            />
            <template v-if="form.channel_expire_time === 'appoint'">
              <el-input-number v-model="form.channel_time_num" :min="0" style="width:150px"/>
              <DmSelect
                v-model="form.channel_time_type"
                :selects="option.channel_time_type"
                placeholder="单位"
                style="width:120px"
              />
            </template>
          </el-form-item>
          <el-form-item label="实名认证类型要求" prop="auth_type" >
            <el-checkbox-group v-model="form.auth_type">
              <el-checkbox v-for="i in option.auth_type" :key="i.value" :label="i.value">{{ i.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </DmCardPanel>
        <DmCardPanel title="渠道终端关联配置">
          <el-form-item label="未成交解除关联" prop="relieve_expire_time">
            <DmSelect
              v-model="form.relieve_expire_time"
              :selects="option.relieve_expire_time"
              placeholder=" "
              style="width:120px"
              @change="e => {
                form.relieve_time_num = 0
                form.relieve_time_type = 'day'
              }"
            />
            <template v-if="form.relieve_expire_time === 'appoint'">
              <el-input-number v-model="form.relieve_time_num" :min="0" style="width:150px"/>
              <DmSelect
                v-model="form.relieve_time_type"
                :selects="option.relieve_time_type"
                placeholder="单位"
                style="width:120px"
              />
            </template>
          </el-form-item>
          <el-form-item label="支持关联类型" prop="support_type" >
            <el-checkbox-group v-model="form.support_type">
              <el-checkbox v-for="i in option.support_type" :key="i.value" :label="i.value">{{ i.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="默认关联类型" prop="default_type" >
            <el-radio-group v-model="form.default_type">
              <el-radio v-for="i in option.default_type" :key="i.value" :label="i.value">{{ i.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark" >
            <el-input
              v-model="form.remark"
              placeholder=""
              type="textarea"
              class="input-box"
            />
          </el-form-item>
        </DmCardPanel>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import defaultSetting from '@/core/defaultSetting'
export default {
  data() {
    return {
      form: {
        channel_name: '',
        auth_type: [],
        remark: '',
        ...defaultSetting.channel_setting_form
      },

      rules: {
        ...defaultSetting.channel_setting_rules,
        auth_type: [{ required: true, message: '请选择', type: 'array' }],
        remark: []
      },
      option: defaultSetting.channel_setting,
      mode: 'Create'
    }
  },

  methods: {

    handleOpen(data, option) {
      this.$nextTick(() => {
        this.mode = option
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }

        if (option === 'Edit') {
          this.form = Object.assign({}, { ...data })
        }
      })
    },

    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let api = ''
          const data = { ...this.form }
          if (this.mode === 'Create') {
            api = '/V4/cbms.cb.channel.setting.add'
          } else if (this.mode === 'Edit') {
            api = '/V4/cbms.cb.channel.setting.edit'
          }
          this.Fetch.post(api, data).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.dialog.handleClose()
          }).catch(e => {
            this.$refs.dialog.afterValidate()
          })
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
