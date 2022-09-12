<style lang="scss" scoped>
.input-box {
  width: 300px;
}
/deep/ .el-dialog__footer {
  text-align: center;
}
</style>
<template>
  <el-dialog
    ref="dialog"
    :visible.sync="open"
    title="新增"
    width="650px"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="140px"
    >
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
          <el-autocomplete
            v-model="form.email"
            :fetch-suggestions="query"
            :debounce="500"
            placeholder=""
            clearable
            class="input-box"
            @select="check"
            @change="change"
          />
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
        remark: []
      },
      channel_setting_key: defaultSetting.channel_setting_key,
      option: {
        ... defaultSetting.channel_setting
      },
      formartList: (data) => {
        let list = []
        if (Object.keys(data).length) {
          list = Object.keys(data).map(i => { return { label: data[i], value: i } })
        }
        return list
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
        if (Object.keys(val).length) {
          this.channel_setting_key.forEach(i => {
            this.$set(this.form, i, i === 'support_type' ? val[i] || [] : val[i] || '')
          })
        }
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
      this.$store.commit('CBMS_INFO', {})
      this.currentTab = 0
      this.$nextTick(() => {
        this.open = true
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.form = Object.assign({}, this.form)
        this.form.id = ''
      })
    },
    query(val, cb) {
      let data = []
      if (val !== '') {
        const params = { username: this.form.email, type: 1, report: 2 }
        this.Fetch.post('/V4/Account.Member.like', params).then(res => {
          const list = res.list
          if (list && list !== []) {
            data = this.formartList(list)
          }
          if (data.length === 0) {
            this.message.warning('未找到报备用户!')
          }
          cb(data)
        }).catch(e => {
          cb(data)
        })
      }
    },
    check(e) {
      if (e) {
        this.form.member_id = e.label
        this.getCbmsInfo({ email: e.value })
      }
    },
    change(e) {
      if (!e) {
        this.form.member_id = ''
        this.$store.commit('CBMS_INFO', {})
      }
    },
    fetchSubmit() {
      this.loading = true
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const api = '/V4/cbms.cb.channel.add'
          const data = {
            member_id: this.form.member_id,
            type: this.form.type,
            cop_status: '1',
            setting: defaultSetting.getSetting(this.form, this.channel_setting_key),
            remark: this.form.remark
          }
          this.Fetch.post(api, data).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.open = false
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
