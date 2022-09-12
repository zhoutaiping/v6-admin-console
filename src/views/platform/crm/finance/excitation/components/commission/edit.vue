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
    :title="'佣金管理'"
    width="700px"
  >
    <DmScroll>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <DmCardPanel title="基本信息">
          <el-form-item
            label="订单Code"
            class="item-box"
            prop="name"
          >
            <el-input
              v-model="form.order_code"
              readonly
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            label="是否有效"
            prop="is_valid"
          >
            <DmSelect
              v-model="form.is_valid"
              :selects="option.is_valid"
              placeholder=" "
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            label="佣金比例"
            prop="commission_rate"
          >
            <el-input-number
              :min="1"
              :precision="0"
              v-model="form.commission_rate"
              class="input-box"
            /> %
          </el-form-item>
          <el-form-item
            label="发放状态"
            prop="is_grant"
          >
            <DmSelect
              v-model="form.is_grant"
              :selects="option.is_grant"
              placeholder=" "
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            label="预计到账"
            prop="expected_arrival_time"
          >
            <el-date-picker
              v-model="form.expected_arrival_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              clearable
              placeholder=" "
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            label="实际到账"
            prop="paid_arrival_time"
          >
            <el-date-picker
              v-model="form.paid_arrival_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              clearable
              placeholder=" "
              class="input-box"
            />
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="form.remark"
              type="textarea"
              class="input-box"
              placeholder="请输入备注"
            />
          </el-form-item>
        </DmCardPanel>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import { is_grant, is_valid } from '../../utils'
export default {
  data() {
    return {
      form: {
        id: [],
        is_grant: '',
        is_valid: '',
        commission_rate: 0,
        expected_arrival_time: '',
        paid_arrival_time: '',
        remark: ''
      },
      rules: {
        id: [{ required: true, message: ' ' }],
        is_grant: [{ required: true, message: ' ' }],
        is_valid: [{ required: true, message: ' ' }],
        commission_rate: [{ required: true, message: ' ' }],
        expected_arrival_time: [{ required: true, message: ' ' }],
        paid_arrival_time: [{ required: true, message: ' ' }],
        remark: []
      },
      option: {
        is_grant: is_grant,
        is_valid: is_valid
      },
      rowData: {},
      mode: 'Create'
    }
  },

  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.mode = option
        this.rowData = Object.assign({}, data)
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.form = Object.assign({}, data)
        // this.form.ids = data && [data.id] || []
        // delete this.form.id
      })
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const api = '/V4/cbms.order.commission.operation'
          const data = { ...this.form }
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
