<style lang="scss" scoped>
.input-box {
  width: 300px;
}
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <div>
    <dm-dialog
      ref="dialog"
      :fetch-submit="fetchSubmit"
      :mode="mode"
      title-label="消息模板"
      width="500px"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="消息类型"
          prop="name"
          class="item-box"
        >
          <el-input
            v-model="form.name"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="消息标识"
          prop="flag"
          class="item-box"
        >
          <el-input
            v-model="form.flag"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="告警类型"
          prop="type"
          class="item-box"
        >
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="1">邮件</el-checkbox>
            <el-checkbox label="2">短信</el-checkbox>
            <el-checkbox label="3">站内信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </dm-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mode: 'Create',
      form: {
        name: '',
        flag: '',
        type: []
      },
      rules: {
        name: [{ required: true, message: ' ' }],
        flag: [{ required: true, message: ' ' }],
        type: []
      }
    }
  },
  methods: {
    handleOpen(data, option = 'Create') {
      this.mode = option
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }

        if (option === 'Edit') {
          this.form = Object.assign({}, data)
        }
      })
    },

    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          // this.Fetch.post(api, data).then(res => {
          //   this.Message('ACTION_SUCCESS')
          //   this.$emit('init')
          //   this.$refs.dialog.handleClose()
          // }).catch(e => {
          //   this.$refs.dialog.afterValidate()
          // })
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
