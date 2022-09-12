<style lang="postcss" scoped>
</style>

<template>
  <el-card
    :body-style="{ padding: '5px' }"
    shadow="never"
  >
    <DmTable>
      <el-table :data="list">
        <el-table-column
          label="开票申请ID"
          prop="id"
          align="left"
          width="120"
        />
        <el-table-column
          label="发票号"
          align="left"
        >
          <template slot-scope="scope">
            {{ scope.row.invoice_taxcode }}
          </template>
        </el-table-column>
        <el-table-column
          label="发票抬头"
          align="left"
          width="250"
        >
          <template slot-scope="scope">
            {{ scope.row.invoice_title }}
          </template>
        </el-table-column>
        <el-table-column
          label="发票类型"
          align="left"
          width="120"
        >
          <template slot-scope="scope">
            {{ INVOICE_TYPE[Number(scope.row.invoice_type)] }}
          </template>
        </el-table-column>
        <el-table-column
          label="开具时间"
          prop="invoice_time"
          align="left"
          width="160"
        />
        <el-table-column
          label="开票产品名称"
          align="left"
          width="250"
        >
          <template slot-scope="scope">
            {{ scope.row.invoice_product_name }}
          </template>
        </el-table-column>
        <el-table-column
          label="关联订单ID"
          prop="order_ids"
          align="left"
          width="250"
        />
        <el-table-column
          label="开票邮箱"
          prop="email"
          align="left"
          width="180"
        />
        <el-table-column
          label="所属销售"
          prop="meal"
          align="left"
          width="200"
        >
          <template slot-scope="scope">
            {{ getSalesName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="开票金额"
          prop="invoice_amount"
          align="left"
          width="100"
        />
        <el-table-column
          label="申请时间"
          prop="created_at"
          align="left"
          width="160"
        />
        <el-table-column
          label="状态"
          prop="status"
          align="left"
          width="120"
        >
          <template slot-scope="scope">
            <i
              v-if="scope.row.status === '3'"
              class="succceed-dot"
            />
            <i
              v-else-if="scope.row.status === '5'"
              class="fail-dot"
            />
            <i
              v-else
              class="process-dot"
            />
            <span>{{ STATUS[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          width="200px"
          fixed="right"
        >
          <template slot-scope="scope">
            <a
              class="color--primary"
              @click="handleClickRow(scope.row, 'info')"
            >详 情</a>
            <el-divider direction="vertical" />
            <a
              class="color--primary"
              @click="handleClickRow(scope.row, 'review')"
            >审 核</a>
            <template v-if="Number(scope.row.status) === 5">
              <el-divider direction="vertical" />
              <a
                class="color--primary"
                @click="handleClickRow(scope.row, 'refund')"
              >退 票</a>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
    <dialog-invoice-post
      ref="dialogInvoicePost"
      @handleload="$emit('handleload')"
    />
    <dialog-invoice-detail
      ref="dialogInvoiceDetail"
      @handleload="$emit('handleload')"
    />
    <dialog-invoice-review
      ref="dialogInvoiceReview"
      @handleload="$emit('handleload')"
    />
    <dialog-invoice-refund-comfirm
      ref="dialogInvoiceRefundComfirm"
      @handleload="$emit('handleload')"
    />
  </el-card>
</template>

<script>
import DialogInvoicePost from '../components/dialog-invoice-post'
import DialogInvoiceDetail from '../components/dialog-invoice-detail'
import DialogInvoiceReview from '../components/dialog-invoice-review'
import DialogInvoiceRefundComfirm from '../components/dialog-invoice-refund-confirm'
import InvoiceResource from '@/api/finance/invoiceApi'
export default {
  components: { DialogInvoicePost, DialogInvoiceDetail, DialogInvoiceReview, DialogInvoiceRefundComfirm },
  props: {
    list: {
      type: Array,
      default: () => []
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
        if (sale_users[item]) name = sale_users[item] + '  ' + name
      })
      return name
    },

    handleClickRow(data, type) {
      if (type === 'info') this.$refs.dialogInvoiceDetail.handleOpen(JSON.parse(JSON.stringify(data)))
      if (type === 'review') this.$refs.dialogInvoiceReview.handleOpen(JSON.parse(JSON.stringify(data)))
      if (type === 'refund') this.handleRefund(data)
      if (type === 'cancel') this.handleCancel(data)
    },
    handleCancel(data) {
      this.$confirm('是否确认撤回申请 ', '撤回申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.handleRevoke(data)
      }).catch(e => { return true })
    },

    handleRevoke(data) {
      InvoiceResource.invoiceRevoke({ id: data.id }).then(res => {
        this.Message('ACTION_SUCCESS')
        this.$emit('handleload')
      }).catch(e => { })
    },

    handleRefund(data) {
      this.$confirm('此操作将进行退票操作, 是否继续?', '确认退票', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.dialogInvoiceRefundComfirm.handleOpen(data)
      }).catch(e => { return true })
    },

    handleSuccess(data) {
      this.$confirm('是否确认已完成发票邮寄?', '确认完成', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Message('ACTION_SUCCESS')
      }).catch(e => { return true })
    }

  }
}
</script>
