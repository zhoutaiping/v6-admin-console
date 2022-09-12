<style lang="scss" scoped>
.op-btn {
  margin: 2px;
}
</style>
<template>
  <div style="padding:10px;">
    <el-divider content-position="left">下级资源</el-divider>
    <el-button
      :disabled="loading"
      type="primary"
      class="op-btn"
      @click="$refs.dialogSave.handleOpen('addChildren', checkForm)"
    >新增下级</el-button>
    <el-table
      v-loading="loading"
      :data="list"
      :max-height="500"
    >
      <el-table-column
        v-for="(t_item, key) in column"
        :key="key"
        :width="t_item.width"
        :label="t_item.label"
      >
        <template slot-scope="scope">
          <div v-if="t_item.prop === 'sss'">
            //
          </div>
          <div v-else-if="t_item.prop === 'type'">
            <svg-icon
              v-if="scope.row.type === 'nav'"
              icon-class="tree"
            />
            <svg-icon
              v-if="scope.row.type === 'menu'"
              icon-class="tab"
            />
            <svg-icon
              v-if="scope.row.type === 'op'"
              icon-class="documentation"
            />
            {{ formartValue(scope.row, 'type') }}
          </div>
          <div v-else>
            {{ formartValue(scope.row, t_item.prop) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleDel(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <dialog-save
      ref="dialogSave"
      @on-success="init"
    />
  </div>
</template>
<script>
import treeMixins from '../treeMixins'
import DialogSave from '../Dialog/dialogSave'
export default {
  components: { DialogSave },
  mixins: [treeMixins],
  props: {
    checkForm: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      loading: false,
      column: [
        { label: 'id', prop: 'id', width: 55 },
        { label: '名称', prop: 'name' },
        { label: '路由', prop: 'router' },
        { label: '资源类型', prop: 'type' },
        { label: '平台', prop: 'plat' },
        { label: '请求类型', prop: 'method' }
      ],
      type_text: { 'nav': '导航', 'menu': '菜单', 'op': '选项功能' }
    }
  },
  computed: {
    list() {
      return this.checkForm.id && this.checkForm.Children ? this.checkForm.Children : []
    }
  },
  methods: {
    init() {
      this.loading = true
      this.$emit('init')
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    formartValue(data, prop) {
      let row_text = data[prop]
      if (prop === 'type') row_text = this.type_text[row_text]
      return row_text
    }
  }
}
</script>
