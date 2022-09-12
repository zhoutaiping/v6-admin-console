<style lang="scss" scoped>
</style>
<template>
  <div>
    <DmToolbar>
      <el-button type="primary" icon="el-icon-plus" class="op-btn" @click="$emit('handleAdd')" >新增类别</el-button>
      <el-button :disabled="selRow.length===0" icon="el-icon-delete" type="primary" @click="del">删除</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="$emit('init')" >刷 新</el-button>
    </DmToolbar>
    <el-table
      :data="data"
      border
      show-overflow-tooltip
      style="width: 100%"
      @selection-change="e =>{selRow = e}"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" label="类别名称" />
      <el-table-column label="应用范围">
        <template slot-scope="scope">
          {{ apply_scope_text[scope.row.apply_scope] }}
        </template>
      </el-table-column>
      <el-table-column label="关联标签">
        <template slot-scope="scope">
          <span v-if="scope.row.relate_tags && Object.keys(scope.row.relate_tags).length">
            {{ scope.row.relate_tags[Object.keys(scope.row.relate_tags)[0]] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="update_at" label="更新时间" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a class="color--primary op-btn" @click="$emit('handleInfo', scope.row)">编辑</a>
          <el-divider direction="vertical"/>
          <a class="color--primary op-btn" @click="$emit('link', scope.row)">关联</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selRow: [],
      apply_scope_text: { 'user': '用户', 'big': '业务' }
    }
  },
  methods: {
    async del() {
      if (this.selRow.length === 0) {
        this.message.warning('请选择数据!')
        return
      }
      try {
        await this.InvokeTagApi.get('/tag_type/delete', { ids: (this.selRow.map(i => { return i.id })).join(',') })
        this.message.success('操作成功!')
        this.$emit('init')
      } catch (error) {
        return
      }
    }
  }
}
</script>
