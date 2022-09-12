export default {
  data: () => ({
    linkTag: {}
  }),
  created() {
    this.bandtype()
  },
  methods: {
    async initType() {
      this.loading_2 = true
      await this.InvokeTagApi.get('/tag_type/list', {
        page: 1,
        pagesize: 100
      }).then(res => {
        const TYPE = []
        const list = JSON.parse(JSON.stringify(res.list))
        const TYPE_UKEY = JSON.parse(JSON.stringify(res.list))
        this.TYPE_UKEY = TYPE_UKEY || []
        list.forEach(i => {
          TYPE.push({ label: i.name, value: i.ukey })
        })
        this.tag_type = list
        this.TYPE = TYPE
      })
      setTimeout(() => {
        this.loading_2 = false
      }, 500)
    },

    async initTagTree() {
      this.loading = true
      const params = { type_ukey: this.search.type_ukey }
      await this.InvokeTagApi.get('/tag/tree', params).then(res => {
        const data = JSON.parse(JSON.stringify(res))
        this.TagTree = this.formartTree(data)
      })
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },

    delte(params) {
      this.InvokeTagApi.get('/tag/delete', params).then(res => {
        this.Message('ACTION_SUCCESS')
        this.initTagTree()
      })
    },

    openWin(data, type, ref) {
      if (this.$refs[ref]) this.$refs[ref].handleOpen(type, data, this.tag_type)
    },

    formartTree(data) {
      const tags = []
      let index = 0
      Object.keys(data).forEach(i => {
        if (Object.keys(data[i]).length && data[i]) {
          const key = 'tag' + index
          index = index + 1
          const type = data[i].type
          tags.push({
            label: data[i].type.name,
            value: data[i].type.ukey,
            apply_scope: data[i].type.apply_scope,
            key: key,
            nodelevel: 'type',
            Children: this.getTagTreeList(data[i].tags, type)
          })
        }
      })
      return tags
    },

    getTagTreeList(data, type) {
      const arr = []
      Object.keys(data).forEach(i => {
        if (Object.keys(data[i]).length && data[i]) {
          data[i].label = data[i].tag
          data[i].value = data[i].tag_id
          data[i].ID = data[i].id
          data[i].PId = data[i].pid
          data[i].nodelevel = 'tag'
          data[i].property = this.getProperty(data[i].attrs, type)
          data[i].Children = []
          if (Object.keys(data[i].childs).length && data[i].childs) {
            data[i].Children = this.getTagTreeList(data[i].childs, type)
          }
          arr.push(data[i])
        }
      })
      return arr
    },
    getProperty(arrts, type) {
      const list = []
      if (arrts && Object.keys(arrts).length > 0) {
        Object.keys(arrts).forEach(_ => {
          if (type && type.attrs && type.attrs[_]) {
            list.push(type.attrs[_].name)
          }
        })
      }
      return list
    },
    async bandtype(params = { type_ukey: 'yonghuxinyu' }) {
      await this.InvokeTagApi.get('/tag/tree', params).then(res => {
        this.linkTag = res
      })
    }
  }
}
