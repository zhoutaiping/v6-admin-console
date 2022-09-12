<style lang="scss" scoped>
/deep/.el-card__header {
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    title="套餐详情"
    aside
    class="orderinfo"
  >
    <div>
      <el-tabs v-model="tab" type="card">
        <el-tab-pane label="配置详情" name="plan" />
        <el-tab-pane label="关联订单" name="plan_list" />
        <el-tab-pane v-if="cdn_meal" label="关联日账单" name="billday" />
      </el-tabs>
      <Plan v-show="tab === 'plan'" ref="plan" :data="info" :loss_desc="loss_desc" :cdn="cdn_meal"/>
      <List
        v-show="tab === 'plan_list'"
        :data="plan.list"
        :column="column.plan"
        :order-type="plan.map_order_type"
        :buy-type="plan.map_buy_type"
        :order-status="plan.map_order_status"/>
      <List v-show="tab === 'billday'" :data="billday" :column="column.billday" />
    </div>
  </DmDialog>
</template>

<script>
import Plan from './plan'
import List from './list'
export default {
  components: { Plan, List },
  data() {
    return {
      loading: true,
      cdn_meal: false, // cdn 套餐
      tab: 'plan',
      info: {},
      loss_desc: '',
      plan: {
        list: []
      },
      billday: [],
      financial_confirm_status: { 1: '未确认', 2: '确认通过', 3: '确认不通过' },
      column: column()
    }
  },

  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.tab = 'plan'
        // 配置详情
        this.getInfo({ id: data.id }, option)
        this.loss_desc = option
        // 关联订单
        this.planList({ plan_id: data.id, page: 1, pre_page: 999 })
        // 关联日账单
        this.cdn_meal = findCnd(data.meal_flag)
        this.cdn_meal && this.planBillday({ plan_id: data.id })
      })
    },
    async getInfo(params, loss_desc) {
      this.info = {}
      try {
        const data = await this.Fetch.get('/V4/customer.plan.info', params)
        this.info = data
      } catch (error) {
        return
      }
    },
    async planList(params) {
      this.plaln = { list: [] }
      try {
        const data = await this.Fetch.post('/fd/V4/order.plan.list', params)
        this.plan = data
      } catch (e) {
        return
      }
    },

    async planBillday(params) {
      this.billday = []
      try {
        const data = await this.InvokeAllApi.post('/fd/V4/order.plan.billday', params)
        const list = data.list || []
        const bill_day_map = data.bill_day_map || {}
        list.forEach(item => {
          item.status_text = bill_day_map.status && bill_day_map.status[item.status] || '--'
          item.financial_confirm_status = this.financial_confirm_status[item.financial_confirm_status] || '--'
        })
        this.billday = list
      } catch (error) {
        return
      }
    }
  }
}

function column() {
  return {
    plan: [
      { label: '订单ID', props: 'id' },
      { label: '套餐类型', props: 'buy_type' },
      { label: '订单目的', props: 'order_type' },
      { label: '订单状态', props: 'status' },
      { label: '应付金额', props: 'pay_price' },
      { label: '实付金额', props: 'pay_off_price' },
      { label: '创建时间', props: 'created_at' },
      { label: '支付时间', props: 'pay_time' }
    ],
    billday: [
      { label: '账单ID', props: 'id' },
      { label: '账单金额', props: 'pay_price' },
      { label: '账期', props: 'period_format' },
      { label: '财务确认状态', props: 'financial_confirm_status' },
      { label: '账单态', props: 'status_text' }
    ]
  }
}

function findCnd(val = '') {
  return ['YD-JS999G-CDN', 'JS999GCDN'].includes(val)
}
</script>
