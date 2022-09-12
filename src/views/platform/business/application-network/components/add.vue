<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="handleSubmit"
    title="新增规则集"
    width="500px"
  >
    <DmAlert>
      新增加的策略集默认排序最靠前
    </DmAlert>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        label="规则集名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="请输入规则集名称"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          :rows="2"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>
<script>
export default {
  name: 'Add',
  data() {
    return {
      form: {
        name: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: ' ' }],
        remark: [{ required: true, message: ' ' }]
      }
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.Dialog.handleOpen()
        this.$refs.Form && this.$refs.Form.resetFields()
      })
    },

    handleSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.Fetch.post('/fd/V4/firewall.policyGroup.tpl.add', { ...this.form }).then(res => {
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
