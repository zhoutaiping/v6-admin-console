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
      title-label="消息类型"
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
          prop="type"
          class="item-box"
        >
          <el-input
            v-model="form.type"
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
          label="属性"
          prop="desc"
          class="item-box"
        >
          <el-input
            v-model="form.desc"
            class="input-box"
          />
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
        type: '',
        flag: '',
        desc: ''
      },
      rules: {
        type: [{ required: true, message: ' ' }],
        flag: [{ required: true, message: ' ' }],
        desc: []
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
