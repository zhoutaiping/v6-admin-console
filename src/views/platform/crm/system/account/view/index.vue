<template>
  <div style="padding:12px">
    <DmToolbar>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$refs.userEdit.handleOpen({},'Create')"
      >新 增</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.account"
          :max-length="32"
          placeholder="账户名"
          @submit="$refs.DmData.initPage()"
        />
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading">
        <el-table
          ref="roleList"
          :data="list"
        >
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
          >
            <template v-slot="scope">
              <div v-if="item.prop ==='status'">
                <span :class=" Number(scope.row.status)===1 ? 'color--success':'color--warning'">
                  {{ scope.row.status === '1' ? '启用' : '禁用' }}
                </span>
              </div>
              <div v-else-if="item.prop ==='is_admin'">
                <span v-show="Number(scope.row.is_admin) === 0 ">
                  <svg-icon icon-class="platform2" /> 否
                </span>
                <span v-show="Number(scope.row.is_admin) === 1 ">
                  <svg-icon icon-class="platform3" /> 是
                </span>
              </div>
              <div v-else-if="item.prop ==='link_role'">
                {{ getUserRoleText(scope.row) }}
              </div>
              <div v-else>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="操作"
            min-width="120"
          >
            <template slot-scope="scope">
              <a
                class="color--primary"
                @click="$refs.userEdit.handleOpen(scope.row, 'Edit')"
              >编 辑</a>

              <!-- <el-button
                type="text"
                @click="$refs.SettingLogin.handleOpen(scope.row)"
              >登录设置</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <UserEdit
      ref="userEdit"
      :rule-list="ROLELIST"
      @on-success="$refs.DmData.initPage()"
    />
    <SettingLogin
      ref="SettingLogin"
      @init="$refs.DmData.initPage()"
    />
  </div>
</template>
<script>
import UserEdit from './Dialog/user-edit'
import SettingLogin from './Dialog/setting-login'
import RoleResource from '@/views/platform/crm/system/resourceApi/roleApi'
import consoleData from '@/mixins/consoleData'
import { deepClone } from '@/utils'
export default {
  components: { UserEdit, SettingLogin },
  mixins: [consoleData],
  data() {
    return {
      ROLELIST: [],
      bindParams: { account: '' },
      API_INDEX: '/V4/rbac.user.getList',
      column: [
        { label: 'ID', prop: 'id' },
        { label: '账户名', prop: 'account' },
        { label: '昵称', prop: 'nickname' },
        { label: '状态', prop: 'status' },
        { label: '是否管理员', prop: 'is_admin' },
        { label: '关联角色', prop: 'link_role' },
        { label: '备注', prop: 'remark' }
      ]
    }
  },
  created() {
    this.getRolelist()
  },
  methods: {
    async getRolelist() {
      this.ROLELIST = []
      try {
        const data = await RoleResource.getRoleList()
        this.ROLELIST = data.list
      } catch (error) {
        return
      }
    },

    getUserRoleText(row) {
      const text = []
      const role_ids = row.role_ids
      role_ids.forEach(element => {
        const find = deepClone(this.ROLELIST).find(e => e.id === element)
        if (find) text.push(find.name)
      })
      return text.join('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.card-panel {
  margin: 5px 10px 0;
  padding: 5px;
}
</style>

