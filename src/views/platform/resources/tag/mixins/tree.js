import Vue from 'vue'
export default {
  data: () => ({
    tableListData: [], // tableListData 展示数据的data
    foldList: [],
    tagTree: [],
    filterText: '',
    checkId: '',
    checkForm: {}
  }),
  computed: {
    /** *******************************
     ** Intro: 记录属性结构的首层节点
     *********************************/
    foldAllList() {
      return this.tableListData.map(x => x.__identity)
    }
  },
  watch: {
    is_expand(val) {
      this.foldList = Number(val) === 2 ? this.foldAllList : []
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // 测试数据 data
  },
  methods: {
    filterNode(value, data) {
      if (!value && !this.$refs.tree) return true
      return data.label.indexOf(value) !== -1
    },

    handleNodeClick(data) {
      this.checkId = data.value
      this.checkForm = Object.assign(data, {})
    },
    /** *******************************
     ** Fn: toggleFoldingStatus
     ** Intro: 切换展开 还是折叠
     ** @params: params 当前点击行的数据
     *********************************/
    toggleFoldingStatus(params) {
      this.foldList.includes(params.__identity)
        ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1)
        : this.foldList.push(params.__identity)
    },
    /** *******************************
     ** Fn: toggleDisplayTr
     ** Intro: 该方法会对每一行数据都做判断 如果foldList 列表中的元素 也存在与当前行的 __family列表中  则该行不展示
     *********************************/
    toggleDisplayTr({ row, index }) {
      for (let i = 0; i < this.foldList.length; i++) {
        const item = this.foldList[i]
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        if (row.__family.includes(item) && row.__identity !== item) {
          return 'none-box'
        }
      }
      return ''
    },
    /** *******************************
     ** Fn: toggleFoldingClass
     ** Intro: 如果子集长度为0，则不返回字体图标。
     ** Intro: 如果子集长度为不为0，根据foldList是否存在当前节点的标识返回相应的折叠或展开图标
     ** Intro: 关于class说明：permission_placeholder返回一个占位符，具体查看class
     ** @params: params 当前行的数据对象
     *********************************/
    toggleFoldingClass(params) {
      return params.Children.length === 0
        ? 'permission_placeholder'
        : this.foldList.indexOf(params.__identity) === -1
          ? 'iconfont icon-minus-square-o'
          : 'iconfont icon-plussquareo'
    },
    /** *******************************
     ** Fn: formatConversion
     ** Intro: 将树形接口数据扁平化
     ** @params: parent 为当前累计的数组  也是最后返回的数组
     ** @params: children 为当前节点仍需继续扁平子节点的数据
     ** @params: index 默认等于0， 用于在递归中进行累计叠加 用于层级标识
     ** @params: family 装有当前包含元素自身的所有父级 身份标识
     ** @params: elderIdentity 父级的  唯一身份标识
     *********************************/
    formatConversion(
      parent,
      children,
      index = 0,
      family = [],
      elderIdentity = 'x'
    ) {
      // children如果长度等于0，则代表已经到了最低层
      // let page = (this.startPage - 1) * 10
      if (children.length > 0) {
        children.map((x, i) => {
          // 设置 __level 标志位 用于展示区分层级
          Vue.set(x, '__level', index)
          // 设置 __family 为家族关系 为所有父级，包含本身在内
          Vue.set(x, '__family', [...family, elderIdentity + '_' + i])
          // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
          Vue.set(x, '__identity', elderIdentity + '_' + i)
          parent.push(x)
          // 如果仍有子集，则进行递归
          if (x.Children.length > 0) {
            this.formatConversion(
              parent,
              x.Children,
              index + 1,
              [...family, elderIdentity + '_' + i],
              elderIdentity + '_' + i
            )
          }
        })
      }
      return parent
    },

    formartTree(data) {
      const tags = []
      let index = 0
      Object.keys(data).forEach(i => {
        if (data[i] && Object.keys(data[i]).length > 0) {
          const key = 'tag' + index
          const type = data[i].type
          index++
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
      this.tagTree = tags
      this.tableListData = this.formatConversion([], tags)
    },

    getTagTreeList(data, type) {
      const arr = []
      Object.keys(data).forEach(i => {
        if (Object.keys(data[i]).length && data[i]) {
          data[i].label = data[i].tag
          data[i].value = data[i].id
          data[i].ID = data[i].id
          data[i].PId = i.pid
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
    }
  }
}
