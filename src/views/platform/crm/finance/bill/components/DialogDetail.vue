<style lang="postcss" scoped>
.DialogDetail{
  .dialog-bill-detail-form{
    padding-top: 10px;
    .dialog-bill-detail-form-item {
      display: inline-block;
      width: 275px;
      margin-bottom: 10px;
      /* border: 0.5px solid #cccccc; */
      .dialog-receivable-detail-form-input {
        width: 175px;
      }
    }
    .tab-order{
      margin-bottom: 10px;
      th {
        border-top: 1px solid rgb(223, 229, 236);
        background-color: $--color-primary;
        color: #FFFFFF;
        padding: 8px 0;
      }
    }
  }
}

</style>
<style lang="scss">
.el-table th {
    border-top: 1px solid rgb(223, 229, 236);
    background-color: $--color-primary;
    color: #FFFFFF;
    padding: 8px 0;

}
</style>

<template>
  <FDialog :close-on-click-modal="true" :title ="detailForm.title" :visible.sync="detailForm.visible" class="DialogDetail" aside>
    <DmScroll>
      <el-form ref="detailForm" :model="detailForm" label-position="left" label-width="90px" size="mini" class="dialog-bill-detail-form">
        <h3>概览信息</h3><hr>
        <el-form-item label="账单ID:" class="dialog-bill-detail-form-item">
          {{ detailForm.record.id || '--' }}
        </el-form-item>
        <el-form-item label="关联订单ID:" class="dialog-bill-detail-form-item">
          {{ detailForm.record.order_id || '--' }}
        </el-form-item>
        <el-form-item label="产品名称:" class="dialog-bill-detail-form-item">
          {{ detailForm.record.product_flag || '--' }}
        </el-form-item>
        <el-form-item label="套餐实例ID:" class="dialog-bill-detail-form-item">
          {{ detailForm.record.r_order_ids || '--' }}
        </el-form-item>
        <el-form-item label="客户邮箱:" class="dialog-bill-detail-form-item">
          {{ detailForm.record.email || '--' }}
        </el-form-item>
        <el-form-item label="套餐名称:" class="dialog-bill-detail-form-item">
          {{ detailForm.record.meal_flag|| '--' }}
        </el-form-item>
        <el-form-item label="计费期间:" class="dialog-bill-detail-form-item">
          {{ detailForm.record.period || '--' }}
        </el-form-item>
        <el-form-item label="计费类型:" class="dialog-bill-detail-form-item">
          {{ detailForm.record.email || '--' }}
        </el-form-item>
        <h3>账单详情</h3><hr>
        <el-form-item label-width="0px">
          <el-table :data="orderList" class="tab-order">
            <ElTableColumn label="计费时间"/>
            <ElTableColumn label="计费单价"/>
            <ElTableColumn label="消耗量"/>
            <ElTableColumn label="消耗金额（元）"/>
          </el-table>
        </el-form-item>

      </el-form>
    </DmScroll>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose">确 定</el-button>
    </div>
  </FDialog>
</template>

<script>
export default {
  data() {
    return {
      detailForm: {
        loading: false,
        visible: false,
        title: '账单详情',
        record: {}
      },
      orderList: []
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.$refs.detailForm && this.$refs.detailForm.resetFields()
        this.detailForm.visible = true
        this.detailForm.loading = true
        setTimeout(() => {
          this.detailForm.loading = false
        }, 500)
      })
    },
    handleClose() {
      this.DialogPayBack.visible = true
    }
  }
}
</script>
