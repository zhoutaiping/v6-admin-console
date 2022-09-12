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
    width="600px"
    title="解除渠道"
  >
    <DmScroll>
      <DmAlert>
        <p>
          邮箱未用户报备邮箱，未报备请找客服、管理员
        </p>
      </DmAlert>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="邮箱">
          {{ form.email }}
        </el-form-item>
        <el-form-item
          label="客户认证名称"
          class="item-box"
        >
          {{ cbms_info.member_auth_name }}
        </el-form-item>
        <el-form-item
          label="客户报备名称"
          class="item-box"
        >
          {{ cbms_info.member_name }}
        </el-form-item>
        <el-form-item
          label="所属销售"
          class="item-box"
        >
          {{ cbms_info.sales }}
        </el-form-item>
        <el-form-item label="解除原因" prop="lift_reason">
          <DmSelect
            v-model="form.lift_reason"
            :selects="option.lift_reason"
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="原因说明" prop="lift_reason_detail">
          <el-input
            v-model="form.lift_reason_detail"
            placeholder=""
            type="textarea"
            class="input-box"
          />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
function formartList(data = {}) {
  let list = []
  if (Object.keys(data).length) {
    list = Object.keys(data).map(i => { return { label: data[i], value: i } })
  }
  return list
}
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {},
      default_form: {
        id: '',
        email: '',
        member_id: '',
        lift_reason: '',
        lift_reason_detail: ''
      },
      rules: {
        member_id: [],
        email: [],
        lift_reason: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        lift_reason_detail: [{ required: true, message: ' ', trigger: ['blur', 'change'] }]
      },
      option: {
        lift_reason: [
          { label: '中止渠道关系', value: '1' },
          { label: '设置错误', value: '2' }
        ]
      },
      mode: 'Create'
    }
  },
  computed: {
    ...mapState({
      cbms_info: state => state.finance.cbms_info
    })
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
        if (data && Object.keys(data).length) {
          this.mode = 'Edit'
          this.form = Object.assign({}, this.default_form)
          this.check({ label: data.member_id, value: data.email })
          this.form.id = data.id
          this.form.email = data.email
          this.form.lift_reason = ''
          this.form.lift_reason_detail = ''
        } else {
          this.mode = 'Create'
          this.form = Object.assign({}, this.default_form)
        }
      })
    },
    query(val, cb) {
      let data = []
      if (val !== '') {
        const params = {
          username: this.form.email,
          type: 1,
          report: 1
        }
        this.Fetch.post('/V4/Account.Member.like', params).then(res => {
          const list = res.list
          if (list && list !== []) {
            data = formartList(list)
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
      const data = {
        id: this.form.id,
        lift_reason: this.form.lift_reason,
        lift_reason_detail: this.form.lift_reason_detail
      }
      this.Fetch.post('/V4/cbms.cb.channel.lift', data).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('init')
        this.$refs.dialog.handleClose()
      }).catch(e => {
        this.$refs.dialog.afterValidate()
      })
    }
  }
}
</script>
