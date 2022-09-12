<style lang="scss" scoped>
.form-box {
  margin-top: 10px;
}
.item-box {
  margin-bottom: 5px;
}
.input-box {
  width: 300px;
}
.tab-order{
  margin-bottom: 10px;
  th {
    border-top: 1px solid rgb(223, 229, 236);
    background-color: $--color-primary;
    color: #FFFFFF;
    padding: 8px 0;
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :title="'发票详情'"
    :footer="false"
    width="600px"
    aside
    class="dialog-invoice-detail"
  >
    <DmScroll>
      <el-form ref="applyForm" :model="applyForm" :rules="apply_rule" label-position="left" label-width="130px" class="form-box">
        <el-form-item label="开票邮箱"> {{ applyForm.email }}  </el-form-item>
        <h3>发票状态</h3><hr>
        <el-form-item label="发票状态" class="item-box"> {{ STATUS[applyForm.status] }} </el-form-item>
        <el-form-item label="发票号" class="item-box">
          {{ applyForm.invoice_taxcode }}
        </el-form-item>
        <el-form-item label="开具时间" class="item-box">
          {{ applyForm.invoice_time }}
        </el-form-item>
        <el-form-item label="备注" class="item-box">
          {{ applyForm.refund_remark }}
        </el-form-item>
        <h3>金额信息</h3><hr>
        <el-form-item label="关联订单ID" class="item-box">
          {{ applyForm.order_ids }}
        </el-form-item>
        <el-form-item label="开票总金额" class="item-box">
          {{ applyForm.invoice_amount }}
        </el-form-item>
        <el-form-item label="开票产品名称" class="item-box">
          {{ applyForm.invoice_product_name }}
        </el-form-item>
        <h3>发票信息</h3><hr>
        <el-form-item label="发票类型" class="item-box">
          <span>{{ INVOICE_TYPE_TEXT[applyForm.invoice_type]|| '--' }}</span>
        </el-form-item>
        <el-form-item label="发票抬头" class="item-box">
          <span>{{ applyForm.invoice_title|| '--' }}</span>
        </el-form-item>
        <el-form-item label="税务登记证号" class="item-box">
          <span>{{ applyForm.company_taxer_code|| '--' }}</span>
        </el-form-item>
        <el-form-item label="基本开户银行名称" class="item-box">
          <span>{{ applyForm.company_bank|| '--' }}</span>
        </el-form-item>
        <el-form-item label="基本开户账号" class="item-box">
          <span>{{ applyForm.company_bank_code|| '--' }}</span>
        </el-form-item>
        <el-form-item label="注册场所地址" class="item-box">
          <span>{{ applyForm.company_reg_address|| '--' }}</span>
        </el-form-item>
        <el-form-item label="注册固定电话" class="item-box">
          <span>{{ applyForm.company_reg_tel|| '--' }}</span>
        </el-form-item>
        <h3>退票信息</h3><hr>
        <el-form-item label="退票原因" class="item-box">
          {{ applyForm.refund_reason }}
        </el-form-item>
        <el-form-item label="退票寄回物流" class="item-box">
          {{ applyForm.refund_express_company }}
        </el-form-item>
        <el-form-item label="物流单号" class="item-box">
          {{ applyForm.refund_express_code }}
        </el-form-item>
        <el-form-item label="退票扫描件" class="item-box">
          <el-popover v-if="applyForm.refund_img" placement="left-start">
            <img :src="applyForm.refund_img" class="image" style="height:667px;" alt="">
            <img slot="reference" :src="applyForm.biz_licence_img" class="image" style="width:100px; height:80px;" alt="">
          </el-popover>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
import * as FORM from './c-from.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
      applyForm: {},
      apply_rule: FORM.APPLYFORM_RULE,
      list: [],
      STATUS: { '-1': '删除', '0': '未处理', '1': '待审核', '2': '审核不通过', '3': '已开具', '4': '已撤回', '5': '待确认退票', '6': '已退票' },
      INVOICE_TYPE_TEXT: { 1: '增值税普通发票', 2: '增值税专用发票' }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.applyForm = {}
    })
  },
  methods: {
    handleOpen(data) {
      this.$refs.dmdialog.handleOpen()
      this.loading = true
      this.setFieldValue(data)
      setTimeout(() => { this.loading = false }, 1000)
    },
    setFieldValue(data) {
      this.applyForm = data
    }
  }

}
</script>
