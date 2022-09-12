<style lang="postcss" scoped>
.tag-add-next-dialog {
  .tag-form {
    margin: 5px;
    .tag-form-input {
      width: 300px;
    }
  }
}
</style>
<template>
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmint"
    :title="'新增子标签'"
    width="500px"
    aside
    class="tag-add-next-dialog"
  >
    <DmScroll>
      <el-form
        v-loading="loading"
        ref="editForm"
        :model="editForm"
        :rules="rules"
        size="mini"
        label-position="left"
        label-width="90px"
        class="tag-form"
      >
        <el-form-item
          label="父标签ID"
          prop="pid"
        >
          <el-input
            v-model="editForm.pid"
            :readonly="true"
            placeholder=""
            class="tag-form-input"
          />
        </el-form-item>
        <el-form-item
          label="标签名称"
          prop="tag"
        >
          <el-input
            v-model="editForm.tag"
            placeholder=""
            class="tag-form-input"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="editForm.status">
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="0">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="标签类别"
          prop="type_ukey"
        >
          <el-select
            v-model="editForm.type_ukey"
            disabled
            placeholder=""
            class="tag-form-input"
            @change="loadAttrs"
          >
            <el-option
              v-for="(item, index) in TAG_TYPE"
              :key="index"
              :label="item.name"
              :value="item.ukey"
            />
          </el-select>
        </el-form-item>
        <template v-if="editForm.type_ukey && attrsList.length" >
          <el-form-item label="标签属性" prop="attrsParams"/>
          <el-table :data="editForm.attrsParams">
            <el-table-column label="属性">
              <template slot-scope="scope">
                <el-select v-model="scope.row.ukey" placeholder="" @change="changAttrs(scope.$index)">
                  <el-option
                    v-for="(item, index) in attrsList"
                    :key="index"
                    :label="item.name"
                    :value="item.ukey"
                    :disabled="item.disabled"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.default" placeholder=""/>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <a class="color--primary" @click="removeadd">新增</a>
                <el-divider direction="vertical"/>
                <a class="color--primary" @click="removeAttrs(scope.$index)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-form-item
          label="备注"
          prop="remark"
          style="margin:10px 0 0;"
        >
          <el-input
            v-model="editForm.remark"
            type="textarea"
            placeholder="请输入备注"
            clearable
            class="tag-form-input"
          >>
          </el-input>
        </el-form-item>
      </el-form>
    </DmScroll>
  </DmDialog>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      loading: false,
      ATTRS: [],
      TAG_TYPE: [],
      panelType: '',
      editForm: { pid: '', tag: '', type_ukey: '', attrs: [], attrsParams: [], status: '', remark: '' },
      rules: {
        attrs: [{ type: 'array', required: true, message: '请选择标签属性', trigger: ['change', 'blur'] }],
        status: [{ required: true, message: '请选择标签状态', trigger: ['change', 'blur'] }],
        tag: [{ required: true, message: '请输入标签名称', trigger: ['change', 'blur'] }],
        type_ukey: [{ required: true, message: '请选择标签类型', trigger: ['change', 'blur'] }],
        remark: [],
        id: [],
        pid: [],
        attrsParams: []
      }
    }
  },
  computed: {
    attrsList() {
      const attrs = this.ATTRS
      attrs.forEach(i => {
        i.disabled = false
        if (this.editForm.attrsParams.find(k => i.ukey === k.ukey)) i.disabled = true
      })
      return attrs
    }
  },
  methods: {
    handleOpen(type, data, tag_type) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.resetForm('editForm')
        this.panelType = type
        this.TAG_TYPE = tag_type
        this.loading = true
        this.getInfo({ id: data.id })
        setTimeout(() => { this.loading = false }, 1000)
      })
    },

    getInfo(params) {
      this.InvokeTagApi.get('/tag/info', params).then(res => {
        const data = JSON.parse(JSON.stringify(res))
        this.editForm.pid = data.id
        this.editForm.type_ukey = data.type_ukey
        this.editForm.attrs = []
        this.loadAttrs()
        this.editForm.attrsParams = [{ ukey: '', default: '' }]
      })
    },

    loadAttrs() {
      this.editForm.attrs = []
      const find = this.TAG_TYPE.filter(record => {
        return record.ukey === this.editForm.type_ukey
      })
      const type_ukey = find.length && find[0] || {}
      const ATTRS = []
      if (type_ukey && type_ukey.attrs) {
        const attrs = type_ukey.attrs
        for (var i in attrs) {
          ATTRS.push(attrs[i])
        }
      }
      this.ATTRS = ATTRS
    },
    resetForm(formName) {
      setTimeout(() => { if (this.$refs[formName]) this.$refs[formName].resetFields() }, 200)
    },
    changAttrs(index) {
      const row = this.editForm.attrsParams[index]
      if (!row) return
      const find = this.ATTRS.find(i => i.ukey === row.ukey)
      this.editForm.attrsParams[index].default = find.default
      this.editForm.attrsParams.push({ ukey: '', default: '' })
    },

    removeadd() {
      if (this.editForm.attrsParams[this.editForm.attrsParams.length - 1].ukey !== '') this.editForm.attrsParams.push({ ukey: '', default: '' })
    },
    removeAttrs(index) {
      this.editForm.attrsParams.splice(index, 1)
      if (this.editForm.attrsParams.length === 0) this.editForm.attrsParams.push({ ukey: '', default: '' })
    },
    getParams() {
      const attrs = {}
      this.editForm.attrsParams.forEach(i => {
        if (i.ukey !== '') {
          attrs[i.ukey] = i.default
        }
      })
      const params = {
        'pid': this.editForm.pid,
        'tag': this.editForm.tag,
        'type_ukey': this.editForm.type_ukey,
        'attrs': attrs,
        'remark': this.editForm.remark,
        'status': Number(this.editForm.status)
      }
      return params
    },
    handleSubmint() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.InvokeTagApi.post('/tag/save', this.getParams()).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('getTagType')
            this.$emit('handleLoad')
            this.$refs.dmdialog.handleClose()
          }).catch(e => { this.$refs.dmdialog.afterValidate() })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }
}
</script>
