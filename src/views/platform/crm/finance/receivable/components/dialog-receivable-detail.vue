<style lang="postcss" scoped>
.dialog-receivable-detail {
  .dialog-receivable-detail-form {
    margin: 10px 0;
    .dialog-receivable-detail-form-item2 {
      margin-bottom: 5px;
    }
    .dialog-receivable-detail-form-item {
      display: inline-block;
      width: 275px;
      margin-bottom: 5px;
      .dialog-receivable-detail-form-input {
        width: 175px;
      }
    }
    .text {
      word-wrap: break-word;
    }
  }
}
</style>

<template>
  <DmDialog
    ref="dmdialog"
    :title="'应收详情'"
    :footer="false"
    width="600px"
    aside
    class="dialog-receivable-detail"
  >
    <DmScroll>
      <el-form
        ref="detailForm"
        :model="detailForm"
        label-position="left"
        label-width="120px"
        size="mini"
        class="dialog-receivable-detail-form"
      >
        <h3>应账单信息</h3>
        <hr>
        <el-form-item
          label="应收账单ID"
          class="dialog-receivable-detail-form-item2"
        >{{ detailForm.record.id || '--' }}</el-form-item>
        <el-form-item
          label="应收账单标识"
          class="dialog-receivable-detail-form-item2"
        >{{ detailForm.record.receivable_code || '--' }}</el-form-item>
        <el-form-item
          label="账期"
          class="dialog-receivable-detail-form-item"
        > {{ detailForm.record.period || '--' }}</el-form-item>
        <el-form-item
          label="账单类型"
          class="dialog-receivable-detail-form-item"
        >{{ TYPE_TEXT[Number(detailForm.record.type)] || '--' }} </el-form-item>
        <el-form-item
          label="账期开始时间"
          class="dialog-receivable-detail-form-item"
        > {{ detailForm.record.period_start || '--' }}</el-form-item>
        <el-form-item
          label="账期结束时间"
          class="dialog-receivable-detail-form-item"
        > {{ detailForm.record.period_end || '--' }}</el-form-item>
        <el-form-item
          label="本期服务时长"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.period_service_time || '--' }} 天</el-form-item>
        <el-form-item
          label="本期服务量"
          class="dialog-receivable-detail-form-item"
        > {{ detailForm.record.period_service_num || '--' }}</el-form-item>
        <el-form-item
          label="计费开始时间"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.calc_start_time|| '--' }}</el-form-item>
        <el-form-item
          label="计费结束时间"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.calc_end_time || '--' }}</el-form-item>
        <el-form-item
          label="计费数量"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.calc_num|| '--' }}</el-form-item>
        <el-form-item
          label="计费类型"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.calc_type_legend || '--' }}</el-form-item>
        <ElFormItem
          label="计费单价"
          class="dialog-receivable-detail-form-item2"
        >{{ detailForm.record.calc_unit_price || '--' }}</ElFormItem>
        <el-form-item
          label="应收金额"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.total_fee || '--' }}</el-form-item>
        <el-form-item
          label="付款方式"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.pay_type_legend || '--' }}</el-form-item>
        <el-form-item
          label="回款金额"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.pay_back_fee || '--' }}</el-form-item>
        <el-form-item
          label="回款时间"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.remark || '--' }}</el-form-item>
        <el-form-item
          label="用户ID"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.member_id || '--' }}</el-form-item>
        <el-form-item
          label="代理下线用户ID"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.leaf_member_id || '--' }}</el-form-item>
        <el-form-item
          label="账单创建时间"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.created_at || '--' }}</el-form-item>
        <el-form-item
          label="账单更新时间"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.updated_at || '--' }}</el-form-item>
        <h3>应收单-源单信息</h3>
        <hr>
        <el-form-item
          v-if="detailForm.record.bill_month_id !=='0' && detailForm.record.bill_month_id"
          label="关联月账单ID"
          class="dialog-receivable-detail-form-item2"
        >
          {{ detailForm.record.bill_month_id || '--' }}
        </el-form-item>
        <el-form-item
          v-if="detailForm.record.cbm_plan_id"
          label="关联套餐ID"
          class="dialog-receivable-detail-form-item2"
        >
          {{ detailForm.record.cbm_plan_id || '--' }}
        </el-form-item>
        <el-form-item
          v-if="detailForm.record.cbm_bill_day_ids"
          label="关联日账单ID"
          class="dialog-receivable-detail-form-item2"
        >
          <div class="text">{{ detailForm.record.cbm_bill_day_ids || '--' }}</div>
        </el-form-item>
        <el-form-item
          v-if="detailForm.record.cbm_financial_confirm_status"
          label="账单状态"
          class="dialog-receivable-detail-form-item2"
        >
          <div class="text">{{ FINANCIAL_CONFIRM_STATUS_TEXT[(+detailForm.record.cbm_financial_confirm_status)] || '--' }}</div>
        </el-form-item>
        <el-form-item
          v-if="detailForm.record.cbm_pay_price"
          label="账单应付金额"
          class="dialog-receivable-detail-form-item"
        >
          <div class="text">{{ detailForm.record.cbm_pay_price || '--' }}</div>
        </el-form-item>
        <el-form-item
          v-if="detailForm.record.cbm_pay_off_price"
          label="账单实付金额"
          class="dialog-receivable-detail-form-item"
        >
          <div class="text">{{ detailForm.record.cbm_pay_off_price || '--' }}</div>
        </el-form-item>
        <el-form-item
          v-if="detailForm.record.cbm_period_start && detailForm.record.bill_month_id !=='0' && detailForm.record.bill_month_id"
          label="账单开始时间"
          class="dialog-receivable-detail-form-item"
        >
          <div class="text">{{ detailForm.record.cbm_period_start || '--' }}</div>
        </el-form-item>
        <el-form-item
          v-if="detailForm.record.cbm_period_end && detailForm.record.bill_month_id !=='0' && detailForm.record.bill_month_id"
          label="账单结束时间"
          class="dialog-receivable-detail-form-item"
        >
          <div class="text">{{ detailForm.record.cbm_period_end || '--' }}</div>
        </el-form-item>
        <el-form-item
          v-if="detailForm.record.r_order_ids"
          label="关联源单ID"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.r_order_ids || '--' }}</el-form-item>
        <el-form-item
          v-if="detailForm.record.plan_id"
          label="关联套餐ID"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.plan_id || '--' }}</el-form-item>
        <el-form-item
          v-if="detailForm.record.order_code"
          label="订单标识"
          class="dialog-receivable-detail-form-item2"
        >{{ detailForm.record.order_code || '--' }}</el-form-item>
        <el-form-item
          v-if="detailForm.record.op_type_legend"
          label="订单类型"
          class="dialog-receivable-detail-form-item2"
        >{{ detailForm.record.op_type_legend || '--' }}</el-form-item>
        <el-form-item
          v-if="detailForm.record.meal_flag"
          label="套餐标识"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.meal_flag || '--' }}</el-form-item>
        <el-form-item
          v-if="detailForm.record.meal_flag"
          label="套餐名称"
          class="dialog-receivable-detail-form-item2"
        >{{ detailForm.record.meal_name || '--' }}</el-form-item>
        <el-form-item
          v-if="detailForm.record.r_order_ids"
          label="订单开始时间"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.order_start_time || '--' }}</el-form-item>
        <el-form-item
          v-if="detailForm.record.r_order_ids"
          label="订单结束时间"
          class="dialog-receivable-detail-form-item"
        >{{ detailForm.record.order_end_time || '--' }}</el-form-item>
        <el-form-item
          label="客户邮箱"
          class="dialog-receivable-detail-form-item2"
        > {{ detailForm.record.email || '--' }}</el-form-item>
        <el-form-item
          label="客户名称"
          class="dialog-receivable-detail-form-item2"
        > {{ detailForm.record.cust_name || '--' }}</el-form-item>
        <el-form-item
          v-if="detailForm.record.sale_name"
          label="所属销售"
          class="dialog-receivable-detail-form-item"
        > {{ detailForm.record.sale_name || '--' }}</el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>

export default {
  props: {
    users: [Object, Array]
  },
  data() {
    return {
      loading: false,
      TYPE_TEXT: { 1: '正常账单', 2: '红冲账单' },
      FINANCIAL_CONFIRM_STATUS_TEXT: {
        1: '未确认', 2: '确认通过', 3: '确认不通过'
      },
      detailForm: { record: {}}
    }
  },

  methods: {
    handleOpen(data) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.loading = true
        const r_order_ids = (data.r_order_ids).replace(/\[|"|]/g, '')
        data.r_order_ids = r_order_ids
        this.detailForm.record = data
        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
    },

    getSaleText(sale_user_id) {
      let sale_text = ''
      let sale = []
      const users = this.users
      if (JSON.stringify(users) === '[]' || JSON.stringify(users) === '{}') {
        return '--'
      }
      if (sale_user_id) {
        sale = sale_user_id.split(',')
      }
      if (sale.length > 0 && users) {
        if (sale.length === 1) {
          sale_text = users[sale[0]].nickname
        } else if (sale.length > 1) {
          sale.forEach((element, index) => {
            if (index === 0) {
              sale_text = users[element].nickname
            } else {
              sale_text = users[element].nickname + ',' + sale_text
            }
          })
        }
      } else {
        sale_text = '--'
      }
      return sale_text
    }
  }
}
</script>
