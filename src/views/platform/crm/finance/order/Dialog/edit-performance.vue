
<template>
  <div>
    <DmDialog
      ref="dmdialog"
      :fetch-submit="fetchSubmit"
      title="业绩编辑编辑"
      width="600px"
      @submit="handleSubmit"
    >
      <DmAlert>
        <p>业绩比例: 可销售佣金比例大小 0 ~ 100</p>
        <p>业绩开始时间:默认订单开始时间，可根据实际生效时间调整</p>
      </DmAlert>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="订单ID" class="item-box">
          {{ data.id }}
        </el-form-item>
        <el-form-item label="销售" class="item-box">
          {{ sale }}
        </el-form-item>
        <el-form-item label="业绩比例" prop="sales_performance" class="item-box">
          <el-input-number v-model="form.sales_performance" :max="100" :min="0" placeholder="" class="input-box"/> %
        </el-form-item>
        <el-form-item label="业绩开始时间" prop="performance_start_time" class="item-box">
          <el-date-picker
            v-model="form.performance_start_time"
            :default-value="new Date()"
            type="datetime"
            placeholder="创建开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="input-box"
          />
        </el-form-item>
      </el-form>
    </DmDialog>
  </div>
</template>
<script>
import createDialog from '@/utils/createDialog'
export default createDialog({
  data() {
    return {
      form: {
        order_code: '',
        sales_performance: 0,
        performance_start_time: ''
      },
      rules: {
        order_code: [],
        sales_performance: [
          { required: true, message: ' ' }
        ],
        performance_start_time: [
          { required: true, message: ' ' }
        ]
      },
      data: {},
      sale: ''
    }
  },
  methods: {
    handleOpen(data, sale = '') {
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        this.sale = sale
        this.data = Object.assign({}, JSON.parse(JSON.stringify(data)))
        if (this.$refs.form) this.$refs.form.resetFields()
        this.$set(this.form, 'order_code', data.order_code)
        this.$set(this.form, 'sales_performance', data.sales_performance ? Number(data.sales_performance) * 100 : 0)
        this.$set(this.form, 'performance_start_time', data.performance_start_time || '')
      })
    },

    async fetchSubmit(fromName = 'form') {
      const data = {
        ...this.form
      }
      data.sales_performance = data.sales_performance !== 0 ? data.sales_performance / 100 : 0
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          this.InvokeAllApi.post('/fd/V4/order.performance.edit', data).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('on-success')
            this.$refs.dmdialog.handleClose()
          }).catch(e => {
            this.$refs.dmdialog.afterValidate()
          })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    },

    async handleSubmit(form) {

    }
  }
})
</script>
<style lang="scss" scoped>
.item-box {
  margin-bottom: 5px;
}
.input-box {
  width: 400px;
}
</style>
