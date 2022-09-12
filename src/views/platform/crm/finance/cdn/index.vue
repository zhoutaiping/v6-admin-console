<style lang="scss" scoped>
  .app-center-finance-cdn-index{
    padding: 10px;
    .input-box{
      width: 180px;
      margin: 0 2px 5px;
    }
    .dm-footer{
      float: left !important;
      margin: 10px 0;
    }
    .row-btn {
      margin: 0 2px;
    }
  }
</style>

<template>
  <div class="app-center-finance-cdn-index">
    <DmToolbar>
      <InputSearch
        v-model="bindParams.email"
        placeholder="邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <el-date-picker
        v-model="bindParams.cdn_date"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyyMMdd"
        clearable
        placeholder="选择账期"
        class="input-box"
        @change="$refs.DmData.initPage()"/>

      <el-select
        v-show="activeName === 'bill-month'"
        v-model="bindParams.sale_user_ids"
        filterable
        multiple
        collapse-tags
        placeholder="所属销售"
        clearable
        class="input-box"
        @change="$refs.DmData.initPage()">
        <el-option-group
          v-for="(group, g_index) in SALES"
          :key="g_index"
          :label="group.role_name">
          <el-option
            v-for="item in group.children"
            :disabled="!item.label || item.status !=='1'"
            :key="item.user_id"
            :label="item.label"
            :value="item.user_id"/>
        </el-option-group>
      </el-select>
      <el-select v-model="bindParams.status" clearable placeholder="全部账单状态" class="input-box" @change="$refs.DmData.initPage()">
        <el-option v-for="(item,index) in status_option" :key="index" :label="item.label" :value="item.value"/>
      </el-select>
      <el-button :loading="loading" type="primary" icon="el-icon-search" class="row-btn" @click="$refs.DmData.initPage()">搜 索</el-button>
      <el-button v-if="activeName === 'bill-day'" :disabled="loading" type="primary" icon="el-icon-setting" class="row-btn" @click="handleResetBill">批量调整日账单</el-button>
    </DmToolbar>
    <el-card :body-style="{padding:'5px'}" shadow="never">
      <el-tabs v-model="activeName" type="card" class="tab-box" @tab-click="changeTab">
        <el-tab-pane label="日账单" name="bill-day"/>
        <el-tab-pane label="月账单" name="bill-month"/>
      </el-tabs>
      <DmData ref="DmData" @init="fetchList" >
        <BillDay v-loading="loading" v-show="activeName === 'bill-day'" ref="billDayTab" :list="list" @handleRowClick="handleRowClick"/>
        <BillMonth v-loading="loading" v-show="activeName === 'bill-month'" :list="list" @handleRowClick="handleRowClick"/>
      </DmData>
    </el-card>
    <DialogInfo ref="dialogInfo" @handleload="$refs.DmData.initPage()"/>
    <DialogEdit ref="dialogEdit" @handleload="$refs.DmData.initPage()"/>
    <DialogMonthInfo ref="dialogMonthInfo" @handleload="$refs.DmData.initPage()"/>
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import * as FORM from './form'
import * as Utils from '@/utils/index'
import DialogInfo from './components/DialogInfo'
import DialogEdit from './components/DialogEdit'
import DialogMonthInfo from './components/DialogMonthInfo'
import BillDay from './bill-day'
import BillMonth from './bill-month'
const bindParams = { cdn_date: '', email: '', status: '', sale_user_ids: [] }
export default {
  components: { DialogInfo, DialogEdit, BillDay, BillMonth, DialogMonthInfo },
  mixins: [consoleData],
  data() {
    return {
      API_METHOD: 'post',
      bindParams: Utils.deepClone(bindParams),
      activeName: 'bill-day',
      SALES: [],
      STATUS_DAY: FORM.STATUS_DAY,
      STATUS_MONTH: FORM.STATUS_MONTH,
      tabPanels: {
        items: [
          { key: 'bill-day', title: '日账单' },
          { key: 'bill-month', title: '月账单' }
        ]
      }
    }
  },
  computed: {
    API_INDEX() {
      if (this.activeName === 'bill-day') return '/fd/V4/order.cdn.billdaylist'
      if (this.activeName === 'bill-month') return '/fd/V4/order.billmonthlist'
    },
    status_option() {
      if (this.activeName === 'bill-day') return FORM.STATUS_DAY
      if (this.activeName === 'bill-month') return FORM.STATUS_MONTH
    }
  },
  async created() {
    this.getSaleList()
  },
  methods: {
    changeTab() {
      this.bindParams = Utils.deepClone(bindParams)
      this.$refs.DmData.initPage()
    },
    handleRowClick(data, type) {
      const rowData = JSON.parse(JSON.stringify(data))
      switch (type) {
        case 'info':
          this.$refs.dialogInfo.handleOpen(rowData, this.activeName)
          break
        case 'month-info' :
          this.$refs.dialogMonthInfo.handleOpen(rowData)
          break
        case 'edit':
          this.$refs.dialogEdit.handleOpen(rowData)
          break
      }
    },
    async getSaleList() {
      this.SALES = []
      await this.InvokeAllApi.get('/fd/V4/customer.manage.getbasicconf', {}).then(res => {
        const role = Utils.deepClone(res.role_list)
        const user = Utils.deepClone(res.user_list)
        const SALES = this.group(role, user)
        this.SALES = SALES
      })
    },

    group(role, user) {
      const newRole = role.filter(i => i.role_flag !== 'CRM_ADMIN') || []
      const newUser = user || []
      if (!newRole.length) {
        return []
      }
      newRole.forEach(r => {
        r.label = r.role_name || r.id || '--'
        r.value = r.id
        r.children = []
        newUser.forEach(u => {
          if (u.role_id === r.id) {
            u.label = u.name || u.user_id || '--'
            u.value = u.user_id || ''
            u.disabled = !u.name
            r.children.push(u)
          }
        })
      })
      return newRole
    },

    handleResetBill() {
      let select = []
      if (this.activeName === 'bill-day') select = this.$refs.billDayTab.select
      if (!select.length) {
        this.message.warning('请选择要调整的账单')
        return
      }
      const day_bill_ids = select.map(i => { return i.id }) || []
      this.InvokeAllApi.post('/fd/V4/order.adjustmentdaybill', { day_bill_ids: day_bill_ids }).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      })
    }
  }
}
</script>
