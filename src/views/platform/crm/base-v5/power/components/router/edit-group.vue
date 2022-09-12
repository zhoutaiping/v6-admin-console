<style lang="scss" scoped>
.router-box {
  border: 1px solid #EBEEF5;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :fetch-submit="fetchSubmit"
    title="编辑"
    width="1200px"
  >
    <DmScroll>
      <el-row :gutter="6">
        <el-col :span="12">
          <el-divider content-position="left">未分配路由</el-divider>
          <div class="router-box">
            <RouterList :column="column"/>
          </div>
        </el-col>
        <el-col :span="12">
          <el-divider content-position="left">已分配路由</el-divider>
          <div class="router-box">
            <RouterList :column="column"/>
          </div>
        </el-col>
      </el-row>
    </DmScroll>
  </DmDialog>
</template>
<script>
import RouterList from './routerList'
export default {
  components: { RouterList },
  data() {
    return {
      loading: false,
      form: {},
      column: [
        { label: 'API名称', prop: 'name' },
        { label: '路由', prop: 'router' },
        { label: '系统', prop: 'system' },
        { label: '所属产品', prop: 'product' }
      ]
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
      })
    },
    fetchSubmit() { }
  }
}
</script>
