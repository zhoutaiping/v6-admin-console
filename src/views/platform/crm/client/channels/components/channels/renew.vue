<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <el-dialog
    ref="dmdialog"
    :title="'重启合作'"
    :visible.sync="open"
    width="650px"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-width="140px" label-position="left">
      <DmCardPanel v-show="currentTab === 0" title="用户-渠道信息">
        <el-form-item label="渠道类别" prop="type" >
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
        <el-form-item label="邮箱" prop="member_id" >
          {{ formartVal(history[0]||{},'member_email') }}
        </el-form-item>
        <el-form-item label="客户认证名称" class="item-box" prop="member_id" >
          <el-input v-model="cbms_info.member_auth_name" readonly class="input-box"/>
        </el-form-item>
        <el-form-item label="客户报备名称" class="item-box" prop="member_id" >
          <el-input v-model="cbms_info.member_name" readonly class="input-box"/>
        </el-form-item>
        <el-form-item label="所属销售" class="item-box" prop="member_id" >
          <el-input v-model="cbms_info.sales" readonly class="input-box"/>
        </el-form-item>
      </DmCardPanel>
      <DmCardPanel v-show="currentTab > 0" title="配置-信息">
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
      </DmCardPanel>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-show="currentTab > 0" type="primary" @click="currentTab--">上一步</el-button>
      <el-button v-show="currentTab == 0" :disabled="!form.type || !form.member_id" type="primary" @click="currentTab++">下一步</el-button>
      <el-button @click="open = false">取 消</el-button>
      <el-button v-show="currentTab > 0" :disabled="loading" type="primary" @click="fetchSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import defaultSetting from '@/core/defaultSetting'
export default {
  data() {
    return {
      open: false,
      currentTab: 0,
      loading: false,
      channel: {},
      setting: {},
      history: [],
      form: {
        id: '',
        type: '',
        remark: '',
        ...defaultSetting.channel_setting_form
      },
      rules: {
        ...defaultSetting.channel_setting_rules,
        id: [],
        type: [{ required: true, message: ' ' }],
        remark: []
      },
      channel_setting_key: defaultSetting.channel_setting_key,
      option: {
        ... defaultSetting.channel_setting,
        type: [
          { label: '经销渠道', value: '1' },
          { label: '非正式签约渠道', value: '2' }
        ],
        cop_status: [
          { label: '合作中', value: '1' },
          { label: '已解除', value: '2' }
        ]
      }
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
    handleOpen(data) {
      this.detail({ id: data.id })
      this.loading = true
      this.currentTab = 0
      this.$nextTick(() => {
        this.open = true
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.form.id = data.id
        this.form.member_id = data.member_id
        this.form.type = data.type
        this.form.remark = data.remark

        const val = Object.keys(data.channel_setting).length && data.channel_setting || {}
        this.initSetting(val)
        this.loading = false
      })
    },
    initSetting(val) {
      this.channel_setting_key.forEach(i => {
        this.$set(this.form, i, i === 'support_type' ? val[i] || [] : val[i] || '')
      })
    },
    async detail(params) {
      try {
        const data = await this.Fetch.get('/V4/cbms.cb.channel.detail', params)
        this.channel = Object.assign({}, data.channel)
        this.setting = Object.assign({}, data.setting)
        this.history = data.history || []
        this.getCbmsInfo({ email: data.history && data.history[0] && data.history[0]['member_email'] })
      } catch (error) {
        this.channel = {}
        this.history = []
        return
      }
    },
    formartVal(data = {}, prop = '') {
      return data[prop]
    },
    fetchSubmit() {
      const data = {
        id: this.form.id,
        type: this.form.type,
        setting: defaultSetting.getSetting(this.form, this.channel_setting_key),
        remark: this.form.remark
      }
      this.Fetch.post('/V4/cbms.cb.channel.renew', data).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('init')
        this.$refs.dmdialog.handleClose()
      }).catch(e => {
        this.$refs.dmdialog.afterValidate()
      })
    }
  }
}
</script>
