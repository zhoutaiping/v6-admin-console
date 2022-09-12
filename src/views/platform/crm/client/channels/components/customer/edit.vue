<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :mode="mode"
    :fetch-submit="fetchSubmit"
    width="600px"
    title-label="终端客户"
  >
    <DmScroll>
      <DmAlert>
        <p> 终端客户邮箱是【用户报备邮箱】 </p>
        <p> 渠道邮箱是【渠道注册邮箱】</p>
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <DmCardPanel title="基本信息">
          <el-form-item label="终端客户邮箱" prop="end_member_email" class="item-box">
            <el-autocomplete
              v-model="form.end_member_email"
              :fetch-suggestions="query"
              :debounce="500"
              placeholder=""
              clearable
              class="input-box"
              @select="check"
              @change="change"
            />
          </el-form-item>
          <el-form-item label="终端认证名称" class="item-box" >
            {{ cbms_info.member_auth_name ||'' }}
          </el-form-item>
          <el-form-item label="渠道邮箱" class="item-box" prop="channel_email">
            <el-autocomplete
              v-model="form.channel_email"
              :fetch-suggestions="(val, cb) =>{query(val, cb, 'channel')}"
              :debounce="500"
              placeholder=""
              clearable
              class="input-box"
              @select="e =>{check(e, 'channel')}"
              @change="e =>{change(e, 'channel')}"
            />
          </el-form-item>
          <el-form-item label="渠道认证名称" class="item-box">
            {{ channel.member_auth_name ||'' }}
          </el-form-item>
        </DmCardPanel>
        <DmCardPanel title="渠道终端关联配置">
          <el-form-item label="关联类型" prop="relation_mode" class="item-box">
            <DmSelect
              v-model="form.relation_mode"
              :selects="option.relation_mode"
              placeholder=""
              class="input-box"
            />
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
          <el-form-item label="备注" prop="remark" class="item-box">
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
import { mapState, mapActions } from 'vuex'
import defaultSetting from '@/core/defaultSetting'
export default {
  data() {
    return {
      form: { },
      default_form: {
        end_member_email: '',
        end_member_id: '',
        channel_email: '',
        channel_name: '',
        channel_id: '',
        relation_mode: '',
        remark: '',
        relieve_expire_time: '',
        relieve_time_num: '',
        relieve_time_type: ''
      },
      rules: {
        end_member_email: [{ required: true, message: ' ' }],
        end_member_id: [{ required: true, message: ' ' }],
        channel_email: [{ required: true, message: ' ' }],
        channel_id: [{ required: true, message: ' ' }],
        relation_mode: [{ required: true, message: ' ' }],
        relieve_expire_time: [{ required: true, message: ' ' }],
        relieve_time_num: [{ required: true, message: ' ' }],
        relieve_time_type: [{ required: true, message: ' ' }],
        remark: []
      },
      option: {
        relieve_expire_time: defaultSetting.channel_setting.relieve_expire_time,
        relieve_time_type: defaultSetting.channel_setting.relieve_time_type,
        relation_mode: [
          { label: '代理', value: '1' },
          { label: '代销', value: '2' }
        ]
      },
      channel: {},
      channel_setting: {},
      mode: 'Create'
    }
  },
  computed: {
    ...mapState({
      cbms_info: state => state.finance.cbms_info
    })
  },
  watch: {
    channel_setting: {
      handler(val) {
        const channel_setting = val
        if (Object.keys(channel_setting).length) {
          this.option.relation_mode = [
            { label: '代理', value: '1', disabled: !channel_setting.support_type.includes('agent') },
            { label: '代销', value: '2', disabled: !channel_setting.support_type.includes('sell') }
          ]
          this.$set(this.form, 'relation_mode', channel_setting.default_type === 'agent' ? '1' : '2')
          this.$set(this.form, 'relieve_expire_time', channel_setting.relieve_expire_time)
          this.$set(this.form, 'relieve_time_type', channel_setting.relieve_time_type)
          this.$set(this.form, 'relieve_time_num', channel_setting.relieve_time_num)
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      getCbmsInfo: 'getCbmsInfo'
    }),
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.$store.commit('CBMS_INFO', {})
        this.channel = {}
        this.channel_setting = {}
        this.mode = 'Create'
        this.form = Object.assign({}, this.default_form)
      })
    },
    query(val, cb, type) {
      let data = []
      if (val !== '') {
        const params = {
          username: type === 'channel' ? this.form.channel_email : this.form.end_member_email,
          type: 1,
          report: 2
        }
        this.Fetch.post('/V4/Account.Member.like', params).then(res => {
          const list = res.list
          if (list && list !== []) {
            data = defaultSetting.formartList(list)
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

    check(e, type) {
      if (e) {
        if (type === 'channel') {
          this.channel = {}
          this.channel_setting = {}
          this.Fetch.get('/V4/cbms.common.info', { email: e.value }).then(res => {
            if (res && Number(res.channel_id) !== 0) {
              this.channel = res
              this.channel_setting = res.channel_setting
              this.form.channel_id = res.channel_id
            } else {
              this.form.channel_email = ''
              this.form.channel_id = ''
              this.message.warning('渠道邮箱未找到！，请确认后输入')
            }
          })
        } else {
          this.form.end_member_id = e.label
          this.getCbmsInfo({ email: e.value })
        }
      }
    },

    change(e, type) {
      if (!e) {
        if (type === 'channel') {
          this.form.channel_id = ''
          this.channel = {}
        } else {
          this.form.end_member_id = ''
          this.$store.commit('CBMS_INFO', {})
        }
      }
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const api = '/V4/cbms.cb.channel.end.user.add'
          const data = {
            channel_id: this.channel.channel_id,
            relation_mode: this.form.relation_mode,
            end_member_id: this.form.end_member_id,
            setting: {
              relieve_expire_time: this.form.relieve_expire_time,
              relieve_time_num: this.form.relieve_time_num,
              relieve_time_type: this.form.relieve_time_type
            },
            remark: this.form.remark
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
