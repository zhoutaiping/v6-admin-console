<style lang="scss" scoped>
.dialogDetail {
  .dialog-bill-edit-form {
    margin: 10px 10px 10px;
    .form-item2{
      display: inline-block;
    }
    .form-input {
      width: 175px;
    }
  }
  .mb-10 {
    margin-bottom: 5px;
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="detailForm.title"
    width="600px"
    aside
    class="dialogDetail"
  >
    <DmScroll>
      <el-form
        v-loading="detailForm.loading"
        ref="editForm"
        :model="editForm"
        :rules="rules"
        label-position="left"
        label-width="90px"
        size="mini"
        class="dialog-bill-edit-form"
      >
        <h3>流水信息</h3><hr>
        <el-form-item label="流水号" class="form-item" style="margin-bottom: 5px;">{{ editForm.flow_code || '--' }}</el-form-item>
        <el-form-item label="流水状态" class="form-item2" prop="flow_status">
          <el-select v-model="editForm.flow_status" disabled placeholder="" class="form-input">
            <ElOption v-for="(item, key) in FLOW_STATUS" :key="key" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="流水金额" class="form-item2" prop="flow_money">
          <el-input-number v-model="editForm.flow_money" controls-position="right" placeholder="" class="form-input input-number"/>
        </el-form-item>
        <el-form-item label="流水时间" class="form-item2" prop="flow_time">
          <el-date-picker v-model="editForm.flow_time" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="回款/流水时间" class="form-input"/>
        </el-form-item>
        <el-form-item label="流水来源" class="form-item2" prop="flow_source">
          <el-select v-model="editForm.flow_source" placeholder="" class="form-input">
            <ElOption v-for="(item, key) in FLOW_SOURCE" :key="key" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="用户ID" class="form-item2" prop="member_id">
          <el-input v-model="editForm.member_id" placeholder="" class="form-input"/>
        </el-form-item>
        <el-form-item label="用户邮箱" class="form-item2" prop="member_email">
          <el-input v-model="editForm.member_email" placeholder="" class="form-input"/>
        </el-form-item>
        <el-form-item label="代理商ID" class="form-item2" >
          <el-input v-model="editForm.leaf_member_id" placeholder="" class="form-input"/>
        </el-form-item>
        <el-form-item label="代理商邮箱" class="form-item2">
          <el-input v-model="editForm.leaf_member_email" placeholder="" class="form-input"/>
        </el-form-item>
        <el-form-item label="销售" class="form-item" prop="sales_id">
          <el-select v-model="editForm.sales_id" multiple filterable placeholder="销售" style="width:98%">
            <ElOption v-for="(item, key) in SALES" :key="key" :label="item.name" :value="item.user_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="操作密码" class="form-item" prop="op_pass">
          <el-input v-model="editForm.op_pass" type="password" placeholder="操作密码" class="form-input"/>
        </el-form-item>

        <h3>余额信息</h3><hr >
        <div v-if="panel_type === 'yd'">
          <el-form-item label="回款/退款前余额" label-width="200px" class="form-item" prop="total_balance_before">
            <el-input-number v-model="editForm.total_balance_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款后余额" label-width="200px" class="form-item" prop="total_balance_after">
            <el-input-number v-model="editForm.total_balance_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item><hr >
          <el-form-item label="回款/退款前微信充值余额" class="form-item" label-width="200px" prop="online_balance_wx_before">
            <el-input-number v-model="editForm.online_balance_wx_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款后微信充值余额" class="form-item" label-width="200px" prop="online_balance_wx_after">
            <el-input-number v-model="editForm.online_balance_wx_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款前支付宝充值余额" class="form-item" label-width="200px" prop="online_balance_alipay_before">
            <el-input-number v-model="editForm.online_balance_alipay_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款后支付宝充值余额" class="form-item" label-width="200px" prop="online_balance_alipay_after">
            <el-input-number v-model="editForm.online_balance_alipay_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款前支付宝转账余额" class="form-item" label-width="200px" prop="offline_balance_alipay_before">
            <el-input-number v-model="editForm.offline_balance_alipay_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款后支付宝转账余额" class="form-item" label-width="200px" prop="offline_balance_alipay_after">
            <el-input-number v-model="editForm.offline_balance_alipay_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款前银行转账余额" class="form-item" label-width="200px" prop="offline_balance_bank_before">
            <el-input-number v-model="editForm.offline_balance_bank_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款后银行转账余额" class="form-item" label-width="200px" prop="offline_balance_bank_after">
            <el-input-number v-model="editForm.offline_balance_bank_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款前网银转账余额" class="form-item" label-width="200px" prop="offline_balance_bank_before">
            <el-input-number v-model="editForm.online_balance_bank_baofu_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款/退款后网银转账余额" class="form-item" label-width="200px" prop="offline_balance_bank_after">
            <el-input-number v-model="editForm.online_balance_bank_baofu_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
        </div>
        <div v-else-if="panel_type === 'bs'">
          <el-form-item label="回款前余额" label-width="200px" prop="total_balance_baishan_before">
            <el-input-number v-model="editForm.total_balance_baishan_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款后余额" label-width="200px" prop="total_balance_baishan_after">
            <el-input-number v-model="editForm.total_balance_baishan_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item><hr >
          <el-form-item label="回款前白山微信充值余额" label-width="200px" prop="baishan_online_balance_wx_before">
            <el-input-number v-model="editForm.baishan_online_balance_wx_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款后白山微信充值余额" label-width="200px" prop="baishan_online_balance_wx_after">
            <el-input-number v-model="editForm.baishan_online_balance_wx_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款前白山支付宝充值余额" label-width="200px" prop="baishan_online_balance_alipay_before">
            <el-input-number v-model="editForm.baishan_online_balance_alipay_before" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
          <el-form-item label="回款后白山支付宝充值余额" label-width="200px" prop="baishan_online_balance_alipay_after">
            <el-input-number v-model="editForm.baishan_online_balance_alipay_after" :precision="2" controls-position="right" placeholder="" class="form-input input-number"/>
          </el-form-item>
        </div>
        <el-form-item label="备注" class="mb-10">
          <el-input v-model="editForm.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>

<script>
import * as FORM from './form'
export default {
  data() {
    return {
      detailForm: {
        loading: false,
        visible: false,
        title: '流水修改',
        record: {}
      },
      editForm: {
        op_pass: ''
      },
      rules: FORM.rules,
      panel_type: '',
      is_bill: false,
      FLOW_SOURCE: [],
      FLOW_SOURCE_TEXT: FORM.FLOW_SOURCE_TEXT,
      FLOW_TYPE: FORM.FLOW_TYPE,
      FLOW_TYPE_TEXT: FORM.FLOW_TYPE_TEXT,
      FLOW_STATUS: FORM.FLOW_STATUS,
      FLOW_STATUS_TEXT: FORM.FLOW_STATUS_TEXT,
      orderList: [],
      SALES: []

    }
  },
  methods: {
    handleOpen(data, panel_type, is_bill) {
      this.getSaleList()
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.FLOW_SOURCE = panel_type === 'bs' ? FORM.FLOW_SOURCE_BS : FORM.FLOW_SOURCE
        const rowData = JSON.parse(JSON.stringify(data))
        this.$refs.detailForm && this.$refs.detailForm.resetFields()
        this.detailForm.loading = true
        this.panel_type = panel_type
        this.is_bill = is_bill
        setTimeout(() => {
          this.detailForm.record = rowData
          this.editForm = Object.assign({ op_pass: '' }, rowData)
          this.detailForm.loading = false
        }, 500)
      })
    },
    handleClose() {
      this.detailForm.visible = false
    },

    async getSaleList() {
      this.SALES = []
      const api = '/fd/V4/customer.manage.getbasicconf'
      await this.InvokeAllApi.get(api, {}).then(res => {
        const CRM_ADMIN_ID = JSON.parse(JSON.stringify(res.role_list)).filter(i => i.role_flag === 'CRM_ADMIN')[0].id || ''
        const SALES = !!CRM_ADMIN_ID && JSON.parse(JSON.stringify(res.user_list)).filter(i => i.role_id !== CRM_ADMIN_ID) || []
        this.SALES = SALES
      })
    },

    handleSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.InvokeAllApi.post('/V4/financial.flow.update', this.getParams()).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('loadGrid')
            this.$refs.dmdialog.handleClose()
          }).catch(e => { this.$refs.dmdialog.afterValidate() })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    },

    getParams() {
      let params = {
        id: this.editForm.id,
        member_id: this.editForm.member_id,
        member_email: this.editForm.member_email,
        leaf_member_id: this.editForm.leaf_member_id,
        leaf_member_email: this.editForm.leaf_member_email,
        flow_source: this.editForm.flow_source,
        flow_money: this.editForm.flow_money,
        flow_time: this.editForm.flow_time,
        flow_status: this.editForm.flow_status,
        flow_type: this.editForm.flow_type,
        remark: this.editForm.remark,
        sales_id: (this.editForm.sales_id).join(','),
        op_pass: this.editForm.op_pass
      }
      const params_yd = {
        total_balance_before: this.editForm.total_balance_before,
        total_balance_after: this.editForm.total_balance_after,
        online_balance_wx_before: this.editForm.online_balance_wx_before,
        online_balance_wx_after: this.editForm.online_balance_wx_after,
        online_balance_alipay_before: this.editForm.online_balance_alipay_before,
        online_balance_alipay_after: this.editForm.online_balance_alipay_after,

        offline_balance_alipay_before: this.editForm.offline_balance_alipay_before,
        offline_balance_alipay_after: this.editForm.offline_balance_alipay_after,
        offline_balance_bank_before: this.editForm.offline_balance_bank_before,
        offline_balance_bank_after: this.editForm.offline_balance_bank_after,
        online_balance_bank_baofu_before: this.editForm.online_balance_bank_baofu_before,
        online_balance_bank_baofu_after: this.editForm.online_balance_bank_baofu_after
      }
      const params_bs = {
        total_balance_baishan_before: this.editForm.total_balance_baishan_before,
        total_balance_baishan_after: this.editForm.total_balance_baishan_after,
        baishan_online_balance_wx_before: this.editForm.baishan_online_balance_wx_before,
        baishan_online_balance_wx_after: this.editForm.baishan_online_balance_wx_after,
        baishan_online_balance_alipay_before: this.editForm.baishan_online_balance_alipay_before,
        baishan_online_balance_alipay_after: this.editForm.baishan_online_balance_alipay_after
      }
      if (this.panel_type === 'yd') params = Object.assign(params, params_yd)
      if (this.panel_type === 'bs') params = Object.assign(params, params_bs)
      return params
    }
  }
}
</script>
