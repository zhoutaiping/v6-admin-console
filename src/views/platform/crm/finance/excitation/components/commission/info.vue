<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :title="'详情'"
    :footer="false"
    width="700px"
    aside
  >
    <el-form
      :model="rowData"
      label-position="left"
      label-width="120px"
    >
      <DmCardPanel title="基本信息">
        <el-form-item
          label="订单Code"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.order_code"
            readonly
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="用户邮箱"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.member_email"
            readonly
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="渠道邮箱"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.channel_member_email"
            readonly
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="套餐名称"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.meal_flag"
            readonly
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="订单开始时间"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.order_created_at"
            readonly
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="应付金额"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.total_price"
            readonly
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="实付金额"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.pay_off_price"
            readonly
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="创建时间"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.created_at"
            readonly
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="完成回款时间"
          class="item-box"
          prop="name"
        >
          <el-input
            v-model="rowData.finish_payment_time"
            readonly
            class="input-box"
          />
        </el-form-item>
      </DmCardPanel>
      <DmCardPanel title="佣金发放信息">
        <el-form-item
          label="发放状态"
          prop="is_grant"
        >
          <DmSelect
            v-model="rowData.is_grant"
            :selects="option.is_grant"
            placeholder=" "
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="预计到账"
          prop="expected_arrival_time"
        >
          <el-date-picker
            v-model="rowData.expected_arrival_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            placeholder=" "
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="实际到账"
          prop="paid_arrival_time"
        >
          <el-date-picker
            v-model="rowData.paid_arrival_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            placeholder=" "
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="rowData.remark"
            type="textarea"
            class="input-box"
            placeholder="请输入备注"
          />
        </el-form-item>
      </DmCardPanel>
    </el-form>
  </DmDialog>
</template>

<script>
export default {
  data() {
    return {
      rowData: {},
      option: {
        is_grant: [
          { label: '发放', value: '1' },
          { label: '未发放', value: '2' }
        ],
        is_valid: [
          { label: '有效', value: '1' },
          { label: '失效', value: '2' }
        ]
      }
    }
  },
  methods: {
    handleOpen(data, option) {
      this.loading = true
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.rowData = Object.assign({}, data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-divider--horizontal {
  margin: 5px 0;
}
.item-box {
  margin-bottom: 5px;
}
</style>
