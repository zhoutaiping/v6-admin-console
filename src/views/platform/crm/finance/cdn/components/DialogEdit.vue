<style lang="postcss" scoped>
.DialogDetail{
  .dialog-cdn-edit-form{
    padding-top: 10px;
    .dialog-cdn-edit-form-item {
      margin-bottom: 5px;
    }
    .dialog-receivable-detail-form-input {
        width: 300px;
        word-wrap:break-word;
      }
    .dialog-cdn-month-info-form-item {
      margin-bottom: 5px;
    }
  }
}

</style>

<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="detailForm.title"
    width="500px"
    aside
    class="DialogDetail"
  >
    <el-form v-loading="detailForm.loading" ref="detailForm" :model="detailForm" label-position="left" label-width="120px" size="mini" class="dialog-cdn-edit-form">
      <h3>账单基础信息</h3>
      <hr >
      <el-form-item
        label="账单ID:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ detailForm.record.id || '--' }}
      </el-form-item>
      <el-form-item
        label="套餐ID:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ detailForm.record.plan_id || '--' }}
      </el-form-item>
      <el-form-item
        label="关联日账单ID:"
        class="dialog-cdn-month-info-form-item"
      >
        <div class="dialog-receivable-detail-form-input">{{ detailForm.record.bill_day_ids || '--' }}</div>

      </el-form-item><br >
      <el-form-item
        label="用户邮箱:"
        style="margin-bottom: 5px;"
      >
        {{ detailForm.record.member_email || '--' }}
      </el-form-item>
      <el-form-item
        label="所属销售:"
        class="dialog-cdn-month-info-form-item"
      >
        <div class="dialog-receivable-detail-form-input">{{ detailForm.record.user_name_text || '--' }}</div>
      </el-form-item>
      <el-form-item
        label="所属平台:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ PLATFORM_TEXT[detailForm.record.platform] || '--' }}
      </el-form-item>
      <el-form-item
        label="账期:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ detailForm.record.period || '--' }}
      </el-form-item>
      <el-form-item
        label="账期开始时间:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ detailForm.record.start_date || '--' }}
      </el-form-item>
      <el-form-item
        label="账期结束时间:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ detailForm.record.end_date || '--' }}
      </el-form-item>
      <el-form-item
        label="财务状态:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ FINANCIAL_CONFIRM_STATUS_TEXT[detailForm.record.financial_confirm_status] || '--' }}
      </el-form-item>
      <el-form-item
        label="账单状态:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ MONTH_STATUS_TEXT[detailForm.record.status] || '--' }}
      </el-form-item>
      <el-form-item
        label="月账单应付金额:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ detailForm.record.pay_price }}
      </el-form-item><br >
      <el-form-item
        label="月账单实付金额:"
        class="dialog-cdn-month-info-form-item"
      >
        {{ detailForm.record.pay_off_price }}
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import * as FORM from './dialogForm'
export default {
  data() {
    return {
      detailForm: {
        loading: false,
        visible: false,
        title: '确认账单',
        record: {}
      },
      FINANCIAL_CONFIRM_STATUS_TEXT: FORM.FINANCIAL_CONFIRM_STATUS_TEXT,
      MONTH_STATUS_TEXT: FORM.MONTH_STATUS_TEXT,
      PLATFORM_TEXT: FORM.PLATFORM_TEXT
    }
  },
  methods: {
    handleOpen(data) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.$refs.detailForm && this.$refs.detailForm.resetFields()
        this.detailForm.loading = true
        this.detailForm.record = {}
        this.getDetail({ id: data.id })
        setTimeout(() => {
          this.detailForm.loading = false
        }, 500)
      })
    },
    getDetail(params) {
      this.InvokeAllApi.post('/fd/V4/order.billmonthdetail', params).then(res => {
        const bill_day_detail = JSON.parse(JSON.stringify(res.bill_day_detail || {}))
        this.detailForm.record = {
          ... bill_day_detail,
          user_name_text: bill_day_detail.user_name.length && bill_day_detail.user_name.join(',') || ''
        }
      })
    },

    handleSubmit() {
      this.InvokeAllApi.post('/fd/V4/order.billmonthconfirm',
        { id: this.detailForm.record.id }).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('handleload')
        this.$refs.dmdialog.handleClose()
      }).catch(e => { this.$refs.dmdialog.afterValidate() })
    }
  }
}
</script>
