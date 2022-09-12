<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handlePaybackSave"
    :title="DialogPayBack.title"
    width="650px"
    class="el-dialog--DialogPayBack"
  >
    <DmScroll>
      <template>
        <el-form
          v-loading="DialogPayBack.loading"
          ref="Form"
          :model="DialogPayBack"
          :rules="rules"
          label-position="left"
          size="small"
          label-width="120px"
          style="margin:5px;"
        >
          <DmAlert style="margin-bottom: 10px;">
            <i class="el-icon-info primar-color" />
            回款将消费账单邮箱余额，请谨慎操作。
          </DmAlert>
          <el-form-item
            label-width="0"
            class="item-box-1"
          >
            <el-form-item
              label="用户邮箱"
              class="item-box-1"
            >{{ member_balance.email }}{{ Number(agent_flag) === 1 ? '（代理商）' :'' }}</el-form-item>
          </el-form-item>
          <el-form-item
            label-width="0"
            class="item-box-1"
          >
            <el-form-item
              v-for="(item, _) in Object.keys(balance_conf)"
              :key="_"
              :label="balance_conf[item]"
              class="item-box"
            >
              {{ member_balance[item] || 0 }} 元
            </el-form-item>
          </el-form-item>
          <el-form-item label-width="0">
            <el-form-item
              label="总余额"
              class="item-box"
            >{{ member_balance.total_balance || 0 }} 元</el-form-item>
            <el-form-item
              label="待回款金额"
              class="item-box"
            >{{ Number(member_balance.should_pay || 0).toFixed(2) || 0 }} 元</el-form-item>
          </el-form-item>
          <el-form-item
            label="回款方式"
            prop="flow_source"
          >
            <el-select
              v-model="DialogPayBack.flow_source"
              placeholder="请选择"
              class="input-box"
            >
              <el-option
                v-for="(item, index) in FlowConfmap.flow_source_Arr"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="回款金额"
            prop="payback"
          >
            <el-input-number
              v-model="DialogPayBack.payback"
              :step="1"
              :min="0"
              controls-position="right"
              placeholder=""
              class="input-box input-number"
            /> 元
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="DialogPayBack.remark"
              :autosize="{ minRows: 2, maxRows: 4}"
              class="input-box"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
      </template>
    </DmScroll>
  </DmDialog>
</template>
<script>
import * as FORM from './dialogForm'
export default {
  data() {
    return {
      DialogPayBack: {},
      rules: {
        payback: [{ type: 'number', required: true, message: ' ', trigger: ['blur'] }],
        flow_source: [{ required: true, message: ' ', trigger: ['change', 'blur'] }],
        remark: []
      },
      PAY_BTN: false,
      PAYBACK_TYPE: [
        { lable: '银行转账', value: '2' }, { lable: '余额', value: '3' },
        { lable: '微信', value: '4' }, { lable: '支付宝', value: '5' }
      ],
      FlowConfmap: {}, // 流水配置
      member_balance: {},
      agent_flag: 0,
      balance_conf: {},
      email: ''
    }
  },
  methods: {
    handleOpen(rowData, email = '') {
      this.$refs.dmdialog.handleOpen()
      this.getFlowConfmap()
      this.member_balance = {}
      this.$nextTick(() => {
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        this.DialogPayBack = Object.assign({}, FORM.PAYBACK)
        this.DialogPayBack.loading = true
        this.DialogPayBack.rowData = rowData
        this.email = email
        const params = {
          order_id: rowData.id,
          member_id: rowData.member_id
        }
        this.getMemberBalance(params)
        setTimeout(() => {
          this.DialogPayBack.loading = false
        }, 1000)
      })
    },

    getMemberBalance(params) {
      this.InvokeAllApi.post('/fd/V4/order.member.balance', params).then(res => {
        this.member_balance = res.member
        this.agent_flag = res.agent_flag
        this.balance_conf = res.conf
        this.member_balance.should_pay = res.should_pay
      })
    },

    getFlowConfmap() {
      this.InvokeAllApi.get('/fd/V4/order.flow.confmap', {}).then(res => {
        this.FlowConfmap = res
        const payback_source = res.payback_source
        const flow_source_Arr = []
        Object.keys(payback_source).forEach(key => {
          if (key !== '') {
            flow_source_Arr.push({
              label: payback_source[key], value: key
            })
          }
        })
        this.FlowConfmap.flow_source_Arr = flow_source_Arr
      })
    },

    async handlePaybackSave() {
      const params = {
        'order_code': this.DialogPayBack.rowData.order_code,
        'payback_type': this.DialogPayBack.flow_source,
        'payback': this.DialogPayBack.payback,
        'remark': this.DialogPayBack.remark
      }
      if (this.DialogPayBack.loading) {
        this.$refs.dmdialog.afterValidate()
        return
      }
      this.$refs.Form.validate((valid) => {
        if (valid) {
          if (Number(this.DialogPayBack.payback) <= 0) {
            this.message.warning('回款金额必须大于0')
            this.$refs.dmdialog.afterValidate()
            return
          }
          this.InvokeAllApi.post('/fd/V4/order.payback.save', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('on-success')
            this.$refs.dmdialog.handleClose()
          }).catch(e => {
            this.$refs.dmdialog.afterValidate()
          })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box-1 {
  margin-bottom: 0px;
}
.item-box {
  display: inline-block;
  width: 45%;
  margin-bottom: 0px;
}
</style>

