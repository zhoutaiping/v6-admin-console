<style lang="postcss" scoped>
.tag-add-dialog {
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
    :title="'新增标签'"
    width="500px"
    aside
    class="tag-add-dialog"
  >
    <DmScroll>
      <el-form
        v-loading="loading"
        ref="addForm"
        :model="addForm"
        :rules="rules"
        size="mini"
        label-position="left"
        label-width="90px"
        class="tag-form"
      >
        <el-form-item
          label="标签名称"
          prop="tag"
        >
          <el-input
            v-model="addForm.tag"
            placeholder="标签名称"
            class="tag-form-input"
          />
        </el-form-item>
        <el-form-item
          label="标签类别"
          prop="type_ukey"
        >
          <el-select
            v-model="addForm.type_ukey"
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
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="addForm.status">
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="0">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="addForm.type_ukey && attrsList.length" >
          <el-form-item label="标签属性" prop="attrsParams"/>
          <el-table :data="addForm.attrsParams">
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
            <el-table-column label="默认值">
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
            v-model="addForm.remark"
            type="textarea"
            placeholder="请输入备注"
            clearable
            class="tag-form-input"
          >></el-input>
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
      addForm: { tag: '', status: '', type_ukey: '', relate_tags: '', attrs: [], attrsParams: [], remark: '' },
      panelType: '',
      RELATE_TAGS: [
        { label: '低危', value: '1' }, { label: '中危', value: '100' }, { label: '高危', value: '1000' }
      ],
      rules: {
        tag: [{ required: true, message: '请输入标签名称', trigger: ['change', 'blur'] }],
        relate_tags: [{ required: true, message: '请选择标签等级', trigger: ['change', 'blur'] }],
        status: [{ required: true, message: '请选择标签状态', trigger: ['change', 'blur'] }],
        type_ukey: [{ required: true, message: '请选择标签类型', trigger: ['change', 'blur'] }],
        attrs: [{ type: 'array', required: true, message: '请选择标签属性', trigger: ['change', 'blur'] }],
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
        if (this.addForm.attrsParams.find(k => i.ukey === k.ukey)) i.disabled = true
      })
      return attrs
    }
  },
  methods: {
    handleOpen(type, data, tag_type) {
      this.$refs.dmdialog.handleOpen()
      this.panelType = type
      this.TAG_TYPE = tag_type
      this.$nextTick(() => {
        this.resetForm('addForm')
        this.loadAttrs(data.value)
        this.addForm.attrsParams = [{ ukey: '', default: '' }]
        this.loading = true
        setTimeout(() => { this.loading = false }, 1000)
      })
    },
    loadAttrs(val) {
      if (!val) return
      this.addForm.attrs = []
      const type_ukey = this.TAG_TYPE.filter(i => i.ukey === val)[0] || {}
      this.addForm.type_ukey = type_ukey.ukey
      const ATTRS = []
      if (type_ukey && type_ukey.attrs && Object.keys(type_ukey.attrs).length) {
        const attrs = type_ukey.attrs
        Object.keys(type_ukey.attrs).forEach(i => {
          ATTRS.push(attrs[i])
        })
      }
      this.ATTRS = ATTRS
    },
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields()
    },

    changAttrs(index) {
      const row = this.addForm.attrsParams[index]
      if (!row) return
      const find = this.ATTRS.find(i => i.ukey === row.ukey)
      this.addForm.attrsParams[index].default = find.default
      this.addForm.attrsParams.push({ ukey: '', default: '' })
    },

    removeadd() {
      if (this.addForm.attrsParams[this.addForm.attrsParams.length - 1].ukey !== '') this.addForm.attrsParams.push({ ukey: '', default: '' })
    },
    removeAttrs(index) {
      this.addForm.attrsParams.splice(index, 1)
      if (this.addForm.attrsParams.length === 0) this.addForm.attrsParams.push({ ukey: '', default: '' })
    },
    getParams() {
      const attrs = {}
      this.addForm.attrsParams.forEach(i => {
        if (i.ukey !== '') {
          attrs[i.ukey] = i.default
        }
      })
      const params = {
        'tag': this.addForm.tag,
        'type_ukey': this.addForm.type_ukey,
        'attrs': attrs,
        'remark': this.addForm.remark,
        'status': Number(this.addForm.status)
      }
      return params
    },
    handleSubmint() {
      this.$refs.addForm.validate((valid) => {
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
