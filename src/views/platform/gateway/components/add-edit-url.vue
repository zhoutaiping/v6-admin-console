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
      title-label="URL"
      width="600px"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="URL"
          prop="url"
        >
          <el-input
            v-model="form.url"
            :rows="2"
            type="textarea"
            class="input-box"
          />
        </el-form-item>
        <el-form-item
          label="分类"
          prop="type"
        >
          <DmSelect
            v-model="type"
            :selects="[]"
            class="input-box"
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
        url: '',
        type: '',
        remark: ''
      },
      rules: {
        url: [{ required: true, message: ' ' }],
        type: [{ required: true, message: ' ' }],
        remark: []
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

    async fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          //
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
