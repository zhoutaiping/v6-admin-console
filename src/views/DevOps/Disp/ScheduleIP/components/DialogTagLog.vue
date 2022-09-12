<style lang="postcss" scoped>
.scedule-edit {
  .scedule-edit-dialog {
    .block {
      margin: 10px 5px;
    }
  }
}
</style>

<template>
  <div class="scedule-edit">
    <FDialog
      :visible.sync="open"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      title="节点IP：55.55.55.55"
      size="500"
      aside
      class="scedule-edit-dialog"
    >
      <DmScroll>
        <div class="block">
          <el-timeline v-loading="loading">
            <el-timeline-item
              v-for="(item, index) in list"
              :key="index"
              :timestamp="item.update_at"
              placement="top"
            >
              <el-card>
                <p>ID：{{ item.id }}</p>
                <p>标签名称：{{ item.tag }}</p>
                <p>所属标识：{{ item.tag_tkey }}</p>
                <p>状态：{{ Number(item.status) === 0 ? '禁用' :'启用' }}</p>
                <p>创建时间： {{ item.create_at }}</p>
                <p v-if="item.remark">备注： {{ item.remark }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </DmScroll>
      <div slot="footer">
        <el-button
          type="info"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmint"
        >确定</el-button>
      </div>
    </FDialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      loading: false,
      activities2: [{
        content: '支持使用图标',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more'
      }, {
        content: '支持自定义颜色',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87'
      }, {
        content: '支持自定义尺寸',
        timestamp: '2018-04-03 20:46',
        size: 'large'
      }, {
        content: '默认样式的节点',
        timestamp: '2018-04-03 20:46'
      }],
      list: []
    }
  },

  methods: {
    handleOpen(data, type) {
      this.$nextTick(() => {
        this.open = true
        this.loading = true
        if (Object.keys(data.tags)[0]) this.getTagLog({ 'tag_tkey': Object.keys(data.tags)[0], 'page': 1, 'pagesize': 100 })
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },

    getTagLog(params) {
      this.list = []
      this.InvokeDispApi.get('/tag/list', params).then(res => {
        this.list = res.list
      })
    },
    handleClose() {
      this.open = false
    },

    handleSubmint() {
      this.$refs.rootForm.validate((valid) => {
        if (valid) {
          //
        }
      })
    }
  }
}
</script>
