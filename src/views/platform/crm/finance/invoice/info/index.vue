<style lang="scss" scoped>
.search-form-input {
  width: 200px;
  margin: 0 2px;
}
</style>
<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <el-button type="primary" @click="handleClick('add')">新 增</el-button>
        <div slot="right">
          <InputSearch
            v-model="search.email"
            placeholder="关键字"
            class="search-form-input"
            @submit="$refs.dmData.initPage()"
          />
        </div>
      </DmToolbar>
    </div>
    <DmData ref="dmData" :params="params" :inner-card="false" @init="init">
      <DmTable :loading="loading" class="m-top" >
        <el-table :data="list">
          <el-table-column label="ID" prop="id" width="100px" fixed="left"/>
          <el-table-column label="客户邮箱" prop="email" show-overflow-tooltip/>
          <el-table-column label="发票抬头" prop="invoice_title" show-overflow-tooltip/>
          <el-table-column label="税务登记号" prop="company_taxer_code" show-overflow-tooltip/>
          <el-table-column label="操作" width="200px" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleClick('info',scope.row)">详情</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text" @click="handleClick('edit',scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <dialog-invoice-info ref="dialogInvoiceInfo" @handleload="$refs.dmData.initPage()"/>
  </console-page-layout>
</template>
<script>
import DialogInvoiceInfo from './components/dialog-invoice-info'
import InvoiceResource from '@/api/finance/invoiceApi'
export default {
  components: { DialogInvoiceInfo },
  data() {
    return {
      loading: false,
      list: [],
      params: {},
      search: { email: '' }
    }
  },
  mounted() { },
  methods: {
    async init(params = this.$refs.dmData.getParams()) {
      const data = { ...params }
      if (this.search.email)data.email = this.search.email
      this.loading = true
      await InvoiceResource.getInvoicMemberList(data).then(res => {
        this.list = res.list
        this.loading = false
        this.$refs.dmData.init({ total: parseInt(res.total, 10) })
      }).catch(e => {
        this.list = []
        this.$refs.dmData.init({ total: 0 })
        this.loading = false
      })
    },

    handleClick(type, data) {
      switch (type) {
        case 'info':
          this.$refs.dialogInvoiceInfo.handleOpen(type, data)
          break
        case 'edit':
          this.$refs.dialogInvoiceInfo.handleOpen(type, data)
          break
        case 'add':
          this.$refs.dialogInvoiceInfo.handleOpen(type, {})
          break
      }
    }
  }
}
</script>
