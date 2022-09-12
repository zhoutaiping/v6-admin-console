
<template>
  <div>
    <DmDialog
      ref="dmdialog"
      :fetch-submit="fetchSubmit"
      title="编辑"
      width="500px"
      @submit="handleSubmit"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="套餐业绩开始时间" prop="performance_start_time">
          <el-date-picker
            v-model="form.performance_start_time"
            :default-value="new Date()"
            type="datetime"
            placeholder="创建开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
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
        plan_id: '',
        performance_start_time: ''
      },
      rules: {
        performance_start_time: [
          { required: true, message: '请选择时间', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.$refs.dmdialog.handleOpen()
        if (this.$refs.form) this.$refs.form.resetFields()
        this.$set(this.form, 'plan_id', data.id)
        this.$set(this.form, 'performance_start_time', data.performance_start_time || '')
      })
    },

    async fetchSubmit(fromName = 'form') {
      const form = {
        ...this.form
      }
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          this.InvokeAllApi.post('/V4/customer.plan.edit', form).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('fetchData')
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
