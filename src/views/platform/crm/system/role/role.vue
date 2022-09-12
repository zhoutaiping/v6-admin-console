<style lang="scss" scoped>
@import url('./style.scss');
</style>
<template>
  <console-page-layout style="padding:0 12px;">
    <el-row :gutter="12">
      <el-col :span="12">
        <div class="tree__hd">
          权限列表 {{ list.length }}
        </div>
        <v-jstree
          v-loading="loading"
          ref="tree_menu"
          :data="data"
          show-checkbox
          multiple
          allow-batch
          allow-transition
          whole-row
          class="tree_menu"
        >
          <template slot-scope="_">
            <div style="display: inherit; width: 100%">
              {{ _.model.name }}
            </div>
          </template>
        </v-jstree>
      </el-col>
      <el-col :span="12">
        <div class="tree__hd">
          已选择权限列表
        </div>
        <v-jstree
          v-loading="loading"
          :data="checkData"
          multiple
          allow-batch
          allow-transition
          whole-row
          class="tree_menu"
        >
          <template slot-scope="_">
            <div style="display: inherit; width: 100%">
              {{ _.model.name }}
            </div>
          </template>
        </v-jstree>
      </el-col>
    </el-row>

    <div v-show="data.length && form.role" class="submit-box" >
      <el-button type="primary" @click="e =>{handleSubmit()}" >保 存</el-button>
    </div>
  </console-page-layout>
</template>
<script>
import menuTree from '@/utils/menuTree'
import VJstree from 'vue-jstree'
export default {
  components: { VJstree },
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
    const tree = {
      check_ids: (list = [], check = []) => {
        list.forEach(e => {
          if (e.selected === true) {
            check.push(e.id)
          }
          if (e.children.length) tree.check_ids(e.children, check)
        })
        return check
      },
      group: (Arr) => {
        const group = [] // 分组
        let groupList = [] // 分组List
        Arr.forEach(list => {
          if (list.pid === '0' && group.indexOf(list.id) < 0) {
            group.push(list.id)
            list.children = []
            groupList.push(list)
          }
        })
        if (groupList.length) groupList = menuTree.filterAsyncRouter(groupList, Arr)
        return groupList
      },
      change_checked_nodes: (list = [], check = []) => {
        list.forEach(e => {
          check.push({
            id: e.id,
            checked: e.selected
          })
          if (e.children.length) tree.change_checked_nodes(e.children, check)
        })
        return check
      }
    }
    return {
      loading: false,
      data: [],
      list: [],
      form: {},
      roleCheck: [],
      tree: tree,
      checkData: []
    }
  },

  watch: {
    data: {
      handler(val) {
        let check = this.tree.check_ids(val)
        check = this.list.filter(i => check.includes(i.id))
        this.checkData = this.tree.group(JSON.parse(JSON.stringify(check)))
      },
      deep: true
    }
  },

  methods: {
    init(data = {}) {
      this.form = Object.assign({}, data)
      this.roleCheck = []
      this.loading = true
      if (this.role) {
        this.resourceRole()
        setTimeout(() => { this.resource() }, 1000)
      }
    },

    async resourceRole(params = { 'role_id': this.form.role || this.role, 'page': 1, 'per_page': 9999, 'pagesize': 9999 }) {
      try {
        const data = await this.Fetch.get('/V4/rbac.role.resource.getList', params)
        if (data && data.list && data.list.length) {
          this.roleCheck = (data.list).map(i => { return i.resource_id })
        }
      } catch (e) {
        return
      }
    },

    async resource() {
      try {
        const data = await this.Fetch.get('/V4/rbac.resource.getList', { page: 1, per_page: 9999 })
        const list = data.list && data.list.length ? data.list : []
        list.forEach(e => {
          const is_find = this.roleCheck.includes(e.id)
          e.selected = is_find
          e.opened = true
          e.loading = false
          e.disabled = false
        })
        const tree = this.tree.group(list)
        this.data = tree
        this.list = list
        this.loading = false
      } catch (error) {
        this.loading = false
        return
      }
    },

    async handleSubmit() {
      const params = {
        role_id: this.form.role,
        change_checked_nodes: this.tree.change_checked_nodes(this.data)
      }
      try {
        await this.Fetch.put('/V4/rbac.role.resource.update', params)
        this.Message('ACTION_SUCCESS')
        await this.init(this.form)
      } catch (error) {
        return
      }
    }
  }
}
</script>
