<template>
  <console-page-layout>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.operator"
        placeholder="操作管员邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
    </DmToolbar>
    <dm-data ref="DmData" @init="fetchList">
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column v-for="(item, index) in column" :key="index" :label="item.label" :width="item.width" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[item.prop] }}
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </dm-data>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '',
      fetch: this.InvokeOpLogApi,
      bindParams: {},
      column: [
        { label: '操作时间', prop: 'update_at' },
        { label: '提交者', prop: 'update_at' },
        { label: '被操作对象', prop: 'data_key', width: 300 },
        { label: '所属模块', prop: 'biz_type' },
        { label: '操作类型', prop: 'op_type' },
        { label: '操作者', prop: 'op_admin_name' }
      ]
    }
  },

  methods: {
    init() {}
  }
}
</script>
