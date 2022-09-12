
<style lang="scss" scoped>
.dialog—save-form {
  margin: 10px;
}
.dialog—save-item {
  margin-bottom: 10px;
}
.dialog—save-input {
  width: 250px;
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="mode === 'add' ? '充值金额' : '处理提现'"
    width="550px"
    class="DialogEdit"
  >
    <DmScroll>
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
        class="dialog—save-form"
      >
        <el-form-item
          label="客户邮箱"
          class="dialog—save-item"
        >{{ form.email }}</el-form-item>
        <el-form-item
          label="用户平台"
          class="dialog—save-item"
          prop="plat"
        >
          <el-radio-group
            v-model="form.plat"
            @change="changePlatRadio"
          >
            <ElRadio label="yd">云盾</ElRadio>
            <ElRadio label="bs">白山云</ElRadio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="总余额"
          class="dialog—save-item"
        >{{ form.plat==='yd' ? form.total_blance_yd || 0 : form.total_blance_bs || 0 }} 元</el-form-item>

        <el-form-item
          label="提现金额"
          prop="money"
        >
          <el-input-number
            v-model="form.money"
            :min="0"
            controls-position="right"
            placeholder="请输入金额"
            class="dialog—save-input input-number"
          /> 元
        </el-form-item>
        <el-form-item
          label="提现路径"
          prop="flow_source"
        >
          <el-select
            v-model="form.flow_source"
            placeholder=""
            class="dialog—save-input"
          >
            <ElOption
              v-for="(item, index) in FLOW_SOURCE"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="转账流水号"
          prop="flow_code"
        >
          <el-input
            v-model="form.flow_code"
            placeholder="请输入流水号"
            class="dialog—save-input"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="备注"
            type="textarea"
            class="dialog—save-input"
          />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
export default {
  data() {
    const validateMoney = (rule, value, callback) => {
      const total_money = this.form.plat === 'yd' ? this.form.total_blance_yd || 0 : this.form.total_blance_bs || 0
      if (value === '') {
        callback(new Error('请输入提现金额'))
      } else if (Number(value) === 0) {
        callback(new Error('提现金额必须大于0'))
      } else if (Number(value) > Number(total_money)) {
        callback(new Error('提现金额不能大于总金额'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      mode: 'add',
      FLOW_SOURCE: [{ label: '银行', value: '8' }, { label: '支付宝', value: '9' }, { label: '微信', value: '10' }],
      form: {},
      rules: {
        plat: [{ required: true, message: '请选择提现平台', trigger: ['change', 'blur'] }],
        money: [{ type: 'number', required: true, validator: validateMoney, trigger: ['change', 'blur'] }],
        flow_code: [{ required: true, message: '请输入流水号', trigger: ['change', 'blur'] }],
        flow_source: [{ required: true, message: '请选择提现路径', trigger: ['change', 'blur'] }]
      }
    }
  },
  methods: {
    handleOpen(data, type) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.loading = true
        this.mode = type
        this.$refs.dialogForm && this.$refs.dialogForm.resetFields()
        this.form = Object.assign({ plat: 'yd', money: 0, flow_source: '8', flow_code: '', remark: '' }, data)
        setTimeout(() => { this.loading = false }, 1000)
      })
    },
    changePlatRadio(value) { },

    handleSubmit(formName = 'dialogForm') {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.InvokeAllApi.post('/V4/member.balance.cashOut', this.getParams()).then(res => {
            this.message.success('提现成功！')
            this.$emit('on-success')
            this.$refs.dmdialog.handleClose()
          }).catch(e => { this.$refs.dmdialog.afterValidate() })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    },

    getParams() {
      const params = {
        member_id: this.form.id,
        plat: this.form.plat,
        money: this.form.money,
        flow_source: this.form.flow_source,
        flow_code: this.form.flow_code,
        remark: this.form.remark
      }
      return params
    }
  }
}
</script>
