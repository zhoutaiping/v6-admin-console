<template>
  <div class="role-box">
    <div class="nav">
      <div class="nav__hd">
        角色列表
        <el-button
          type="text"
          icon="el-icon-circle-plus"
          @click="$refs.dialogSave.handleOpen(null,'add')"
        >创建角色</el-button>
      </div>
      <div class="role-nav-box">
        <div
          v-for="item in role"
          :key="item.id"
          :class="[{'is-select': item.id === select_key || item.id === hover_key},'menu-item']"
          @click="e =>{
            handleChange(item)
          }"
          @mouseenter="$event =>{
            hover_key = item.id
          }"
          @mouseleave="$event =>{
            hover_key = ''
          }"
        >
          {{ item.name }}
          <span
            v-show="item.id === hover_key"
            class="icon-close"
          >
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="$refs.dialogSave.handleOpen(item,'update')"> 编 辑 </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="deloRole(item)">删 除</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </div>
    </div>
    <div class="content-box">
      <div style="padding-left: 10px;">
        <DmAlert v-show="select_key">
          <el-form
            :model="options.info"
            label-width="70px"
            label-position="left"
          >
            <el-form-item
              label="角色名称"
              class="item-box"
            >{{ options.info.name }}【{{ options.info.id }}】</el-form-item>
            <el-form-item
              label="角色状态"
              class="item-box"
            >{{ options.info.status === '1' ? '启用' : '禁用' }}</el-form-item>
          </el-form>
        </DmAlert>
        <DmTabs
          :tabs="options.tabs"
          :value="active"
          idref="tabs"
          class="tabs"
          layout="tabs"
          @init="(e) =>{
            active = e
            changeTabs(active)
          }"
        />
      </div>
      <User
        v-show="active === 'user'"
        ref="user"
        :role="select_key"
        :role_name="select_name"
      />
      <Role
        v-show="active === 'role'"
        ref="role"
        :role="select_key"
        :role_name="select_name"
      />
    </div>
    <DialogSave ref="dialogSave" @on-success="getRole()" />
  </div>
</template>
<script>
import DialogSave from './Dialog/DialogSave'
import User from './user'
import Role from './role'
export default {
  components: {
    DialogSave, User, Role
  },
  data() {
    return {
      role: [],
      select_key: '',
      select_name: '',
      hover_key: '',
      active: 'user',
      options: {
        tabs: [
          { label: '角色员工', value: 'user' },
          { label: '角色权限', value: 'role' }
        ],
        info: {}
      }
    }
  },
  mounted() {
    this.getRole()
  },
  methods: {
    async getRole(params = { page: 1, per_page: 100 }) {
      try {
        const data = await this.Fetch.get('/V4/rbac.role.getList', params)
        this.role = data.list || []
        if (data.list.length) {
          this.select_key = data.list[0].id
          this.select_name = data.list[0].name
          this.info()
          setTimeout(() => { this.changeTabs(this.active) }, 200)
        }
      } catch (error) {
        return
      }
    },

    async info(params = { id: this.select_key }) {
      try {
        const data = await this.Fetch.get('/V4/rbac.role.getList', params)
        if (data.list && Array.isArray(data.list) && data.list[0]) {
          this.options.info = data.list[0]
        }
      } catch (error) {
        return
      }
    },

    deloRole(data) {
      this.$confirm('此操作将永久删除角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        duration: 1500
      }).then(async() => {
        try {
          await this.Fetch.delete('/V4/rbac.role.del', { id: data.id })
          this.Message('ACTION_SUCCESS')
          await this.getRole()
        } catch (error) {
          return
        }
      })
    },

    handleChange(data) {
      this.select_key = data.id
      this.select_name = data.name
      this.info()
      setTimeout(() => { this.changeTabs(this.active) }, 500)
    },

    changeTabs(type) {
      if (!type || !type && this.$refs[type]) return
      this.$refs[type].init({
        role: this.select_key,
        role_name: this.select_name
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>
