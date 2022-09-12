<style lang="scss" scoped>
.menu-box {
  width: 100%;
  padding: 5px;
  display: inline-grid;
  grid-template-columns: 350px auto;
  // grid-template-rows: calc(100vh - 165px);
  grid-column-gap: 10px;
}
.border-box {
  border: 1px solid #f5f5f5;
}
.input-box {
  width: 200px;
  margin: 0 2px;
}
.filter-tree {
  padding: 10px;
  height: calc(100vh - 205px);
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
<template>
  <div class="menu-box">
    <div class="border-box ">
      <DmScroll>
        <el-divider content-position="left">资源列表</el-divider>
        <div style="display:flex">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            class="input-box"
          />
          <el-button
            :disabled="loading"
            type="primary"
            @click="getResource"
          >刷新</el-button>
          <el-button
            type="primary"
            @click="addNode"
          >新增</el-button>
        </div>
        <el-tree
          v-loading="loading"
          ref="tree"
          :data="resourceList"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :default-expanded-keys="[checkId]"
          node-key="id"
          class="filter-tree"
          @node-click="handleNodeClick"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <span>
              <svg-icon
                v-if="data.type === 'nav'"
                icon-class="tree"
              />
              <svg-icon
                v-if="data.type === 'menu'"
                icon-class="tab"
              />
              <svg-icon
                v-if="data.type === 'op'"
                icon-class="documentation"
              />
              {{ node.label }}</span>
          </span>
        </el-tree>
      </DmScroll>
    </div>
    <div class="border-box ">
      <el-divider
        v-show="checkForm.id"
        content-position="left"
      >{{ checkForm.name }}</el-divider>
      <Resource
        v-show="checkForm.id !==''"
        ref="resource"
        :menu="MenuList"
        :type="type"
        :check-form="checkForm"
        @init="getResource"
      />
      <Children
        v-show="checkForm.id && checkForm.type !=='op'"
        ref="children"
        :check-form="checkForm"
        @init="getResource"
      />
    </div>
    <dialog-save
      ref="dialogSave"
      @on-success="getResource"
    />
  </div>
</template>
<script>
import treeMixins from './treeMixins'
import Resource from './components/resource'
import Children from './components/children'
import DialogSave from './Dialog/dialogSave'
export default {
  components: { Resource, Children, DialogSave },
  mixins: [treeMixins],
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'Children',
        label: 'name'
      },
      type: 'update',
      checkId: '',
      checkForm: {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  async created() {
    this.getResource()
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    addNode(node, data) {
      this.checkId = 0
      this.checkForm = {
        id: 0,
        name: '新增资源'
      }
      this.type = 'add'
    },

    handleNodeClick(data) {
      this.checkId = data.id
      this.type = 'update'
      this.checkForm = Object.assign(data, {})
    }
  }
}
</script>
