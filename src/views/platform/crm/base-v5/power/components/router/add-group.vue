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
    title-label="授权对象"
  >
    <DmScroll>
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="授权操作名称" prop="group_name">
          <el-input
            v-model="form.group_name"
            placeholder=""
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="所属产品模块" prop="module_key">
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
                form.module_flags = e[0]
                form.class_type = e[1]
                form.module_key = e[1]
                getRouter(e[1])
              }
            }"
          />
        </el-form-item>
        <el-form-item label="路由绑定" prop="router_ids">
          <el-select v-model="form.router_ids" filterable multiple collapse-tags class="input-box">
            <el-option
              v-for="item in routers"
              :key="item.id"
              :label="item.router_title"
              :value="item.id">
              <span>
                {{ item.router_title }}【{{ item.router }}】
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要授权对象" prop="is_setting">
          <el-radio-group v-model="form.is_setting">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="acl_note">
          <el-input
            v-model="form.acl_note"
            placeholder=""
            type="textarea"
            class="input-box"
          />
        </el-form-item>
        <el-form-item label="备注">
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
        group_name: '',
        module_key: '',
        router_ids: [],
        is_setting: '1',
        setting_type: '',
        setting_list: [],
        status: '1',
        acl_note: '',
        remark: ''
      },
      rules: {
        group_name: [{ required: true, message: ' ' }],
        router_ids: [{ required: true, message: ' ' }],
        module_key: [{ required: true, message: ' ' }],
        setting_type: [],
        setting_list: [],
        is_setting: [{ required: true, message: ' ' }],
        status: [{ required: true, message: ' ' }],
        acl_note: [{ required: true, message: ' ' }],
        remark: []
      },
      option: {
        status: [
          { label: '未启用', value: '0' },
          { label: '启用', value: '1' },
          { label: '禁用', value: '2' }
        ],
        is_setting: [
          { label: '是', value: '1' },
          { label: '否', value: '0' }
        ]
      },
      mode: 'Create',
      module_key: [],
      routers: []
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.module_key = []
        if (this.$refs.Form) {
          this.$refs.Form.resetFields()
        }
        if (data && Object.keys(data).length) {
          this.mode = 'Edit'
          this.getInfo({ id: data.id })
        } else {
          this.mode = 'Create'
          this.form = Object.assign({}, this.form)
          delete this.form.id
        }
      })
    },
    getInfo(params = {}) {
      this.Fetch.get('/V4/acl.router.group.info', params).then(res => {
        this.module_key = [res.module_key, res.class_type]
        this.form = Object.assign(this.form, res)
        this.form.router_ids = res.routers.map(i => { return i.id })
        this.getRouter(res.class_type)
      })
    },
    getRouter(class_type = '') {
      this.routers = []
      this.Fetch.get('/V4/acl.router.list', { class_type, page: 1, pagesize: 100 }).then(res => {
        this.routers = res.list
      })
    },
    fetchSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const data = { ...this.form }
          data.router_ids = this.form.router_ids.join(',')
          this.Fetch.post('V4/acl.router.group.save', data).then(res => {
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
    },
    addRouter(type, index) {
      if (type === 'add') {
        this.form.setting_list.push({ key: '', value: '' })
      } else if (type === 'del') {
        const list = []
        this.form.setting_list.forEach((i, k) => {
          if (k !== index) {
            list.push(i)
          }
        })
        this.form.setting_list = list
      }
    }
  }
}
</script>
