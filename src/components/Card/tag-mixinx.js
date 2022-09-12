export default {
  methods: {
    async getTagList(params = {}) {
      this.loading = true
      try {
        const data = await this.InvokeDispApi.get('/tag/tree', params)
        const TagList = []
        if (data && Object.keys(data).length) {
          Object.keys(data).forEach(i => {
            if (data[i]) {
              const item = {
                label: data[i].type.name,
                value: data[i].type.ukey,
                must: data[i].type.must || 0,
                allow_more: data[i].type.allow_more || 0,
                nodelevel: 'type',
                item: data[i].tags ? this.getTagTree(data[i].tags, 1, data[i].type.allow_more) : []
              }
              if (item.item.length) {
                TagList.push(item)
                this.$set(this.typeModel, item.value, [])
              }
            }
          })
        }
        this.TagList = TagList
        this.clickNode = TagList[0] && { item: [] }
      } catch (error) {
        // console.log(1)
      }
      setTimeout(() => { this.loading = false }, 1000)
    },

    getTagTree(data, index, allow_more) {
      const arr = []
      Object.keys(data).forEach(i => {
        if (Object.keys(data[i]).length && data[i]) {
          let disp_share = 0
          const key = data[i].tag_tkey + '_' + index
          if (Object.keys(data[i].attrs).length && data[i].attrs.disp_share && Number(data[i].attrs.disp_share) === 1) disp_share = 1
          data[i].label = data[i].tag
          data[i].value = data[i].tag_id
          data[i].level = index
          data[i].model = key
          data[i].nodelevel = 'tag'
          data[i].allow_more = allow_more
          data[i].item = []
          data[i].disp_share = disp_share
          if (Object.keys(data[i].childs).length && data[i].childs) data[i].item = this.getTagTree(data[i].childs, (index + 1), allow_more)
          arr.push(data[i])
          this.$set(this.clickModel, key, [])
        }
      })
      return arr
    }
  }
}
