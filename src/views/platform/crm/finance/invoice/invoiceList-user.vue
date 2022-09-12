<style lang="scss" scoped>
.app-container-finance-invoice-list{
  padding: 10px;
  .input-box {
    width: 200px;
    margin: 0 3px 5px;
  }
  .search-form-time {
    width: 301px;
    margin: 0 3px 5px;
  }
  .op-btn {
    margin: 0 2px;
  }
}
</style>
<template>
  <div class="app-container-finance-invoice-list">
    <DmData ref="DmData" :inner-card="false" @init="fetchList">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.invoice_id"
          placeholder="发票ID"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.invoice_taxcode"
          placeholder="发票号"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="所属用户"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.invoice_type"
          :selects="INVOICE_TYPE"
          placeholder="发票类型"
          class="search-input"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.status"
          :selects="status"
          placeholder="状态"
          class="search-input"
          @change="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.invoice_product_name"
          placeholder="开票产品名称"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <br>
        <InputSearch
          v-model="bindParams.order_id"
          placeholder="订单ID"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <el-date-picker
          v-model="invoice_at"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="-"
          class="search-form-time"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开具开始日期"
          end-placeholder="结束日期"
          @change="changeTime('invoice_at')"
        />
        <el-date-picker
          v-model="create_at"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="-"
          class="search-form-time"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="申请开始日期"
          end-placeholder="结束日期"
          @change="changeTime('create_at')"
        />
        <el-button type="primary" class="op-btn" @click="$refs.DmData.initPage()">搜 索</el-button>
      </DmToolbar>
      <UserTab v-loading="loading" :list="userList" @handleload="$refs.DmData.initPage()"/>
      <DialogApplySave ref="dialogApplySave" @handleload="$refs.DmData.initPage()"/>
    </DmData>
  </div>
</template>

<script>

import UserTab from './user/index'
import DisposeTab from './dispose/index'
import SuccessTab from './success/index'
import DialogApplySave from './components/dialog-apply-save'
import consoleData from '@/mixins/consoleData'
// import InvoiceResource from '@/api/finance/invoiceApi'
export default {
  components: { UserTab, DisposeTab, SuccessTab, DialogApplySave },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/invoice.list',
      invoice_at: '',
      create_at: '',
      bindParams: {
        invoice_id: '',
        order_id: '',
        invoice_taxcode: '',
        invoice_type: '',
        email: '',
        create_start_time: '',
        create_end_time: '',
        invoice_start_time: '',
        invoice_end_time: '',
        invoice_product_name: '',
        status: ''
      },
      loading: false,
      INVOICE_TYPE: [{ label: '增值税普通发票', value: '1' }, { label: '增值税专用发票', value: '2' }],
      status: []
    }
  },
  computed: {
    userList() {
      return this.list
    }
  },
  watch: {
    responseData: {
      deep: true,
      handler(val) {
        this.status = Object.keys(val.status_map).map(i => { return { label: val.status_map[i], value: i } })
      }
    }
  },
  methods: {
    changeTime(type, value) {
      if (type === 'invoice_at') {
        this.bindParams.invoice_start_time = this[type] ? this[type][0] || '' : ''
        this.bindParams.invoice_end_time = this[type] ? this[type][1] || '' : ''
      } else {
        this.bindParams.create_start_time = this[type] ? this[type][0] || '' : ''
        this.bindParams.create_end_time = this[type] ? this[type][1] || '' : ''
      }
      this.$refs.DmData.initPage()
    },
    handleload(type) {
      this.$refs.DmData.initPage()
    },
    handleApply(list) {
      const select = list
      this.$refs.dialogApplySave.handleOpen(select)
    }
  }
}
</script>

