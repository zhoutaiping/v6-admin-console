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
    title-label="渠道"
    width="650px"
  >
    <DmScroll>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="邮箱" prop="member_id" >
          <span v-show="mode === 'Edit'"> <el-input v-model="form.email" readonly class="input-box"/></span>
        </el-form-item>
        <el-form-item label="客户认证名称" class="item-box" prop="member_id" >
          <el-input v-model="cbms_info.member_auth_name" readonly class="input-box"/>
        </el-form-item>

        <el-form-item label="渠道类型" prop="type" >
          <DmSelect
            v-model="form.type"
            :selects="channel_type"
            placeholder="渠道类型"
            class="input-box"
            @change="e => {
              if (e) {
                getSettingInfo({id: form.type})
              } else {
                $store.commit('SETTING_INFO', {})
              }
            }"
          />
        </el-form-item>
        <el-form-item label="渠道有效期" prop="channel_expire_time">
          <DmSelect
            v-model="form.channel_expire_time"
            :selects="option.channel_expire_time"
            placeholder=" "
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
          <el-input v-model="form.remark" placeholder="" type="textarea" class="input-box" />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>

import { mapState, mapActions } from 'vuex'
import defaultSetting from '@/core/defaultSetting'
export default {
  data() {
    return {
      form: {
        email: '',
        member_id: '',
        type: '',
        remark: '',
        ...defaultSetting.channel_setting_form
      },
      rules: {
        ...defaultSetting.channel_setting_rules,
        member_id: [{ required: true, message: ' ' }],
        email: [{ required: true, message: ' ' }],
        type: [{ required: true, message: ' ' }],
        remark: []
      },
      option: {
        ... defaultSetting.channel_setting
      },
      channel_setting_key: defaultSetting.channel_setting_key,
      mode: 'Create'
    }
  },
  computed: {
    ...mapState({
      cbms_info: state => state.finance.cbms_info,
      channel_type: state => state.finance.channel_type,
      setting_info: state => state.finance.setting_info
    })
  },
  watch: {
    setting_info: {
      handler(val) {
        this.initSetting(val)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      getCbmsInfo: 'getCbmsInfo',
      getSettingInfo: 'settingInfo'
    }),
    handleOpen(data, option) {
      this.getCbmsInfo({ email: data.email })
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.$store.commit('CBMS_INFO', {})
        if (data && Object.keys(data).length) {
          this.mode = 'Edit'
          this.form = Object.assign({}, JSON.parse(JSON.stringify(data)))
          const val = data.channel_setting || {}
          this.initSetting(val)
        }
      })
    },
    initSetting(val) {
      this.channel_setting_key.forEach(i => {
        this.$set(this.form, i, i === 'support_type' ? val[i] || [] : val[i] || '')
      })
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const data = {
            id: this.form.id,
            type: this.form.type,
            setting: defaultSetting.getSetting(this.form, this.channel_setting_key),
            remark: this.form.remark
          }
          this.Fetch.post('/V4/cbms.cb.channel.edit', data).then(res => {
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
