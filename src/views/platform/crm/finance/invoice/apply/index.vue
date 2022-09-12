<template>
  <el-card
    :body-style="{ padding: '5px' }"
    shadow="never"
  >
    <DmAlert>
      <i class="el-icon-info color--primary" />
      已选择：{{ rowSelect.length }}
      <div>
        可复选框选中多条数据进行，【申请发票】、【订单锁定】操作
      </div>
      <div>
        订单锁定状态下无法进行，【申请发票】操作
      </div>
    </DmAlert>
    <el-button
      :disabled="rowSelect.length === 0 || lock"
      type="primary"
      class="top-button"
      style="margin-bottom: 5px;"
      @click="handleApply('open')"
    >申请发票</el-button>
    <el-button
      :disabled="rowSelect.length === 0"
      type="primary"
      @click="$refs.lock.handleOpen(rowSelect)"
    >编辑锁定</el-button>
    <DmTable :loading="loading">
      <el-table
        :data="list"
        @selection-change="e =>{rowSelect = e}"
      >
        <el-table-column
          type="selection"
          fixed="left"
        />
        <el-table-column
          v-for="(item, index) in column"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            {{ formartValue(scope.row, item.prop) }}
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
    <Lock
      ref="lock"
      @init="$emit('handleload')"
    />
  </el-card>
</template>

<script>
import Lock from './lock'
export default {
  components: { Lock },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    product_map: {
      type: Object,
      default: () => {}
    },
    productList: {
      type: Array,
      default: () => []
    },
    users: { type: [Object, Array], default: () => { } },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      rowSelect: [],
      BUYTYPE_TEXT: { 0: '购买', 1: '升级', 2: '续费', 3: '降级', 4: '扩容', 5: '增值', 6: '退订' },
      ORDER_TYPE_TEXT: { 'normal': '正式', 'user_test': '测试', 'user_refund': '试用' },
      STATUS_TEXT: { '0': '未支付', '1': '已支付', '2': '已取消', '3': '已过期', '4': '待回款', '5': '待退款', '6': '已回款', '-1': '删除' },
      INVOICE_TYPE: { 1: '增值税普通发票', 2: '增值税专用发票' },
      PAYTYPE: {
        0: '默认', 1: '现金', 2: '银行转账 ', 3: '余额', 4: '微信', 5: '支付宝', 6: '欠款支付'
      },
      CREATED_TYPE: { 1: '自动', 2: '财务' },
      invoice_lock: [
        { label: '锁定', value: '1' },
        { label: '未锁定', value: '2' }
      ],
      channel_end_relation: {
        '-1': '无',
        '1': '代理',
        '2': '代销'
      },
      column: [
        { label: '订单ID', prop: 'id', width: 100 },
        { label: '订单套餐', prop: 'meal_flag', width: 250 },
        { label: '用户邮箱', prop: 'email', width: 200 },
        // { label: '代理商邮箱', prop: 'agent_member_email', width: 200 },
        { label: '渠道邮箱', prop: 'channel_member_email', width: 200 },
        { label: '渠道关联类型', prop: 'channel_end_relation', width: 120 },
        { label: '销售', prop: 'SaleText', width: 200 },
        { label: '订单类型', prop: 'buy_type', width: '' },
        { label: '订单状态', prop: 'status', width: '' },
        // { label: '支付方式', prop: 'pay_type', width: '' },
        // { label: '支付时间', prop: 'pay_time', width: 160 },
        { label: '应付金额', prop: 'pay_price', width: 150 },
        { label: '实付金额', prop: 'pay_off_price', width: 150 },
        { label: '已开票金额', prop: 'invoice_finish_price', width: 150 },
        { label: '可申请开票金额', prop: 'invoice_unopen_price', width: 150 },
        { label: '开票申请中金额', prop: 'invoice_request_price', width: 150 },
        { label: '开票产品名称', prop: 'invoice_product_name', width: 150 },
        { label: '锁定状态', prop: 'invoice_lock', width: 110 }
      ]
    }
  },
  computed: {
    lock() {
      let val = false
      const lockCount = this.rowSelect.length ? this.rowSelect.filter(i => Number(i.invoice_lock) === 1) : 0
      if (lockCount > 0) {
        val = true
      }

      return val
    }
  },
  methods: {
    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'meal_flag') {
        val = this.getProductAndMealName(val, 'meal')
      } else if (prop === 'buy_type') {
        val = this.BUYTYPE_TEXT[val]
      } else if (prop === 'pay_type') {
        val = this.PAYTYPE[val]
      } else if (prop === 'status') {
        val = this.STATUS_TEXT[val]
      } else if (prop === 'invoice_lock') {
        const find = this.invoice_lock.find(i => { return Number(i.value) === Number(val) })
        val = find ? find.label : ''
      } else if (prop === 'channel_end_relation') {
        val = this.channel_end_relation[val]
      } else if (prop === 'invoice_product_name') {
        val = this.product_map[data.product_flag] || ''
      }
      return val
    },

    handleApply(type) {
      if (!this.rowSelect.length) {
        this.message.warning('请选择订单')
        return
      }
      let order_codes = ''
      this.rowSelect.forEach((select, index) => {
        if (index === 0) {
          order_codes = select.order_code
        } else {
          order_codes = select.order_code + ',' + order_codes
        }
      })
      this.$emit('handleApply', order_codes, type)
    },

    getProductAndMealName(flag, type) {
      let name = ''
      this.productList.forEach(pro => {
        if (pro.meal_flag === flag) name = type !== 'product' ? pro.product_name + '【' + pro.meal_name + '】' : pro.product_name
      })
      return name
    }
  }
}
</script>
