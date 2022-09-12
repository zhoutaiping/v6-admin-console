<style lang="postcss" scoped>
.dialog-receivable-eidt {
  .dialogForm {
    margin: 5px 0;
    .dialogForm-item {
      margin-bottom: 5px;
    }
    .dialogForm-input {
      width: 300px;
    }
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmit"
    :title="'编辑'"
    width="600px"
    aside
    class="dialog-receivable-eidt"
  >
    <DmScroll>
      <el-form
        ref="detailForm"
        :model="detailForm"
        :rules="rules"
        label-width="120px"
        label-position="left"
        size="mini"
        class="dialogForm"
      >
        <h4>应收单ID:{{ detailForm.id || '--' }}</h4>
        <hr>
        <ElFormItem
          label="操作密码"
          prop="op_pass"
        >
          <el-input
            v-model="detailForm.op_pass"
            type="password"
            clearable
            placeholder="操作密码"
            class="dialogForm-input input-number"
          />
        </ElFormItem>
        <ElFormItem
          label="客户名称"
          prop="cust_name"
        >
          <el-input
            v-model="detailForm.cust_name"
            placeholder="客户名称"
            class="dialogForm-input input-number"
          />
        </ElFormItem>
        <ElFormItem
          label="销售名称"
          prop="sale_id"
        >
          <el-select
            v-model="detailForm.sale_id"
            filterable
            placeholder="请选择"
            class="dialogForm-input"
          >
            <ElOption
              v-for="(item, key) in SALES"
              :key="key"
              :label="item.name || item.user_id"
              :value="item.user_id"
              :disabled="!item.user_id"
            />
          </el-select>
        </ElFormItem>
        <h4>应收单账期--服务</h4>
        <hr>
        <ElFormItem
          label="应收单账期"
          prop="period"
        >
          <el-date-picker
            v-model="detailForm.period"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择账期"
            class="dialogForm-input"
          />
        </ElFormItem>
        <ElFormItem
          label="账期开始时间"
          prop="period_start"
        >
          <el-date-picker
            v-model="detailForm.period_start"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="账期开始时间"
            class="dialogForm-input"
          />
        </ElFormItem>
        <ElFormItem
          label="账期结束时间"
          prop="period_end"
        >
          <el-date-picker
            v-model="detailForm.period_end"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="账期结束时间"
            class="dialogForm-input"
          />
        </ElFormItem>
        <ElFormItem
          label="服务时长"
          prop="period_service_time"
        >
          <el-input-number
            v-model="detailForm.period_service_time"
            controls-position="right"
            placeholder="服务时长"
            class="dialogForm-input input-number"
          /> 天
        </ElFormItem>
        <ElFormItem
          label="服务用量"
          prop="period_service_num"
        >
          <el-input-number
            v-model="detailForm.period_service_num"
            controls-position="right"
            placeholder="服务时长"
            class="dialogForm-input input-number"
          />
        </ElFormItem>
        <h4>应收单状态--计费</h4>
        <hr>
        <ElFormItem
          label="同步金蝶状态"
          prop="sync_status"
        >
          <el-select
            v-model="detailForm.sync_status"
            placeholder="同步金蝶状态"
            clearable
            class="dialogForm-input"
          >
            <ElOption
              v-for="(item, key) in SYNC_STATUS"
              :key="key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </ElFormItem>
        <ElFormItem
          label="财务确认状态"
          prop="financial_confirm_status"
        >
          <el-select
            v-model="detailForm.financial_confirm_status"
            placeholder="财务确认状态"
            clearable
            class="dialogForm-input"
          >
            <ElOption
              v-for="(item, key) in FINANCIAL_CONFIRM_STATUS"
              :key="key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </ElFormItem>
        <ElFormItem
          label="财务确认时间"
          prop="financial_confirm_time"
        >
          <el-date-picker
            v-model="detailForm.financial_confirm_time"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            class="dialogForm-input"
          />
        </ElFormItem>
        <ElFormItem
          label="计费开始时间"
          prop="calc_start_time"
        >
          <el-date-picker
            v-model="detailForm.calc_start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间"
            class="dialogForm-input"
          />
        </ElFormItem>
        <ElFormItem
          label="计费结束时间"
          prop="calc_end_time"
        >
          <el-date-picker
            v-model="detailForm.calc_end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间"
            class="dialogForm-input"
          />
        </ElFormItem>
        <ElFormItem
          label="计费数量"
          prop="calc_num"
        >
          <el-input-number
            v-model="detailForm.calc_num"
            controls-position="right"
            placeholder="计费价格"
            class="dialogForm-input input-number"
          />
        </ElFormItem>
        <ElFormItem
          label="计费单价"
          prop="calc_unit_price"
        >
          <el-input-number
            v-model="detailForm.calc_unit_price"
            controls-position="right"
            placeholder="计费价格"
            class="dialogForm-input input-number"
          />
        </ElFormItem>
        <ElFormItem
          label="回款金额"
          prop="pay_back_fee"
        >
          <el-input-number
            v-model="detailForm.pay_back_fee"
            controls-position="right"
            placeholder="回款金额"
            class="dialogForm-input input-number"
          />
        </ElFormItem>
        <ElFormItem
          label="应收金额"
          prop="total_fee"
        >
          <el-input-number
            v-model="detailForm.total_fee"
            controls-position="right"
            placeholder="应收金额"
            class="dialogForm-input input-number"
          />
        </ElFormItem>
        <el-form-item label="回款时间">
          <el-date-picker
            v-model="detailForm.remark"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间"
            class="dialogForm-input"
          />
        </el-form-item>
        <hr>

      </el-form>
    </DmScroll>
  </DmDialog>
</template>

<script>
import * as FORM from './c-from'
export default {
  data() {
    return {
      loading: false,
      open: false,
      detailForm: {},
      SALES: [],
      SYNC_STATUS: [{ label: '未同步', value: '1' }, { label: '已同步', value: '2' }],
      FINANCIAL_CONFIRM_STATUS: [{ label: '未确认', value: '1' }, { label: '确认通过', value: '2' }, { label: '确认不通过', value: '3' }],
      rules: FORM.rules
    }
  },
  methods: {
    handleOpen(data) {
      this.$refs.dmdialog.handleOpen()
      data.op_pass = ''
      this.getbasicconf()
      this.$nextTick(() => {
        this.loading = true
        this.detailForm = Object.assign({}, data)
        setTimeout(() => { this.loading = false }, 1000)
      })
    },

    getbasicconf() {
      this.SALES = []
      const api = '/fd/V4/customer.manage.getbasicconf'
      this.InvokeAllApi.get(api, {}).then(res => {
        const CRM_ADMIN_ID = JSON.parse(JSON.stringify(res.role_list)).filter(i => i.role_flag === 'CRM_ADMIN')[0].id || ''
        const SALES = !!CRM_ADMIN_ID && JSON.parse(JSON.stringify(res.user_list)).filter(i => i.role_id !== CRM_ADMIN_ID) || []
        this.SALES = SALES
      })
    },

    handleSubmit(form = 'detailForm') {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.InvokeAllApi.put('/V4/receivable.sys.update', this.getParams()).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('handleload')
            this.$refs.dmdialog.handleClose()
          }).catch(e => { this.$refs.dmdialog.afterValidate() })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    },

    getParams() {
      const params = {
        op_pass: this.detailForm.op_pass,
        id: this.detailForm.id,
        period: this.detailForm.period,
        period_start: this.detailForm.period_start,
        period_end: this.detailForm.period_end,
        period_service_time: this.detailForm.period_service_time,
        period_service_num: this.detailForm.period_service_num,
        sync_status: this.detailForm.sync_status,
        financial_confirm_status: this.detailForm.financial_confirm_status,
        financial_confirm_time: this.detailForm.financial_confirm_time,
        calc_start_time: this.detailForm.calc_start_time,
        calc_end_time: this.detailForm.calc_end_time,
        calc_num: this.detailForm.calc_num,
        calc_unit_price: this.detailForm.calc_unit_price,
        sale_id: this.detailForm.sale_id,
        sale_name: this.SALES.filter(i => i.user_id === this.detailForm.sale_id)[0].name || '--',
        cust_name: this.detailForm.cust_name,
        pay_back_fee: this.detailForm.pay_back_fee,
        total_fee: this.detailForm.total_fee,
        remark: this.detailForm.remark
      }
      return params
    }
  }
}
</script>
