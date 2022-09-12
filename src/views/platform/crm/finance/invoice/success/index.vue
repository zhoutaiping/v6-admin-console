<style lang="postcss" scoped>
.top-button {
  margin: 10px 0 5px 10px;
}
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
          width="120px"
        />
        <el-table-column
          label="发票号"
          width="250px"
        >
          <template slot-scope="scope">
            {{ scope.row.invoice_taxcode }}
          </template>
        </el-table-column>
        <el-table-column
          label="发票类型"
          width="120px"
        >
          <template slot-scope="scope">
            {{ INVOICE_TYPE[Number(scope.row.invoice_type)] }}
          </template>
        </el-table-column>
        <el-table-column
          label="开具时间"
          prop="express_time"
          width="160"
        />
        <el-table-column
          label="开具产品名称"
          min-width="250"
        >
          <template slot-scope="scope">
            {{ scope.row.invoice_product_name }}
          </template>
        </el-table-column>
        <el-table-column
          label="关联订单ID"
          prop="order_ids"
          width="250px"
        />
        <el-table-column
          label="开票邮箱"
          prop="email"
          width="180px"
        />
        <el-table-column
          label="所属销售"
          prop="meal"
          width="200"
        >
          <template slot-scope="scope">
            {{ getSalesName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="开票金额"
          prop="invoice_amount"
          width="100px"
        />
        <el-table-column
          label="申请时间"
          prop="invoice_time"
          width="160"
        />
        <el-table-column
          label="状态"
          prop="status"
          width="120px"
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
          width="200px"
          fixed="right"
        >
          <template slot-scope="scope">
            <a
              class="color--primary"
              @click="$refs.dialogInvoiceDetail.handleOpen(scope.row)"
            >详 情</a>
            <!-- <el-divider direction="vertical" />
            <a
              class="color--primary"
              @click="$refs.dialogInvoiceReview.handleOpen(scope.row)"
            >审 核</a> -->
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
    <dialog-invoice-detail
      ref="dialogInvoiceDetail"
      @handleload="$emit('handleload')"
    />
    <dialog-invoice-review
      ref="dialogInvoiceReview"
      @handleload="$emit('handleload')"
    />
  </el-card>
</template>

<script>
import DialogInvoiceDetail from '../components/dialog-invoice-detail'
import DialogInvoiceReview from '../components/dialog-invoice-review'
export default {
  components: { DialogInvoiceDetail, DialogInvoiceReview },
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

    handleSelectionChange(val) {
      this.rowSelect = val
    }
  }
}
</script>
