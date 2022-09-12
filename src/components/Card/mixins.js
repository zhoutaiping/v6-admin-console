function setTagTree(data) {
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
          item: data[i].tags
            ? getTagTreeNext(
              data[i].tags,
              1,
              data[i].type.allow_more,
              data[i].type.ukey
            )
            : []
        }
        if (item.item.length) {
          TagList.push(item)
        }
      }
    })
  }
  return TagList
}
function getTagTreeNext(data, index, allow_more, type_ukey) {
  const arr = []
  Object.keys(data).forEach(i => {
    if (Object.keys(data[i]).length && data[i]) {
      let disp_share = 0
      const key = data[i].tag_tkey + '_' + index
      if (
        Object.keys(data[i].attrs).length &&
        data[i].attrs.disp_share &&
        Number(data[i].attrs.disp_share) === 1
      ) {
        disp_share = 1
      }
      data[i].label = data[i].tag
      data[i].value = data[i].tag_id
      data[i].level = index
      data[i].model = key
      data[i].nodelevel = 'tag'
      data[i].type_ukey = type_ukey
      data[i].allow_more = allow_more
      data[i].item = []
      data[i].disp_share = disp_share
      if (Object.keys(data[i].childs).length && data[i].childs) {
        data[i].item = getTagTreeNext(
          data[i].childs,
          index + 1,
          allow_more,
          type_ukey
        )
      }
      arr.push(data[i])
    }
  })
  return arr
}
const l_array = require('lodash/array')
export default {
  data() {
    return {
      Tags: [],
      clickNode: {},
      defaultProps: {
        label: 'label'
      },
      defaultItemProps: {
        children: 'item',
        label: 'label',
        value: 'tag_id'
      },
      sel_tags: [],
      half_Tags: [],

      tag_model: {}
    }
  },
  destroyed() {
    this.Tags = []
  },
  methods: {
    async getTags(params = {}) {
      const data = await this.InvokeDispApi.get('/tag/tree', params)
      this.Tags = setTagTree(data)
      if (this.filter && this.filter.length) {
        this.Tags = this.Tags.filter(i => this.filter.indexOf(i.value) > -1)
      }
      this.clickNode = this.Tags[0]
    },

    async setInit(defalut_sel) {
      if (this.$refs.Tagtree) this.$refs.Tagtree.setCheckedKeys([])
      this.sel_tags = []
      this.half_Tags = []
      this.tag_model = {}
      await this.getTags()
      await this.setModel(defalut_sel)
    },

    setModel(defalut_sel) {
      this.Tags.forEach(_ => {
        this.$set(this.tag_model, _.value, [])
        if (_.item.length) this.setDefalutSelMode(_.item, defalut_sel)
      })
      if (this.$refs.Tagtree) this.$refs.Tagtree.setCheckedKeys(this.sel_tags)
    },

    setDefalutSelMode(list, defalut_sel) {
      list.forEach(_ => {
        if (defalut_sel.indexOf(_.tag_id.toString()) > -1) {
          this.tag_model[_.type_ukey] = [
            ...new Set(l_array.concat(this.tag_model[_.type_ukey], [_]))
          ]
          if (_.item.length === 0) {
            this.sel_tags = [
              ...new Set(l_array.concat(this.sel_tags, [_.tag_id]))
            ]
          } else {
            this.half_Tags = [
              ...new Set(l_array.concat(this.half_Tags, [_.tag_id]))
            ]
          }
        }
        if (_.item.length) {
          this.setDefalutSelMode(_.item, defalut_sel)
        }
      })
    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    nodeClick(data, node, el) {
      this.clickNode = data
      if (this.$refs.Tagtree) this.$refs.Tagtree.setCheckedKeys(this.sel_tags)
    },

    checkChange(data, tag_val, next_value) {
      const sel_tag = this.$refs.Tagtree.getCheckedNodes().map(i => i.tag_id) // 选择的ID
      const half_tag = this.$refs.Tagtree.getHalfCheckedNodes().map(
        i => i.tag_id
      ) // 半选择

      this.sel_tags = [...new Set(l_array.concat(this.sel_tags, sel_tag))]
      this.half_Tags = [...new Set(l_array.concat(this.half_Tags, half_tag))]
      if (!tag_val) this.sel_tags = this.sel_tags.filter(i => i !== data.tag_id) // 未选择过滤

      this.tag_model[data.type_ukey] = l_array.concat(
        this.$refs.Tagtree.getCheckedNodes(),
        this.$refs.Tagtree.getHalfCheckedNodes()
      )
    },

    getSel() {
      let status = true
      if (this.filter.indexOf('yumingbeian') > -1 && this.tag_model['yumingbeian'] && this.tag_model['yumingbeian'].length > 1) {
        this.message.warning('域名备案只能选择一个标签')
        status = false
      }
      for (let i = 0; i < this.Tags.length; i++) {
        if (
          Number(this.Tags[i].must) === 1 &&
          this.tag_model[this.Tags[i].value].length === 0
        ) {
          this.message.warning(this.Tags[i].label + '必选!')
          status = false
          break
        }
      }
      if (status) {
        return l_array.concat(this.sel_tags, this.half_Tags)
      } else {
        return []
      }
    }
  }
}
