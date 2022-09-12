<style lang="postcss" scoped>
.tag-add-type-dialog {
  .tag-form {
    margin: 5px;

    .tag-form-input {
      width: 300px;
    }
    .tag-form-item {
      margin-bottom: 5px;
    }
    .tag-form-input-2 {
      width: 200px;
    }
    .op-btn {
      margin-left: 0px;
    }
  }
}
</style>
<template>
  <!-- <FDialog
    :title="title"
    :visible="open"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    size="500"
    aside
    class="tag-add-type-dialog"
    @close="handleClose"
  > -->
  <DmDialog
    ref="dmdialog"
    :fetch-submit="handleSubmint"
    :title="title"
    width="500px"
    aside
    class="tag-add-type-dialog"
  >
    <DmScroll>
      <el-form
        ref="tagForm"
        :model="tagForm"
        :rules="rules"
        size="mini"
        label-position="left"
        label-width="90px"
        class="tag-form"
      >
        <el-form-item
          label="类别名称"
          prop="name"
        >
          <el-input
            v-model="tagForm.name"
            placeholder="请输入名称"
            class="tag-form-input"
          />
        </el-form-item>
        <el-form-item
          label="类型标识"
          prop="ukey"
        >
          <el-input
            v-model="tagForm.ukey"
            placeholder="请输入名称"
            class="tag-form-input"
          />
        </el-form-item>
        <el-form-item
          label="应用范围"
          prop="apply_scope"
        >
          <el-radio-group v-model="tagForm.apply_scope">
            <el-radio-button label="user">用户</el-radio-button>
            <el-radio-button label="biz">业务</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否必选"
          prop="must"
        >
          <el-radio-group v-model="tagForm.must">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否多选"
          prop="allow_more"
        >
          <el-radio-group v-model="tagForm.allow_more">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="tagForm.status">
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="0">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="属性列表"
          style="border-top:1px solid #eee;"
          class="tag-form-item"
        />
        <el-form-item
          label=""
          label-width="0px"
          prop="attrs"
        >
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleKyeEdit('add')"
          >新增</el-button>
          <el-table
            :data="tagForm.attrs"
            border
          >
            <el-table-column label="属性名称">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.name"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column label="属性标识">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.ukey"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column label="默认值">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.default"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.remark"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column
              label=""
              width="55"
            >
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="handleKyeEdit('del', scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>
    </DmScroll>
    <!-- <div slot="footer">
      <el-button
        type="info"
        @click="handleClose"
      >取消</el-button>
      <el-button
        type="primary"
        @click="handleSubmint"
      >确定</el-button>
    </div>
  </FDialog> -->
  </DmDialog>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      loading: false,
      tagForm: { name: '', ukey: '', apply_scope: '', attrs: [], must: 0, allow_more: 0, status: '1', remark: '' },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: ['change', 'blur'] }],
        apply_scope: [{ required: true, message: '请选择应用范围', trigger: ['change', 'blur'] }],
        ukey: [{ required: true, message: '请输入类型标识', trigger: ['change', 'blur'] }],
        status: [{ required: true, message: '请选择状态', trigger: ['change', 'blur'] }],
        attrs: [],
        must: [],
        allow_more: []
      },
      title: ''

    }
  },

  methods: {
    handleOpen(id) {
      this.loading = true
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.resetForm('tagForm')
        this.tagForm.id = ''
        this.tagForm.attrs = [{ name: '', ukey: '', default: '', remakr: '' }]
        this.title = '新增类别'
        if (id) {
          this.title = '编辑'
          this.getTagInfo({ id: id })
        }
      })
      setTimeout(() => { this.loading = false }, 1000)
    },
    getTagInfo(params) {
      this.InvokeTagApi.get('/tag_type/info', params).then(res => {
        this.tagForm.id = res.id
        this.tagForm.must = res.must
        this.tagForm.allow_more = res.allow_more
        this.tagForm.name = res.name
        this.tagForm.ukey = res.ukey
        this.tagForm.apply_scope = res.apply_scope
        this.tagForm.remark = res.remark
        const attrs = []
        if (res.attrs && Object.keys(res.attrs).length) {
          Object.keys(res.attrs).forEach((i, index) => {
            if (res.attrs[i]) attrs.push(res.attrs[i])
          })
        }
        this.tagForm.attrs = attrs
      })
    },
    check() {
      let check = true
      const notFind = this.tagForm.attrs.filter(i => (!(i.name.trim()) || !(i.ukey.trim()) || !(i.default.trim())))
      check = notFind.length === 0
      return check
    },
    handleKyeEdit(type, index) {
      if (type === 'add') {
        if (!this.check()) {
          this.message.warning('属性名称、标识、默认值不能为空!')
          return
        }
        this.tagForm.attrs.push({ name: '', ukey: '', default: '', remakr: '' })
      } else {
        this.tagForm.attrs.splice(index, 1)
      }
    },

    resetForm(formName) {
      if (this.$refs[formName] !== undefined) this.$refs[formName].resetFields()
    },
    getParams() {
      const params = { ... this.tagForm }
      if (this.tagForm.id) params.id = this.tagForm.id
      return params
    },
    handleSubmint() {
      this.$refs.tagForm.validate((valid) => {
        if (valid) {
          // if (this.tagForm.attrs.length === 0) {
          //   this.message.warning('请新增属性')
          //   return
          // }
          // if (!this.check()) {
          //   this.message.warning('请输入属性')
          //   return
          // }
          this.InvokeTagApi.post('/tag_type/save', this.getParams()).then(res => {
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
