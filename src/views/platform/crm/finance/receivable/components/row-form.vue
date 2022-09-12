<style lang="postcss" scoped>
.row-center-info {
  width: 90%;
  /* border: 0.5px solid $--color-primary; */
  padding: 10px;
  .row-info-form {
    .row-info-form-item {
      display: inline-block;
      /* border: 1px solid; */
      margin-bottom: 10px;
      width: 300px;
    }
    .row-info-form-input {
    }
  }
}
</style>

<template>
  <div class="row-center-info">
    <el-form
      :model="rowData"
      size="mini"
      label-width="90px"
      label-position="left"
      class="row-info-form"
    >
      <el-form-item
        label="应收账单ID:"
        class="row-info-form-item"
      >
        {{ rowData.id || '--' }}
      </el-form-item>
      <el-form-item
        label="源单ID:"
        class="row-info-form-item"
      >
        {{ rowData.order_id || '--' }}
      </el-form-item><br>
      <el-form-item
        label="账单类型:"
        class="row-info-form-item"
      >
        {{ TYPE_TEXT[Number(rowData.type)] || '--' }}
      </el-form-item>
      <el-form-item
        label="关联订单ID:"
        class="row-info-form-item"
      >
        {{ rowData.r_order_ids || '--' }}
      </el-form-item><br>
      <el-form-item
        label="客户邮箱:"
        class="row-info-form-item"
      >
        {{ rowData.email || '--' }}
      </el-form-item><br>
      <el-form-item
        label="客户名称:"
        class="row-info-form-item"
      >
        {{ rowData.email || '--' }}
      </el-form-item><br>
      <el-form-item
        label="所属销售:"
        class="row-info-form-item"
      >
        {{ getSaleText(rowData.sale_user_id) || '--' }}
      </el-form-item>
      <el-form-item
        label="账期:"
        class="row-info-form-item"
      >
        {{ rowData.period || '--' }}
      </el-form-item><br>
      <el-form-item
        label="备注:"
        class="row-info-form-item"
      >
        {{ rowData.remark || '--' }}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object, default: () => { }
    }
  },
  data() {
    return {
      TYPE_TEXT: { 1: '正常账单', 2: '红冲账单' }
    }
  },

  methods: {
    getSaleText(sale_user_id) {
      let sale_text = ''
      let sale = []
      const users = this.users
      if (JSON.stringify(users) === '[]' || JSON.stringify(users) === '{}') {
        return '--'
      }
      if (sale_user_id) {
        sale = sale_user_id.split(',')
      }
      if (sale.length > 0 && users) {
        if (sale.length === 1) {
          sale_text = users[sale[0]].nickname
        } else if (sale.length > 1) {
          sale.forEach((element, index) => {
            if (index === 0) {
              sale_text = users[element].nickname
            } else {
              sale_text = users[element].nickname + ',' + sale_text
            }
          })
        }
      } else {
        sale_text = '--'
      }
      return sale_text
    }
  }
}
</script>
