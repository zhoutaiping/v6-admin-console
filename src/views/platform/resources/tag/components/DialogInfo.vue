<style lang="postcss" scoped>
.tag-info-dialog {
}
</style>
<template>
  <el-dialog
    :visible.sync="open"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    title="详情"
    width="500px"
    aside
    class="tag-info-dialog"
  >
    <DmScroll>
      <div style="max-height:500px;">
        <el-tree
          :data="data"
          :props="defaultProps"
        />
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
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      loading: false,

      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }, {
            label: '三级 1-1-1'
          }, {
            label: '三级 1-1-1'
          }, {
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  methods: {
    handleOpen(data) {
      this.$nextTick(() => {
        this.open = true
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },

    getTagInfo(params) {
      this.InvokeTagApi.get('/tag_type/info', params).then(res => {
      })
    },

    handleClose() {
      this.open = false
    },

    handleSubmint() {
      this.open = false
    }
  }
}
</script>
