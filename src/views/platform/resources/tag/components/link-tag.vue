<style lang="scss" scoped>
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
    :title="'关联标签'"
    width="500px"
    aside
    class="tag-add-dialog"
  >
    <DmScroll>
      <DmAlert>
        标签关联风险等级<br>
        风险等级下级有低危、中危、高危 三种标签，如果没有请联系管理员。
      </DmAlert>
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
            readonly
            class="tag-form-input"
          />
        </el-form-item>
        <el-form-item
          v-if="Object.keys(linkTag).length"
          label="关联标签"
          prop="type"
        >
          <el-select
            v-model="addForm.type"
            class="tag-form-input"
          >
            <el-option
              :label="linkTag[ Object.keys(linkTag)[0]].type.name || '风险等级'"
              :value="linkTag[ Object.keys(linkTag)[0]].type.ukey || 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="Object.keys(linkTag).length"
          prop="relate_tags"
        >
          <el-select
            v-model="addForm.relate_tags"
            class="tag-form-input"
            @change="changLink"
          >
            <el-option
              v-for="(item, index) in linkTag[ Object.keys(linkTag)[0]].tags"
              :key="index"
              :label="item.tag"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="addForm.remark"
            type="textarea"
            placeholder="请输入备注"
            clearable
            class="tag-form-input"
          />
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
      addForm: {},
      rules: {
        tag: [{ required: true, message: '请输入标签名称', trigger: ['change', 'blur'] }],
        type: [{ required: true, message: '请选择行业', trigger: ['change', 'blur'] }],
        relate_tags: [{ required: true, message: '请选择标签等级', trigger: ['change', 'blur'] }],
        status: [{ required: true, message: '请选择标签状态', trigger: ['change', 'blur'] }],
        type_ukey: [{ required: true, message: '请选择标签类型', trigger: ['change', 'blur'] }],
        attrs: [{ type: 'array', required: true, message: '请选择标签属性', trigger: ['change', 'blur'] }],
        remark: []
      },
      linkTag: {},
      relate_tags: {}
    }
  },

  methods: {
    handleOpen(data, linkTag) {
      this.$refs.dmdialog.handleOpen()
      this.$nextTick(() => {
        this.addForm = Object.assign(data, { type: '', relate_tags: '' })
        this.linkTag = Object.assign(linkTag, {})
      })
    },
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields()
    },

    changLink(id) {
      const linkTag = this.linkTag[Object.keys(this.linkTag)[0]].tags
      const select = linkTag.find(i => {
        return Number(i.id) === Number(id)
      })
      if (select) this.relate_tags[select.id] = select.tag
    },
    getParams() {
      const params = {
        'id': this.addForm.id,
        'tag': this.addForm.tag,
        'relate_tags': this.relate_tags,
        'type_ukey': this.addForm.type_ukey,
        'remark': this.addForm.remark
      }
      return params
    },
    handleSubmint() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.InvokeTagApi.post('/tag/save', this.getParams()).then(res => {
            this.Message('ACTION_SUCCESS')
            this.open = false
            this.$emit('init')
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
