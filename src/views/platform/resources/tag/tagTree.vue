<template>
  <div id="app">
    <el-table
      ref="treeTable"
      :data="tableListData"
      :row-class-name="toggleDisplayTr"
      border
      class="init_table"
      @selection-change="changeSel"
    >
      <el-table-column
        align="center"
        width="75"
        prop="id"
        label="ID"
      />
      <el-table-column
        label="标签"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <p :style="`margin-left: ${scope.row.__level * 20}px;margin-top:0;margin-bottom:0`"><i
            :class="toggleFoldingClass(scope.row)"
            class="permission_toggleFold"
            @click="toggleFoldingStatus(scope.row)"
          />{{ scope.row.label }}</p>
        </template>
      </el-table-column>
      <el-table-column label="关联标签">
        <template slot-scope="scope">
          <span v-if="scope.row.relate_tags && Object.keys(scope.row.relate_tags).length">
            {{ scope.row.relate_tags[Object.keys(scope.row.relate_tags)[0]] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="属性">
        <template slot-scope="scope">
          <span v-if="scope.row.property && scope.row.property.length">
            {{ scope.row.property.join(',') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="150"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="Number(scope.row.status) === 1"
            type="success"
          >启用</el-tag>
          <el-tag
            v-if="Number(scope.row.status) === 0"
            type="success"
          >禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
      />
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.nodelevel === 'tag'">
            <a class="color--primary op-btn" @click="$emit('handleEdit', 'edit', scope.row)">编辑</a>
            <el-divider direction="vertical"/>
            <a class="color--primary op-btn" @click="$emit('handleAddNextTag', 'next', scope.row)">新增子标签</a>
            <el-divider direction="vertical"/>
            <a class="color--primary op-btn" @click="$emit('handleDel', 'del', scope.row)">删除</a>
          </div>
          <div v-else-if="scope.row.nodelevel === 'type'">
            <a class="color--primary op-btn" @click="$emit('handleAddTag', 'Add',scope.row)">新增标签</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    is_expand: {
      type: String,
      default: () => '1'
    }
  },
  data: () => ({
    foldList: [], // 该数组中的值 都会在列表中进行隐藏  死亡名单
    selRow: []
  }),
  computed: {
    /** *******************************
     ** Fn: foldAllList
     ** Intro: 记录属性结构的首层节点
     ** Author: zyx
     *********************************/
    foldAllList() {
      return this.tableListData.map(x => x.__identity)
    },
    tableListData() { // tableListData 展示数据的data
      const list = JSON.parse(JSON.stringify(this.formatConversion([], this.data))) || []
      return list
    }
  },
  watch: {
    is_expand(val) {
      // foldList = foldAllList
      this.foldList = Number(val) === 2 ? this.foldAllList : []
    }
  },
  methods: {
    /** *******************************
      ** Fn: toggleFoldingStatus
      ** Intro: 切换展开 还是折叠
      ** @params: params 当前点击行的数据
    *********************************/
    toggleFoldingStatus(params) {
      this.foldList.includes(params.__identity) ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1) : this.foldList.push(params.__identity)
    },
    /** *******************************
    ** Fn: toggleDisplayTr
    ** Intro: 该方法会对每一行数据都做判断 如果foldList 列表中的元素 也存在与当前行的 __family列表中  则该行不展示
    ** @params:
    ** Author: zyx
  *********************************/
    toggleDisplayTr({ row, index }) {
      for (let i = 0; i < this.foldList.length; i++) {
        const item = this.foldList[i]
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        if (row.__family.includes(item) && row.__identity !== item) return 'none-box'
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
      return params.Children.length === 0 ? 'permission_placeholder' : (this.foldList.indexOf(params.__identity) === -1 ? 'iconfont icon-minus-square-o' : 'iconfont icon-plussquareo')
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
    formatConversion(parent, children, index = 0, family = [], elderIdentity = 'x') {
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
          if (x.Children.length > 0) this.formatConversion(parent, x.Children, index + 1, [...family, elderIdentity + '_' + i], elderIdentity + '_' + i)
        })
      } return parent
    },
    selectable(row) {
      return row.nodelevel !== 'type'
    },
    changeSel(val) {
      // this.$emit('changeline', val)
    },
    selectRow(selRow) {
      this.tableListData.forEach(i => {
        if (selRow.indexOf((i.id).toString()) > -1) {
          this.$refs.treeTable.toggleRowSelection(i)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.none-box {
  display: none !important;
}
</style>
<style lang='scss' rel='stylesheet/stylus' scoped>
.treeBtn {
  width: 100%;
  margin: 2px;
}
.permission_toggleFold {
  vertical-align: middle;
  padding-right: 5px;
  font-size: 16px;
  cursor: pointer;
}
.permission_placeholder {
  content: " ";
  display: inline-block;
  width: 16px;
  font-size: 16px;
}
.init_table {
  margin: 0 auto !important;
}
</style>
