<style lang="scss" scoped>
.input-box {
  width: 400px;
}
.input-box2 {
  width: 390px;
  margin-bottom: 5px;
}
.input-option {
  width: 150px;
}
.input-option2 {
  width: 50px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :mode="mode"
    :fetch-submit="fetchSubmit"
    width="600px"
    title-label="路由"
  >
    <DmScroll>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="模块名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="模块标识" prop="key">
          <el-input
            v-model="form.key"
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="分组名称" prop="module_group_title">
          <el-input
            v-model="form.module_group_title"
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="分组标识" prop="module_group">
          <el-input
            v-model="form.module_group"
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder=""
            type="textarea"
            class="input-box"
          />
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>
<script>
export default {
  props: {
    module: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      form: {
        'id': '',
        'name': '',
        'key': '',
        'module_name': '',
        'module_key': '',
        'module_group': '',
        'module_group_title': '',
        'remark': ''
      },
      module_key: [],
      rules: {
        id: [],
        name: [{ required: true, message: ' ' }],
        key: [{ required: true, message: ' ' }],
        module_name: [{ required: true, message: ' ' }],
        module_key: [{ required: true, message: ' ' }],
        module_group: [{ required: true, message: ' ' }],
        module_group_title: [{ required: true, message: ' ' }],
        remark: []
      },
      mode: 'Create'
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (data && Object.keys(data).length) {
          this.mode = 'Edit'
          this.form = Object.assign({}, JSON.parse(JSON.stringify(data)))
        } else {
          this.mode = 'Create'
          this.form = Object.assign({}, this.form)
          this.form.id = ''
        }
      })
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.Fetch.post('/V4/acl.module.save', this.form).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.dialog.handleClose()
          }).catch(e => {
            this.$refs.dialog.afterValidate()
          })
        } else {
          this.$refs.dialog.afterValidate()
        }
      })
    }
  }
}
</script>
