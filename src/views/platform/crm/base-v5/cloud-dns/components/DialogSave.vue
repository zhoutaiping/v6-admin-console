<style lang="scss" scoped>
.dialog-base-save {
  .dialog-form {
    margin-top: 10px;
  }
  .dialog-form-input {
    width: 250px;
  }
}
</style>
<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    width="500px"
    class="dialog-base-save"
    @close="handleClose('reportForm')"
  >
    <DmScroll>
      <el-form
        ref="reportForm"
        :model="reportForm"
        :rules="rules"
        label-position="left"
        label-width="140px"
        size="mini"
        class="dialog-form"
      >
        <el-form-item
          label="父级线路名称"
          class="dialog-form-item"
        >
          <el-select
            v-model="reportForm.parent_id"
            :disabled="type ==='save_next'"
            filterable
            clearable
            placeholder="父级线路名称"
            class="dialog-form-input"
          >
            <ElOption
              v-for="(item,key) in list_All"
              :key="key"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">id:{{ item.value }}</span>
            </ElOption>
          </el-select>
        </el-form-item>
        <el-form-item
          label="线路标识"
          prop="name"
          class="dialog-form-item"
        >
          <el-input
            v-model="reportForm.name"
            placeholder="请输入线路标识"
            class="dialog-form-input"
          />
        </el-form-item>
        <el-form-item
          label="线路名称"
          prop="desc"
          class="dialog-form-item"
        >
          <el-input
            v-model="reportForm.desc"
            placeholder="请输入线路名称"
            class="dialog-form-input"
          />
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sort"
          class="dialog-form-item"
        >
          <el-input-number
            v-model="reportForm.sort"
            :min="1"
            placeholder="请输入线路排序"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
          class="dialog-form-item"
        >
          <el-radio-group v-model="reportForm.status">
            <el-radio-button label="1">启 用</el-radio-button>
            <el-radio-button label="0">禁 用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </DmScroll>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="info"
        @click="handleClose('reportForm')"
      >取 消</el-button>
      <el-button
        :disabled="loading"
        type="primary"
        @click="handleSubmit('reportForm')"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      open: false,
      type: 'sava',
      API: {
        'add': '/V4/CloudDns.dnsview.add',
        'save_next': '/V4/CloudDns.dnsview.add',
        'edit': '/V4/CloudDns.dnsview.update'
      },
      title: '新增线路',
      title_text: {
        'save_next': '新增下级线路',
        'add': '新增线路',
        'edit': '修改线路'
      },
      reportForm: { name: '', desc: '', status: '1' },
      rules: {
        name: [{ required: true, message: '请输入线路标识！', trigger: ['change', 'blur'] }],
        desc: [{ required: true, message: '请输入线路名称！', trigger: ['change', 'blur'] }],
        sort: [{ type: 'number', required: true, message: '请输入线路排序！', trigger: ['change', 'blur'] }]
      },
      list_All: []
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {

    handleOpen(type, data, list_All) {
      this.$nextTick(() => {
        this.loading = true
        this.open = true
        this.list_All = list_All || []
        const panel_type = type
        this.type = panel_type
        this.title = this.title_text[panel_type]
        this.reportForm = { id: '', sort: '', parent_id: type === 'save_next' ? data.id || '0' : '0', name: '', desc: '', status: '1' }
        if (type === 'edit') {
          this.reportForm = { id: data.id || '', sort: data.sort || '', parent_id: data.parent_id || '0', name: data.name || '', desc: data.desc || '', status: data.status || '1' }
        }

        this.list = []
        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
    },

    handleClose(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields()
      this.open = false
      this.$emit('loadGrid')
    },

    handleSubmit(formName) {
      const params = {
        id: this.reportForm.id || '',
        name: this.reportForm.name,
        desc: this.reportForm.desc,
        parent_id: this.reportForm.parent_id,
        sort: this.reportForm.sort,
        status: this.reportForm.status
      }
      const panel_type = this.type
      const api = this.API[panel_type]
      if (!api) return
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 'add' || this.type === 'save_next') {
            this.InvokeAllApi.post(api, params).then(res => {
              this.loading = false
              this.Message('ACTION_SUCCESS')
              this.open = false
            }).catch(e => { this.loading = false })
          } else {
            this.InvokeAllApi.put(api, params).then(res => {
              this.Message('ACTION_SUCCESS')
              this.open = false
              this.loading = false
            }).catch(e => { this.loading = false })
          }
        } else {
          this.loading = false
          return false
        }
      })
    }
  }

}
</script>
