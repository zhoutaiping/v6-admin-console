<style lang="scss" scoped>
.dialog-bill-detail-form {
  padding-top: 10px;
}
.dialog-bill-detail-form-item {
  display: inline-block;
  width: 275px;
  margin-bottom: 5px;
}
.dialog-receivable-detail-form-input {
  width: 175px;
}
.mb-10 {
  margin-bottom: 5px;
}
</style>

<template>
  <DmDialog
    ref="dmdialog"
    :title="detailForm.title"
    :footer="false"
    width="600px"
    aside
    class="DialogDetailt"
  >
    <DmScroll>
      <el-form
        v-loading="detailForm.loading"
        ref="detailForm"
        :model="detailForm"
        label-position="left"
        label-width="90px"
        size="mini"
        class="dialog-bill-detail-form"
      >
        <h3>概览信息</h3>
        <hr >
        <el-form-item
          label="流水号:"
          class="dialog-bill-detail-form-item"
        >
          {{ detailForm.record.flow_code || '--' }}
        </el-form-item><br >
        <el-form-item
          label="流水类型:"
          class="dialog-bill-detail-form-item"
        >
          {{ FLOW_TYPE_TEXT[detailForm.record.flow_type] || '--' }}
        </el-form-item>
        <el-form-item
          label="流水状态:"
          class="dialog-bill-detail-form-item"
        >
          {{ FLOW_STATUS_TEXT[detailForm.record.flow_status] || '--' }}
        </el-form-item>
        <el-form-item
          label="流水金额:"
          class="dialog-bill-detail-form-item"
        >
          {{ detailForm.record.flow_money || '--' }}
        </el-form-item>
        <el-form-item
          label="流水时间:"
          class="dialog-bill-detail-form-item"
        >
          {{ detailForm.record.flow_time || '--' }}
        </el-form-item>
        <el-form-item
          :label="is_bill?'关联账单ID:':'关联订单ID:'"
          class="dialog-bill-detail-form-item"
        >
          {{ is_bill ? detailForm.record.bill_id : detailForm.record.order_id || '--' }}
        </el-form-item>
        <el-form-item
          label="回款方式/退款路线:"
          class="dialog-bill-detail-form-item"
          label-width="150px"
        >
          {{ FLOW_SOURCE_TEXT[detailForm.record.flow_source] || '--' }}
        </el-form-item>
        <el-form-item
          label="关联邮箱:"
          class="mb-10"
        >
          {{ detailForm.record.member_email || '--' }}
        </el-form-item>
        <el-form-item
          label="客户名称:"
          class="mb-10"
        >
          {{ detailForm.record.member_basic_name|| '--' }}
        </el-form-item>
        <el-form-item
          label="备注:"
          class="mb-10"
        >
          {{ detailForm.record.remark|| '--' }}
        </el-form-item>
        <h3>余额信息</h3>
        <hr >
        <div v-if="panel_type === 'yd'">
          <el-form-item
            label="回款/退款前余额:"
            label-width="200px"
            class="dialog-bill-detail-form-item"
          >
            {{ detailForm.record.total_balance_before|| '--' }}
          </el-form-item><br >
          <el-form-item
            label="回款/退款后余额:"
            label-width="200px"
            class="dialog-bill-detail-form-item"
          >
            {{ detailForm.record.total_balance_after || '--' }}
          </el-form-item><br >
          <hr >
          <el-form-item
            label="回款/退款后微信充值余额:"
            class="dialog-bill-detail-form-item"
            label-width="200px"
          >
            {{ detailForm.record.online_balance_wx_after || '--' }}
          </el-form-item><br >
          <el-form-item
            label="回款/退款后支付宝充值余额:"
            class="dialog-bill-detail-form-item"
            label-width="200px"
          >
            {{ detailForm.record.online_balance_alipay_after || '--' }}
          </el-form-item><br >
          <el-form-item
            label="回款/退款后支付宝转账余额:"
            class="dialog-bill-detail-form-item"
            label-width="200px"
          >
            {{ detailForm.record.offline_balance_alipay_after || '--' }}
          </el-form-item><br >
          <el-form-item
            label="回款/退款后银行转账余额:"
            class="dialog-bill-detail-form-item"
            label-width="200px"
          >
            {{ detailForm.record.offline_balance_bank_after || '--' }}
          </el-form-item><br >
          <el-form-item
            label="回款/退款后网银转账余额:"
            class="dialog-bill-detail-form-item"
            label-width="200px"
          >
            {{ detailForm.record.online_balance_bank_baofu_after || '--' }}
          </el-form-item>
        </div>
        <div v-else-if="panel_type === 'bs'">
          <el-form-item
            label="回款前余额:"
            label-width="200px"
            class="dialog-bill-detail-form-item"
          >
            {{ detailForm.record.total_balance_baishan_before|| '--' }}
          </el-form-item><br >
          <el-form-item
            label="回款后余额:"
            label-width="200px"
            class="dialog-bill-detail-form-item"
          >
            {{ detailForm.record.total_balance_baishan_after || '--' }}
          </el-form-item><br >
          <hr >
          <el-form-item
            label="回款后白山微信充值余额:"
            class="dialog-bill-detail-form-item"
            label-width="200px"
          >
            {{ detailForm.record.baishan_online_balance_wx_after || '--' }}
          </el-form-item><br >
          <el-form-item
            label="回款后白山支付宝充值余额:"
            class="dialog-bill-detail-form-item"
            label-width="200px"
          >
            {{ detailForm.record.baishan_online_balance_alipay_after || '--' }}
          </el-form-item>
        </div>
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
        title: '账单详情',
        record: {}
      },
      panel_type: '',
      is_bill: false,
      FLOW_SOURCE_TEXT: FORM.FLOW_SOURCE_TEXT,
      FLOW_TYPE_TEXT: FORM.FLOW_TYPE_TEXT,
      FLOW_STATUS_TEXT: FORM.FLOW_STATUS_TEXT,
      orderList: []
    }
  },
  methods: {
    handleOpen(data, panel_type, is_bill) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.$refs.detailForm && this.$refs.detailForm.resetFields()
        this.detailForm.loading = true
        this.panel_type = panel_type
        this.is_bill = is_bill
        setTimeout(() => {
          this.detailForm.record = data
          this.detailForm.loading = false
        }, 500)
      })
    }
  }
}
</script>
