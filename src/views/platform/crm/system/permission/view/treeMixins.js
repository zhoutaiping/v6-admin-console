import menuTree from './menuTree'
export default {
  data() {
    return {
      resourceList: [],
      MenuList: [],
      resource: [],
      loading: false,
      STATUS: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      PLAT: [
        { label: 'adminV5Api', value: 'adminV5Api' },
        { label: 'apiV4', value: 'apiV4' }
      ],

      TYPE: [
        { label: '导航', value: 'nav' },
        { label: '菜单', value: 'menu' },
        { label: '功能', value: 'op' }
      ],
      ROUTER_TYPE: [
        { label: '静态', value: 1 },
        { label: '动态', value: 2 }
      ],
      ROUTER_TYPE_FB: [
        { label: '前端', value: 1 },
        { label: '后端', value: 2 }
      ],
      METHOD: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
        { label: '其他', value: '' }
      ]
    }
  },

  methods: {
    async getResource() {
      const params = {
        page: 1,
        per_page: 9999
      }
      this.loading = true
      try {
        const data = await this.InvokeAllApi.get(
          '/V4/rbac.resource.getList',
          params
        )
        const list = data.list
        this.resourceList = this.getGroupList(list)
        this.MenuList = this.getGroupList(list, 'op')
        this.resource = list
        if (this.checkId !== '') this.setCheckForm()
      } catch (error) {
        this.resource = []
        return
      }
      setTimeout(() => {
        this.loading = false
      }, 500)
    },

    setCheckForm(id = this.checkId) {
      const checkForm = this.resource.filter(
        i => Number(i.id) === Number(this.checkId)
      )
      if (checkForm.length) {
        const check = checkForm[0]
        check.Children = this.resource.filter(
          i => Number(i.pid) === Number(check.id)
        )
        this.checkForm = check
      } else {
        this.checkForm = {}
      }
    },

    handleDel(data) {
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const params = {
          id: data.id
        }
        try {
          await this.InvokeAllApi.delete('/V4/rbac.resource.del', params)
          this.$emit('init')
          this.Message('ACTION_SUCCESS')
        } catch (error) {
          return
        }
      })
    },

    getGroupList(list, filert_key) {
      const group = [] // 分组
      let groupList = [] // 分组List
      let arr = JSON.parse(JSON.stringify(list))
      if (filert_key) {
        arr = arr.filter(_ => _.type !== filert_key)
      }
      arr.forEach(_ => {
        if (_.pid === '0' && group.indexOf(_.id) < 0) {
          group.push(_.id)
          _.Children = []
          groupList.push(_)
        }
      })

      if (groupList.length) {
        groupList = menuTree.filterAsyncRouter(groupList, arr)
      }
      return groupList
    }
  }
}
