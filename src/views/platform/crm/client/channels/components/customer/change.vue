。<style lang="scss" scoped>
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
    :fetch-submit="fetchSubmit"
    width="600px"
    title="变更关联类型"
  >
    <DmAlert> 提醒：变更前，需确保该终端客户下的所有订单均已完成支付，且已开具发票。 </DmAlert>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="140px"
    >
      <DmCardPanel title="基本信息">
        <el-form-item label="终端邮箱" class="item-box">{{ form.end_member_email }}</el-form-item>
        <el-form-item label="终端认证名称" class="item-box">{{ form.certification_name }}</el-form-item>
        <el-form-item label="渠道邮箱" class="item-box">{{ form.channel_member_email }}</el-form-item>
        <el-form-item label="渠道认证名称" class="item-box">{{ cbms_info.member_name }}</el-form-item>
      </DmCardPanel>
      <DmCardPanel title="渠道终端关联配置">
        <el-form-item label="类型" prop="relation_mode" class="item-box">
          <DmSelect
            v-model="form.relation_mode"
            :selects="option.relation_mode"
            placeholder="类型"
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="item-box">
          <el-input v-model="form.remark" placeholder=" " type="textarea" class="input-box" />
        </el-form-item>
      </DmCardPanel>
    </el-form>
  </DmDialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      form: { },
      default_form: {
        id: '',
        relation_mode: '',
        remark: ''
      },
      rules: {
        id: [{ required: true, message: ' ' }],
        relation_mode: [{ required: true, message: ' ' }],
        remark: []
      },
      option: {
        relation_mode: [
          { label: '代理', value: '1' },
          { label: '代销', value: '2' }
        ]
      },
      mode: 'Create'
    }
  },
  computed: {
    ...mapState({ cbms_info: state => state.finance.cbms_info })
  },
  methods: {
    ...mapActions({ getCbmsInfo: 'getCbmsInfo' }),
    handleOpen(data, option) {
      this.getCbmsInfo({ email: data.channel_member_email })
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (data && Object.keys(data).length) {
          this.form = Object.assign({}, JSON.parse(JSON.stringify(data)))
        } else {
          this.form = Object.assign({}, this.default_form)
          this.form.id = ''
        }
      })
    },

    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const api = '/V4/cbms.cb.channel.end.user.change.relation.type'
          const data = {
            id: this.form.id,
            relation_mode: this.form.relation_mode,
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
