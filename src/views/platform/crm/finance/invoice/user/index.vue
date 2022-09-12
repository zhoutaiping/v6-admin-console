<template>
  <el-card :body-style="{ padding: '5px' }">
    <DmTable :loading="loading">
      <el-table :data="list">
        <el-table-column label="开票申请ID" prop="id" align="left" width="120px"/>
        <el-table-column label="发票号" align="left" width="250px">
          <template slot-scope="scope">
            {{ scope.row.invoice_taxcode }}
          </template>
        </el-table-column>
        <el-table-column label="发票抬头" prop="invoice_title" align="left" width="250px"/>
        <el-table-column label="发票类型" align="left" width="120px">
          <template slot-scope="scope">
            {{ INVOICE_TYPE[Number(scope.row.invoice_type)] }}
          </template>
        </el-table-column>
        <el-table-column label="开具时间" prop="invoice_time" align="left" width="180px"/>
        <el-table-column label="开票产品名称" prop="invoice_product_name" align="left" width="250"/>
        <el-table-column label="关联订单ID" prop="order_ids" align="left" width="250px"/>
        <el-table-column label="开票邮箱" prop="email" align="left" width="180px"/>
        <el-table-column label="所属销售" width="250px">
          <template slot-scope="scope">
            {{ getSalesName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="开票金额" prop="invoice_amount" align="left" width="120px"/>
        <el-table-column label="申请时间" prop="created_at" align="left" width="180px"/>
        <el-table-column label="状态" prop="status" align="left" width="120px" >
          <template slot-scope="scope">
            <i v-if="scope.row.status === '3'" class="succceed-dot"/>
            <i v-else-if="scope.row.status === '5'" class="fail-dot"/>
            <i v-else class="process-dot"/>
            <span>{{ STATUS[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <a class="color--primary" @click="handleClickRow(scope.row, 'info')">详 情</a>
            <el-divider direction="vertical"/>
            <a v-show="Number(scope.row.status) === 1" class="color--primary" @click="handleClickRow(scope.row, 'cancel')">撤回申请</a>
            <a v-show="Number(scope.row.status) === 3" class="color--primary" @click="handleClickRow(scope.row, 'refund')">退 票</a>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>

    <dialog-invoice-detail ref="dialogInvoiceDetail" @handleload="$emit('handleload')"/>
    <dialog-invoice-refund ref="dialogInvoiceRefund" @handleload="$emit('handleload')"/>
    <dialog-invoice-refund-comfirm ref="dialogInvoiceRefundComfirm" @handleload="$emit('handleload')"/>
  </el-card>
</template>

<script>

import DialogInvoiceDetail from '../components/dialog-invoice-detail'
import DialogInvoiceRefund from '../components/dialog-invoice-refund'
import DialogInvoiceRefundComfirm from '../components/dialog-invoice-refund-confirm'
import InvoiceResource from '@/api/finance/invoiceApi'

export default {
  components: { DialogInvoiceDetail, DialogInvoiceRefund, DialogInvoiceRefundComfirm },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      STATUS: { '-1': '删除', '0': '未处理', '1': '待审核', '2': '审核不通过', '3': '已开具', '4': '已撤回', '5': '待确认退票', '6': '已退票' },
      INVOICE_TYPE: { 1: '增值税普通发票', 2: '增值税专用发票' }
    }
  },
  methods: {
    getSalesName(data) {
      let name = ''
      const sale_users = data.sale_users
      Object.keys(sale_users).forEach(item => {
        if (sale_users[item]) name = sale_users[item] + ',' + name
      })
      return name
    },

    handleClickRow(data, type) {
      if (type === 'info') {
        this.$refs.dialogInvoiceDetail.handleOpen(JSON.parse(JSON.stringify(data)))
      } else if (type === 'cancel') {
        this.handleCancel(data)
      } else if (type === 'refund') {
        this.$refs.dialogInvoiceRefund.handleOpen(JSON.parse(JSON.stringify(data)))
      } else if (type === 'refund_review') {
        this.handleRefundReview(data)
      }
    },
    handleCancel(data) {
      this.$confirm('是否确认撤回申请 ', '撤回申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleRevoke(data)
      }).catch(e => { return true })
    },
    handleRevoke(data) {
      InvoiceResource.invoiceRevoke({ id: data.id }).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('handleload')
      }).catch(e => {
        this.$emit('handleload')
      })
    },

    handleRefundReview(data) {
      this.$confirm('此操作将进行退票操作, 是否继续?', '确认退票', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.dialogInvoiceRefundComfirm.handleOpen(data)
      }).catch(e => { return true })
    },

    RefundConfirm(data) {
      InvoiceResource.invoiceRefundConfirm({ id: data.id }).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('handleload')
      }).catch(e => {
        this.$emit('handleload')
      })
    }

  }
}
</script>
