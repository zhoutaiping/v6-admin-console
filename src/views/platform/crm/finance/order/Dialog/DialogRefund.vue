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
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handlePaybackSave"
    :title="'处理退款'"
    width="600px"
    class="dialog-base-report"
  >
    <DmScroll>
      <template>
        <el-form
          v-loading="DialogRefund.loading"
          ref="DialogRefund"
          :model="DialogRefund"
          :rules="rules"
          size="small"
          label-width="110px"
          label-position="left"
        >
          <el-form-item label-width="0" class="item-box-1">
            <el-form-item label="用户邮箱" class="item-box-1">{{ member_balance.email }}{{ Number(agent_flag) === 1 ? '（代理商）' :'' }}</el-form-item>
          </el-form-item>
          <el-form-item label-width="0" class="item-box-1">
            <el-form-item v-for="(item, _) in Object.keys(balance_conf)" :key="_" :label="balance_conf[item]" class="item-box">
              {{ member_balance[item] || 0 }} 元
            </el-form-item>
          </el-form-item>
          <el-form-item label-width="0">
            <el-form-item label="总余额" class="item-box">{{ member_balance.total_balance || 0 }} 元</el-form-item>
            <el-form-item label="待退款余额" class="item-box">{{ Number(member_balance.should_pay || 0).toFixed(2) || 0 }} 元</el-form-item>
          </el-form-item>
          <el-form-item label="退款方式" prop="flow_source" >
            <el-select
              v-model="DialogRefund.flow_source"
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
          <div v-if="Number(DialogRefund.flow_source) ===8 || Number(DialogRefund.flow_source) ===9 || Number(DialogRefund.flow_source) ===10">
            <el-form-item label="转账流水号" prop="flow_code">
              <el-input
                v-model="DialogRefund.flow_code"
                placeholder=""
                class="input-box"
              />
            </el-form-item>
            <el-form-item label="打款截图" prop="screen_pic">
              <el-upload
                ref="upload"
                :action="url"
                :on-preview="handlePreview"
                :on-change="fileChange"
                :file-list="fileList"
                :show-file-list="false"
                :auto-upload="false"
                class="upload-demo"
              >
                <el-button
                  v-show="DialogRefund.screen_pic===''"
                  slot="trigger"
                  size="mini"
                  type="primary"
                  style="margin-left:0px;"
                >选取图片</el-button>
                <img
                  v-show="DialogRefund.screen_pic!==''"
                  slot="trigger"
                  :src="DialogRefund.screen_pic"
                  class="image"
                  width="400"
                >
              </el-upload>
            </el-form-item>
            <el-form-item label=" 打款金额" class="item-box-1">
              {{ member_balance.should_pay }}
            </el-form-item>
          </div>
          <el-form-item label="备注" class="item-box-1">
            <el-input
              v-model="DialogRefund.remark"
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
import Form from '@/utils/form'
import * as FORM from './dialogForm'
import mealSource from '@/api/mealApi'

export default {
  data() {
    return {
      DialogRefund: new Form(FORM.PAYBACK, FORM.PAYBACK_RULE),
      url: '',
      fileList: [],
      rules: {
        screen_pic: [{ required: true, message: '请上传打款截图', trigger: ['change'] }],
        payback: [{ type: 'number', required: true, message: '请选择输入退款金额', trigger: ['blur'] }],
        flow_source: [{ required: true, message: '请选择退款方式', trigger: ['change', 'blur'] }],
        flow_code: [{ required: true, message: '请填写转账流水号', trigger: ['change', 'blur'] }],
        remark: [{ required: true, message: '请填写备注', trigger: ['change', 'blur'] }]
      },
      PAY_BTN: false,
      // 1现金 2银行转账 3余额 4微信 5支付宝
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
  mounted() {
  },
  methods: {
    handleOpen(rowData, email) {
      this.getFlowConfmap()
      this.$refs.dmdialog.handleOpen()
      this.member_balance = {}
      this.$nextTick(() => {
        this.DialogRefund.reset()
        this.DialogRefund.title = '处理退款'
        this.DialogRefund.loading = true
        this.DialogRefund.rowData = rowData
        const params = {
          order_id: rowData.id,
          'member_id': rowData.member_id
        }
        this.getMemberBalance(params)
        setTimeout(() => { this.DialogRefund.loading = false }, 500)
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
        const refund_source = res.refund_source
        const flow_source_Arr = []
        Object.keys(refund_source).forEach(key => {
          if (key !== '') {
            flow_source_Arr.push({
              label: refund_source[key], value: key
            })
          }
        })
        this.FlowConfmap.flow_source_Arr = flow_source_Arr
      })
    },
    handlePreview(file) {
    },
    fileChange(file, fileList) {
      this.DialogRefund.screen_pic = file.raw
      const paramsData = new FormData()
      paramsData.append('keyFiele', file.raw)
      this.upFile(paramsData, 'keyFiele')
    },

    upFile(params, fileUrl) {
      mealSource.ServiceUpload(params).then(res => {
        if (res[fileUrl]) {
          this.DialogRefund.screen_pic = res[fileUrl]
          this.Message('ACTION_SUCCESS')
        } else {
          this.DialogRefund.screen_pic = ''
          this.DialogRefund.screen_pic_img = ''
          this.Message('ACTION_ERROR')
        }
      })
    },
    async handlePaybackSave() {
      const params = {
        'order_code': this.DialogRefund.rowData.order_code,
        'flow_source': this.DialogRefund.flow_source,
        'flow_code': this.DialogRefund.flow_code,
        'screen_pic': this.DialogRefund.screen_pic,
        'flow_money': this.member_balance.should_pay,
        'remark': this.DialogRefund.remark
      }
      this.$refs.DialogRefund.validate((valid) => {
        if (valid) {
          this.InvokeAllApi.post('/fd/V4/order.refund.save', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('on-success')
            this.$refs.dmdialog.handleClose()
          }).catch(e => { this.$refs.dmdialog.afterValidate() })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }
}
</script>
