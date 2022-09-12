<style lang="scss" scoped>
.input-box {
  width: 400px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="新增调度组"
    width="600px"
  >
    <div>
      <DmAlert>
        新增调度组
      </DmAlert>
      <el-form ref="Form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="调度组名称" prop="name">
          <el-input v-model="form.name" class="input-box" />
        </el-form-item>
        <el-form-item label="用户ID" prop="member_id">
          <el-input v-model="form.member_id" class="input-box" />
        </el-form-item>
        <el-form-item label="服务类型" prop="service_type">
          <DmSelect
            v-model="form.service_type"
            :selects="options.service_type"
            class="input-box"
            placeholder=" "
          />
        </el-form-item>
        <el-form-item label="到期时间" prop="expire_time">
          <el-date-picker
            v-model="form.expire_time"
            class="input-box"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder=" "/>
        </el-form-item>
      </el-form>
    </div>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      form: {
        name: '',
        member_id: '1079',
        service_type: '',
        expire_time: ''
      },
      rules: {
        name: [{ required: true, message: ' ' }],
        member_id: [{ required: true, message: ' ' }],
        service_type: [{ required: true, message: ' ' }],
        expire_time: [{ required: true, message: ' ' }]
      },
      options: {
        service_type: [
          { label: '免费服务', value: 'fee' },
          { label: '付费服务', value: 'nofee' }
        ]
      }
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
      })
    },

    handleSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.Fetch.post('/fd/V4/disp.group.add', { ...this.form }).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$refs.Dialog.afterValidate()
            this.$refs.Dialog.handleClose()
            this.$emit('init')
          }).catch(e => {
            this.$refs.Dialog.afterValidate()
          })
        } else {
          this.$refs.Dialog.afterValidate()
          return false
        }
      })
    }
  }
}
</script>
