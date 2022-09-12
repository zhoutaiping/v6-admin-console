<style lang="scss" scoped>
.router-box {
  border: 1px solid #ebeef5;
}
.button-option {
  text-align: center;
  margin: 300px auto 0;
}
/deep/ .el-divider {
  margin: 10px 0;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    :footer="false"
    title="编辑"
    width="1200px"
  >
    <DmAlert>
      <i class="el-icon-info color--primary"/>
      左边列表是未分配路由,右边列表已分配API
      <br>
      当前路由：{{ form.router_title }}【{{ form.router }}】
    </DmAlert>
    <el-row :gutter="6">
      <el-col :span="10">
        <el-divider content-position="left">未分配API</el-divider>
        <div class="router-box">
          <ApiList
            ref="unbind"
            :column="column"
            @check="checkUnbind"
          />
        </div>
      </el-col>
      <el-col :span="4">
        <div class="button-option">
          <el-button
            slot="reference"
            :disabled="bind_check.length === 0"
            type="primary"
            icon="el-icon-back"
            @click="handleBind('unbind')"
          />
          <el-button
            :disabled="unbind_check.length === 0"
            type="primary"
            icon="el-icon-right"
            @click="handleBind('bind')"
          />
        </div>
      </el-col>
      <el-col :span="10">
        <el-divider content-position="left">已分配API</el-divider>
        <div class="router-box">
          <ApiList
            ref="bind"
            :column="column"
            @check="checkbind"
          />
        </div>
      </el-col>
    </el-row>
  </DmDialog>
</template>
<script>
import ApiList from './apiList'
export default {
  components: { ApiList },
  data() {
    return {
      loading: false,
      form: {},
      column: [
        { label: 'API名称', prop: 'api_name', width: 150 },
        { label: 'API', prop: 'api' }
      ],
      bind_column: [
        { label: 'API名称', prop: 'api_name' },
        { label: 'API', prop: 'api' }
      ],
      apis: [],
      bind_check: [],
      unbind_check: []
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
        this.form = { id: data.id, router_title: data.router_title, router: data.router }
        setTimeout(() => {
          this.getInfo({ router_id: data.id })
        }, 200)
      })
    },
    getInfo(params = {}) {
      this.apis = []
      this.bind_check = []
      this.unbind_check = []
      this.Fetch.get('/V4/acl.router.info', params).then(res => {
        this.apis = res.apis
        if (this.$refs.unbind) {
          this.$refs.unbind.init('/V4/acl.api.list', { api_groups: '', keyword: '', remove_ids: this.apis.length && (this.apis.map(i => { return i.api_id })).join(',') || '' })
        }
        if (this.$refs.bind) this.$refs.bind.init('/V4/acl.router.apis', { id: res.id })
      })
    },
    checkUnbind(e) {
      this.unbind_check = e
    },
    checkbind(e) {
      this.bind_check = e
    },
    handleBind(type) {
      let bind = []
      if (type === 'unbind') {
        const check = this.$refs.bind.check.map(i => { return Number(i.api_id) })
        const apis = this.apis.map(i => { return Number(i.api_id) })
        bind = apis.filter(i => check.indexOf(i) < 0)
      } else if (type === 'bind') {
        bind = this.$refs.unbind.check.map(i => { return Number(i.id) })
        const apis = this.apis.map(i => { return Number(i.api_id) })
        bind = bind.concat(apis)
      }
      const params = {
        router_id: this.form.id,
        api_ids: bind
      }
      this.Fetch.post('/V4/acl.router.bind_api', params).then(res => {
        this.getInfo({ router_id: this.form.id })
        this.Message('ACTION_SUCCESS')
      })
    }
  }
}
</script>
