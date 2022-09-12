<style lang="scss">
@import url("./tree.scss");
.none-box {
  display: none !important;
}
</style>
<template>
  <div>
    <DmToolbar>
      <el-radio-group
        v-model="is_expand"
        size="mini"
      >
        <el-radio-button :label="1">展开</el-radio-button>
        <el-radio-button :label="2">折叠</el-radio-button>
      </el-radio-group>
      <el-button
        type="primary"
        style="mini"
        class="m-r"
        @click="init"
      >刷新</el-button>
    </DmToolbar>
    <el-table
      v-loading="loading"
      ref="treeTable"
      :data="tableListData"
      :row-class-name="toggleDisplayTr"
      border
      class="init_table"
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
          />
            {{ scope.row.label }}
          </p>
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
        width="250"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.nodelevel === 'tag'">
            <a class="color--primary" @click="handleLink(scope.row)">关联</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <link-tag
      ref="link-tag"
      @init="init"
    />
  </div>
</template>
<script>
import treemixins from './mixins/tree'
import LinkTag from './components/link-tag'
export default {
  components: { LinkTag },
  mixins: [treemixins],
  props: {
    linkTag: {
      type: Object,
      default: () => { }
    }
  },
  data: () => ({
    loading: false,
    keyword: '',
    is_expand: 1
  }),
  methods: {
    async init() {
      this.loading = true
      const parmars = { type_ukey: 'hangye' }
      const data = await this.InvokeTagApi.get('/tag/tree', parmars)
      this.formartTree(data)
      setTimeout(() => { this.loading = false }, 500)
    },

    handleLink(data) {
      if (this.$refs['link-tag']) this.$refs['link-tag'].handleOpen(JSON.parse(JSON.stringify(data)), this.linkTag)
    }
  }
}
</script>
