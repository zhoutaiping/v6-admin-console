<style lang="scss" scoped>
  @import url('./style.scss');
</style>
<template>
  <console-page-layout>
    <DmData
      ref="DmData"
      :auto-init="false"
      :show-pagination="false"
      @init="fetchList"
    >
      <DmTable v-loading="loading">
        <el-table :data="list" :height="600">
          <el-table-column label="ID" width="55" prop="id"/>
          <el-table-column label="用户名称">
            <template slot-scope="{row}">
              {{ formartVaue(row, 'account') }}
            </template>
          </el-table-column>
          <el-table-column label="昵称" >
            <template slot-scope="{row}">
              {{ formartVaue(row, 'nickname') }}
            </template>
          </el-table-column>
          <el-table-column label="状态" >
            <template slot-scope="{row}">
              <span v-show="formartVaue(row, 'status') === 0 " class="color--danger"> 禁用</span>
              <span v-show="formartVaue(row, 'status') === 1 " class="color--success"> 启用</span>
            </template>
          </el-table-column>
          <el-table-column label="是否管理员" >
            <template slot-scope="{row}">
              <span v-show="formartVaue(row, 'is_admin') === 0 " class="color--danger">否</span>
              <span v-show="formartVaue(row, 'is_admin') === 1 " class="color--danger">是</span>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  props: {
    role: {
      type: String,
      default: ''
    },
    role_name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bindParams: { role_name: '' },
      API_INDEX: '/V4/rbac.user.role.relation',
      form: {}
    }
  },

  methods: {
    init(data) {
      this.form = Object.assign({}, data)
      this.bindParams.role_name = data.name || this.role_name || ''
      this.$refs.DmData.initPage()
    },

    formartVaue(data, prop) {
      const val = ''
      if (prop === 'account') {
        const user = data.user || []
        return user.length && user[0].account
      } else if (prop === 'nickname') {
        const user = data.user || []
        return user.length && user[0].nickname
      } else if (prop === 'status') {
        const user = data.user || []
        return user.length && user[0].status
      } else if (prop === 'is_admin') {
        const user = data.user || []
        return user.length && user[0].is_admin
      }
      return val
    }
  }
}
</script>
