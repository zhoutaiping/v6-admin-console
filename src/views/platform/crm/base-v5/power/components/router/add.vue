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
        <el-form-item label="路由名称" prop="router_title">
          <el-input
            v-model="form.router_title"
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="路由" prop="router">
          <el-input
            v-model="form.router"
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="路由标识" prop="master_key">
          <el-input
            v-model="form.master_key"
            placeholder=""
            class="input-box"
            @change="e =>{form.router_name = e}"
          />
        </el-form-item>
        <el-form-item label="所属模块" prop="class_type">
          <el-cascader
            :options="module"
            v-model="module_key"
            placeholder="所属模块"
            filterable
            clearable
            class="input-box"
            @change="e =>{
              form.module_key = ''
              form.class_type = ''
              form.module_flags = ''
              if(e && e[1]) {
                form.module_key = e[0]
                form.module_flags = e[0]
                form.class_type = e[1]
              }
            }"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">未启用</el-radio>
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="前置路由ID" prop="pre_router_ids">
          <el-input
            v-model="form.pre_router_ids"
            placeholder="前置路由ID，多个逗号分割"
            type="textarea"
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
        'router': '',
        'router_title': '',
        'router_name': '',
        'master_key': '',
        'module_key': '',
        'module_flags': '',
        'status': '',
        'class_type': '',
        'pre_router_ids': '',
        'remark': ''
      },
      module_key: [],
      rules: {
        id: [],
        router: [{ required: true, message: ' ' }],
        router_title: [{ required: true, message: ' ' }],
        master_key: [{ required: true, message: ' ' }],
        module_key: [{ required: true, message: ' ' }],
        module_flags: [{ required: true, message: ' ' }],
        class_type: [{ required: true, message: ' ' }],
        status: [{ required: true, message: ' ' }],
        pre_router_ids: [],
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
        this.module_key = []
        if (data && Object.keys(data).length) {
          this.mode = 'Edit'
          this.module_key = [data.module_flags, data.class_type]
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
          this.Fetch.post('/V4/acl.router.save', this.form).then(res => {
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
