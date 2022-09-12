<style lang="postcss" scoped>
  .app-center-bill-payback{
    .dialogpayback-form{
      .dialogpayback-form-input{
        width: 400px;
      }
    }
  }

</style>
<style lang="postcss">
.DialogPayBack {
  .el-dialog__header {
    border-bottom: 0.5px solid #cdcdcd;
    .el-dialog__title {
      padding-left: 5px;
      border-left: 3px solid #409EFF;
    }
  }
  .el-dialog__body{
    padding: 5px 5px !important;
  }
  .el-dialog__footer{
    padding: 10px 0 0;
    .dialog-footer {
      padding: 10px;
      border-top: 0.5px solid #cdcdcd;
    }
  }
}
</style>
<template>
  <div class="app-center-bill-payback">
    <el-dialog :close-on-click-modal="true" :title ="DialogPayBack.title" :visible.sync="DialogPayBack.visible" class="DialogPayBack" width="600px">
      <template>
        <el-form v-loading="DialogPayBack.loading" ref="dialog_pay_back" :model="DialogPayBack" class="dialogpayback-form" size="small" label-width="100px">
          <el-form-item label="回款方式" style="margin-top:5px;">
            <el-select v-model="DialogPayBack.payback_type" placeholder="请选择" class="dialogpayback-form-input">
              <el-option v-for="(item, index) in PAYBACK_TYPE" :key="index" :label="item.lable" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item v-show="DialogPayBack.payback_type!=='3'" label="转账单号">
            <el-input v-model="DialogPayBack.payback_code" placeholder="请输入转账单号" class="dialogpayback-form-input"/>
          </el-form-item>
          <el-form-item label="转账金额">
            <el-input-number v-model="DialogPayBack.payback" placeholder="" class="dialogpayback-form-input"/> 元
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="DialogPayBack.remark"
              :autosize="{ minRows: 4, maxRows: 4}"
              class="dialogpayback-form-input"
              type="textarea"
              placeholder="请输入内容"/>
          </el-form-item>
        </el-form>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="handleClose">取 消</el-button>
        <el-button v-loading="PAY_BTN" type="primary" @click="handlePaybackSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      DialogPayBack: {
        loading: false,
        title: '确认回款',
        visible: false,
        order_code: '',
        payback_type: '2',
        payback_code: '',
        remark: '',
        payback: 0,
        pay_price: 0, // 应付
        pay_off_price: 0 // 实付
      },
      PAY_BTN: false,
      PAYBACK_TYPE: [
        { lable: '现金支付', value: '1' }, { lable: '银行转账 ', value: '2' },
        { lable: '余额支付', value: '3' }, { lable: '微信支付', value: '4' }, { lable: '支付宝支付', value: '5' }, { lable: '欠款支付', value: '6' }
      ]
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.$refs.dialog_pay_back && this.$refs.dialog_pay_back.resetFields()
        this.DialogPayBack.visible = true
        this.DialogPayBack.loading = true
        setTimeout(() => {
          this.DialogPayBack.loading = false
        }, 500)
      })
    },
    handleClose() {
      this.DialogPayBack.visible = true
    },

    handlePaybackSave() {
      this.DialogPayBack.visible = true
      this.PAY_BTN = true
      setTimeout(() => {
        this.PAY_BTN = false
      }, 500)
    }
  }
}
</script>
