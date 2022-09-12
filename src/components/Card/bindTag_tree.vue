                                                                          <style lang="scss" scoped>
.form-item {
  margin-bottom: 0;
}
</style>

<template>
  <div>
    <el-container style="padding:5px;height:auto">
      <el-aside
        width="200px"
        style="border: 1px solid #eee;"
      >
        <el-form
          size="mini"
          style="padding:5px;"
        >
          <el-form-item
            label=""
            class="form-item"
          >
            <el-input
              v-model="filterText"
              clearable
              placeholder="输入关键字进行过滤"
            />
          </el-form-item>
          <el-button @click="init(selTagList)">刷新</el-button>
          <el-tree
            v-loading="loading"
            ref="treeType"
            :data="TagList"
            :props="defaultProps"
            :filter-node-method="filterNode"
            default-expand-all
            class="filter-tree"
            @node-click="nodeClick"
          >
            <span
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <span>{{ node.label }}</span>
              <el-tag
                v-if="Number(data.must) === 1"
                type="success"
                size="mini"
              >必选</el-tag>
            </span>
          </el-tree>
        </el-form>
      </el-aside>
      <el-main style="padding:5px; border: 1px solid #eee; margin-left:5px;">
        <CardLayout
          v-if="clickNode.item && clickNode.item.length"
          :title="clickNode.label"
        >
          <div slot="layout">
            <div v-if="clickNode.item.length">
              <el-tree
                ref="Tagtree"
                :data="clickNode.item"
                :props="defaultItemProps"
                show-checkbox
                default-expand-all
                node-key="tag_id"
                highlight-current
                @check-change="checkChange"
              />
            </div>
            <div v-else>
              <el-tag type="warning">暂无标签</el-tag>
            </div>
          </div>
        </CardLayout>
        <CardLayout
          v-if="checkTagList.length"
          title="已选择标签"
        >
          <div
            v-loading="check"
            slot="layout"
          >
            <div
              v-for="(item, index) in Object.keys(typeModel)"
              :key="index"
              style="min-height:0px;"
            >
              <template v-if="typeModel[item].length > 0">
                <h4 style="display: inline-block; margin:2px;">
                  <el-tag size="mini">{{ TagList.filter(i => i.value === item).length ? TagList.filter(i => i.value === item)[0].label : '' }}</el-tag>
                </h4>
                <div
                  v-if="Array.isArray(typeModel[item])"
                  style="display: inline-block;"
                >
                  <el-tag
                    v-for="(id, k_index) in typeModel[item]"
                    :key="k_index"
                    type="warning"
                    size="mini"
                    style="margin-left:2px;"
                  >
                    {{ checkTagList.filter(i => i.tag_id === Number(id)).length ? checkTagList.filter(i => i.tag_id === Number(id))[0].tag : '' }}
                  </el-tag>
                </div>
              </template>
            </div>
          </div>
        </CardLayout>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { throttle } from 'throttle-debounce'
import tagMixinx from './tag-mixinx'
export default {
  mixins: [tagMixinx],
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      TagType: [],
      TagList: [],
      form: {

      },
      filterText: '',
      defaultProps: {
        label: 'label'
      },
      defaultItemProps: {
        children: 'item',
        label: 'label',
        value: 'tag_id'
      },
      clickNode: { item: [] },
      typeModel: {},
      clickModel: {},
      checkTagList: [],
      check: false,
      selTagList: [],
      treeCheck: []
    }
  },
  watch: {
    filterText(val) {
      throttle(1000, this.$refs.treeType.filter(val))
    }
  },
  methods: {
    async init(select) {
      this.typeModel = {}
      this.clickModel = {}
      this.clickNode = { item: [] }
      this.checkTagList = []
      const getTag = this.getTagList()
      await getTag
      this.selTagList = select
      if (select.length) {
        setTimeout(() => {
          this.$refs.Tagtree.setCheckedKeys(this.selTagList)
        }, 200)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterValue() {
      this.$refs.treeType.filter(this.filterText)
    },
    nodeClick(data, node, el) {
      this.clickNode = data
      this.$refs.Tagtree.setCheckedKeys(this.selTagList)
    },
    getCheckTagId() {
      return this.selTagList
    },
    cleanTag(key, value, type) {
      const tag = this.checkTagList.filter(i => Number(i.tag_id) === Number(value))
      if (tag.length && tag[0]) {
        const clean_tag = tag[0]
        this.clickModel[clean_tag.model] = this.clickModel[clean_tag.model].filter(i => Number(i) !== Number(clean_tag.tag_id))
      }
      const arr = JSON.parse(JSON.stringify(this.typeModel[key])) || []
      const newArr = arr.filter(i => Number(i) !== Number(value))
      this.checkTagList = this.checkTagList.filter(i => Number(i.tag_id) !== Number(value))
      this.typeModel[key] = newArr
    },
    checkChange(data, tag_val, next_value) {
      const l_array = require('lodash/array')
      const List = JSON.parse(JSON.stringify(this.$refs.Tagtree.getCheckedNodes()))
      const Half = this.$refs.Tagtree.getHalfCheckedNodes()
      if (List.length) {
        const ids = []
        List.forEach(i => {
          ids.push(i.tag_id)
        })
        this.typeModel[List[0].tag_tkey] = l_array.concat(ids, [])
      } else {
        this.typeModel[this.clickNode.item[0].tag_tkey] = []
      }
      let selTagList = []
      Object.keys(this.typeModel).forEach(i => {
        const ids = this.typeModel[i]
        selTagList = l_array.concat(selTagList, ids)
      })
      this.selTagList = [... new Set(selTagList)]
      const checkTagList = this.checkTagList
      this.checkTagList = [... new Set(l_array.concat(checkTagList, List, Half))]
    }
  }
}
</script>
