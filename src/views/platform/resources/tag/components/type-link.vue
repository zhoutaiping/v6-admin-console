<style lang="scss" scoped>
.item-box {
  margin-bottom: 5px;
}
.item-input {
  width: 300px;
}
</style>
<template>
  <div>
    <DmDialogDrawer
      ref="link"
      :fetch-submit="fetchSubmit"
      width="500px"
      title="关联标签"
    >
      <DmAlert>
        标签类型关联风险等级<br>
        风险等级下级有低危、中危、高危 三种标签，如果没有请联系管理员。
      </DmAlert>
      <div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="mini"
          label-width="100px"
          label-position="left"
        >
          <el-form-item
            label="类别名称"
            prop="name"
          >
            {{ form.name }}
          </el-form-item>
          <el-form-item
            v-if="Object.keys(linkTag).length"
            label="关联标签"
            prop="type"
          >
            <el-select
              v-model="form.type"
              class="item-input"
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
              v-model="form.relate_tags"
              class="item-input"
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
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              clearable
              class="item-input"
            />
          </el-form-item>
        </el-form>
      </div>
    </dmdialogdrawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: { name: '', remark: '' },
      rules: {
        name: [{ required: true, message: '请输入标签名称', trigger: ['change', 'blur'] }],
        type: [{ required: true, message: '请选择行业', trigger: ['change', 'blur'] }],
        relate_tags: [{ required: true, message: '请选择标签等级', trigger: ['change', 'blur'] }],
        remark: []
      },
      linkTag: {},
      relate_tags: {}
    }
  },
  methods: {
    openWin(data, linkTag) {
      this.$refs.link.handleOpen()
      this.linkTag = Object.assign(linkTag, {})
      this.form = Object.assign(data, { type: '', relate_tags: '' })
    },
    changLink(id) {
      const linkTag = this.linkTag[Object.keys(this.linkTag)[0]].tags
      const select = linkTag.find(i => {
        return Number(i.id) === Number(id)
      })
      if (select) this.relate_tags[select.id] = select.tag
    },
    async fetchSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            id: this.form.id,
            ukey: this.form.ukey,
            relate_tags: this.relate_tags,
            remark: this.form.remark
          }

          this.InvokeTagApi.post('/tag_type/save', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$refs.link.handleClose()
            this.$emit('init')
          })
        }
      })
    }
  }
}
</script>
