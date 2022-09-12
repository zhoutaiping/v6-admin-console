<style lang="scss" scoped>
.form-item-box {
  margin-bottom: 5px;
}
.form-input-box {
  width: 300px;
}
</style>
<template>
  <div>
    <DmDialog
      ref="dmdialog"
      :fetch-submit="fetchSubmit"
      title="用户认证"
      width="500px"
    >
      <div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="mini"
          label-position="left"
          label-width="100px"
        >
          <el-form-item
            label="用户"
            class="form-item-box"
          >
            {{ rowData.customer_name }}
          </el-form-item>
          <el-form-item
            v-for="(item, index) in linkTag"
            :key="index"
            :label="item.label"
            class="form-item-box"
          >
            <a-cascader
              v-model="form[item.value]"
              :options="item.Children"
              :field-names="{children:'Children', label:'tag', value:'id'}"
              class="form-input-box"
              placeholder="请选择"
              change-on-select
            />
          </el-form-item>
        </el-form>
      </div>
    </DmDialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      rowData: {},
      rules: {},
      linkTag: []
    }
  },
  methods: {
    async handleOpen(data, linkTag) {
      this.$refs.dmdialog.handleOpen()
      if (this.$refs.form) this.$refs.form.resetFields()
      this.rowData = Object.assign(JSON.parse(JSON.stringify(data)), {})
      this.linkTag = linkTag
      // 同步数据到调度
      this.memberSync(data)
      this.setFormModel(linkTag, await this.getUser(data.member_id))
    },

    setFormModel(list, info) {
      list.forEach(_ => {
        const default_data = info && info.tags && info.tags[_.value] ? Object.keys(info.tags[_.value]) : []
        this.$set(this.form, _.value, default_data.map(i => Number(i)))
      })
    },

    async getUser(user_id) {
      try {
        const data = await this.InvokeDispApi.get('/user/info', {
          user_id: user_id
        })
        return data
      } catch (error) {
        return {}
      }
    },

    async memberSync(data) {
      const params = {
        info: {
          member_id: data.member_id,
          tag_ids: data.industryType || []
        }
      }
      // 同步数据到调度
      await this.InvokeAllApi.post('/V4/disp.sync.member', params)
        .then(res => { })
        .catch(e => { })
    },

    changeInd() {
      const ind = this.$refs.ind.getCheckedNodes().length && this.$refs.ind.getCheckedNodes()[0].data || null
      if (ind && ind.relate_tags && Object.keys(ind.relate_tags).length) {
        this.form.link_id = Object.keys(ind.relate_tags)[0]
      }
    },

    fetchSubmit(fromName = 'form') {
      const tags = { ...this.form }
      let tag_ids = []
      Object.keys(tags).forEach(i => {
        if (tags[i]) tag_ids = tag_ids.concat(tags[i])
      })
      if (!tag_ids.length) {
        this.message.warning('请选择用户标签!')
        this.$refs.dmdialog.afterValidate()
        return
      }
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          const params = {
            user_ids: [this.rowData.member_id],
            tag_ids: tag_ids.map(i => i.toString())
          }
          this.InvokeDispApi.post('/user/tag/bind', params).then(res => {
            this.Message('ACTION_SUCCESS')
            this.$emit('init')
            this.$refs.dmdialog.handleClose()
          }).catch(e => {
            this.$refs.dmdialog.afterValidate()
          })
        } else {
          this.$refs.dmdialog.afterValidate()
        }
      })
    }
  }
}
</script>
