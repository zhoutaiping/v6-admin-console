<style lang="scss" scoped>
.menu-box {
  width: 100%;
  padding: 5px;
  display: inline-grid;
  grid-template-columns: 300px auto;
  // grid-template-rows: minmax(200px, 500px);
  grid-column-gap: 10px;
}
.border-box {
  border: 1px solid #f5f5f5;
  padding: 5px;
}
</style>
<template>
  <div>
    <div class="menu-box">
      <div class="border-box">
        <el-divider content-position="left">标签类别</el-divider>
        <el-tree
          ref="treeType"
          :data="Tags"
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
            <span style="margin:0 5px;">
              <el-tag
                v-if="Number(data.must) === 1"
                type="success"
                size="mini"
              >必选</el-tag>
            </span>
          </span>
        </el-tree>

      </div>
      <div class="border-box">
        <DmScroll>
          <el-divider content-position="left">{{ clickNode.label }}标签</el-divider>
          <div
            v-if="clickNode && clickNode.item && clickNode.item.length"
            style="min-height: 200px;max-height: 600px;"
          >
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
            暂无标签
          </div>
        </DmScroll>
      </div>
    </div>
    <div
      v-if="Object.keys(tag_model).length"
      style="padding: 5px;"
    >
      <el-divider content-position="left">已选标签</el-divider>
      <div
        v-for="(type, index) in Object.keys(tag_model)"
        :key="index"
      >
        <div
          v-show="tag_model[type] && tag_model[type].length"
          class="border-box "
          style="margin:2px; display:block;"
        >
          <span style="max-width:150px;">
            {{ Tags.filter(i => i.value === type).length ? Tags.filter(i => i.value === type)[0].label : '' }}
          </span>
          <span
            v-for="item in tag_model[type].slice(0, 5)"
            :key="item.tag_id"
          >
            <el-tag style="margin:2px;">{{ item.label }}</el-tag>
          </span>

          <a-popover
            v-show="Object.keys(tag_model).length && tag_model[type] && tag_model[type].length > 5"
            :overlay-style="{ width: '300px' }"
            :title="Tags.filter(i => i.value === type).length ? Tags.filter(i => i.value === type)[0].label : ''"
            trigger="hover"
          >
            <template slot="content">
              <el-tag
                v-for="(tag, index) in tag_model[type]"
                :key="index"
                size="mini"
                style="margin:2px;"
              >
                {{ tag.label }}
              </el-tag>
            </template>
            <i
              class="el-icon-info primar-color"
              style="margin:2px; font-size:12px;"
            >更多</i>
          </a-popover>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import initMixins from './mixins'
export default {
  components: {},
  mixins: [initMixins],
  props: {
    filter: {
      type: Array,
      default: () => []
    }
  }
}
</script>
