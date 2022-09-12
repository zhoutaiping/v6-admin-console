<style lang="scss" scoped>
.input-box {
  width: 165px;
  margin-bottom: 5px;
}
.time-box {
  width: 340px;
  margin-bottom: 5px;
}
.op-btn {
  margin: 0 2px;
}
</style>
<template>
  <console-page-layout>
    <DmData
      ref="DmData"
      :inner-card="false"
      @init="fetchList"
    >
      <DmToolbar>
        <InputSearch
          v-model="bindParams.order_id"
          placeholder="订单ID"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="用户邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.buy_type"
          :selects="BUYTYPE"
          placeholder="订单类型"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.order_type"
          :selects="ORDER_TYPE"
          placeholder="订单目的"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.invoice_product_name"
          :selects="product_map"
          placeholder="开票名称"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <br>
        <el-cascader
          ref="meal_select"
          :options="MealAll"
          class="input-box"
          expand-trigger="click"
          placeholder="套餐"
          change-on-select
          clearable
          @change="e =>{
            bindParams.product_flag = ''
            bindParams.meal_flag = ''
            if(e) {
              bindParams.product_flag = e && e[0] && e[0]|| ''
              bindParams.meal_flag = e && e[1] && e[1] || ''
            }
            $refs.DmData.initPage()
          }"
        />
        <DmSelect
          v-model="bindParams.invoice_lock"
          :selects="invoice_lock"
          placeholder="锁定状态"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <el-date-picker
          v-model="pay_at"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="-"
          start-placeholder="支付开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="time-box"
          @change="e =>{
            bindParams.pay_start_tim = e && e[0] && e[0] || ''
            bindParams.pay_end_time = e && e[1] && e[1] || ''
            $refs.DmData.initPage()
          }"
        />
        <el-button
          type="primary"
          @click="$refs.DmData.initPage()"
        >搜 索</el-button>
      </DmToolbar>
      <ApplyTab
        :loading="loading"
        :list="unrequest"
        :users="responseData.users"
        :product-list="productList"
        :product_map="responseData.invoice_product_name_map"
        @handleload="$refs.DmData.initPage()"
        @handleApply="handleApply"
      />
      <DialogApplySave
        ref="dialogApplySave"
        :product-list="productList"
        @handleload="$refs.DmData.initPage()"
      />
    </DmData>
  </console-page-layout>
</template>
<script>

import * as FORM from './from'
import * as Utils from '@/utils/index'
import ApplyTab from './apply/index'
import DialogApplySave from './components/dialog-apply-save'
import consoleData from '@/mixins/consoleData'
import defaultSetting from '@/core/defaultSetting'
export default {
  components: { ApplyTab, DialogApplySave },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/invoice.unrequest',
      bindParams: {
        order_id: '',
        email: '',
        buy_type: '',
        order_type: '',
        product_flag: '',
        meal_flag: '',
        pay_start_time: '',
        pay_end_time: '',
        invoice_lock: '',
        invoice_product_name: ''
      },
      pay_at: '',
      MealAll: [],
      SALES: [],
      productList: [],
      BUYTYPE: FORM.BUYTYPE, // 订单类型
      ORDER_TYPE: FORM.ORDER_TYPE,
      invoice_lock: [
        { label: '锁定', value: '1' },
        { label: '未锁定', value: '2' }
      ],
      INVOICE_TYPE: [
        { label: '全部发票类型', value: '' },
        { label: '增值税普通发票', value: '1' },
        { label: '增值税专用发票', value: '2' }
      ]
    }
  },

  computed: {
    unrequest() {
      const list = Utils.deepClone(this.list)
      list.forEach(item => {
        if (item.sale_user_ids !== '') {
          const SaleText = this.getSaleText(item.sale_user_ids, this.responseData.users)
          item.SaleText = SaleText || '--'
        }
      })
      return list
    },
    product_map() {
      const product_map = this.responseData.invoice_product_name_map || {}
      let list = []
      if (Object.keys(product_map).length) {
        list = Object.keys(product_map).map(i => product_map[i])
        list = [...new Set(list)]
        list = list.map(i => { return { label: i, value: i } })
      }
      return list
    }
  },

  mounted() {
    this.getMealList()
  },

  methods: {
    getSaleText(sale_user_ids, users) {
      const sales = sale_user_ids.split(',')
      let sales_text = ''
      if (!sales.length) return sales_text
      sales.forEach((element, index) => {
        const user = users[Number(element)]
        if (index === 0) {
          sales_text = user ? user.nickname || '' : ''
        } else {
          sales_text = user ? (user.nickname + ',' + sales_text) : sales_text
        }
      })
      return sales_text
    },

    async getMealList() {
      this.MealAll = []
      this.productList = []
      await this.Fetch.post('/V4/product.meal.list', { page: 1, per_page: 9999 }).then(res => {
        const list = res.data
        this.productList = list
        this.MealAll = defaultSetting.getProductGroup(list)
      })
    },

    async getSaleList() {
      this.SALES = []
      await this.InvokeAllApi.get('/fd/V4/customer.manage.getbasicconf', {}).then(res => {
        const role = Utils.deepClone(res.role_list)
        const user = Utils.deepClone(res.user_list)
        this.SALES = this.group(role, user)
      })
    },

    group(role, user) {
      const newRole = role || []
      const newUser = user || []
      if (!newRole.length) return []
      newRole.forEach(r => {
        r.label = r.role_name || r.id || '--'
        r.value = r.id
        r.children = []
        newUser.forEach(u => {
          if (u.role_id === r.id) {
            u.label = u.name || u.user_id || '--'
            u.value = u.user_id
            r.children.push(u)
          }
        })
      })
      return newRole
    },

    handleApply(list, type) {
      if (type === 'open' || 'pay') {
        this.$refs.dialogApplySave.handleOpen(list, type)
      }
    }
  }
}
</script>

