<template>
  <console-page-layout>
    <DmToolbar>
      <el-button type="primary" @click="$refs.eidt.handleOpen()">新 增</el-button>
      <el-button type="primary" @click="$refs.DmData.initPage()">刷 新</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading" min-height>
        <el-table
          :data="list"
          @selection-change="e =>{
            checkRow = e
        }">
          <el-table-column type="selection" width="55"/>
          <el-table-column
            v-for="(tab, t_index) in column"
            :key="t_index"
            :label="tab.label"
          >
            <template slot-scope="scope">
              {{ formartValue(scope.row, tab.prop) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="$refs.eidt.handleOpen(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Edit ref="eidt" @init="$refs.DmData.initPage()"/>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Edit from './components/module/edit'
export default {
  components: { Edit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/acl.module.list',
      bindParams: {
        pid: ''
      },
      checkRow: [],
      column: [
        { label: 'ID', prop: 'id' },
        { label: '模块名称', prop: 'name' },
        { label: '模块标识', prop: 'key' },
        { label: '分组名称', prop: 'module_group_title' },
        { label: '分组标识', prop: 'module_group' },
        { label: '备注', prop: 'remark' }
      ]
    }
  },
  created() {
    this.Fetch.get('/V4/acl.module.tree', { free_type: 'map' })
  },
  methods: {
    formartValue(data, prop) {
      const val = data[prop]
      return val || ''
    },
    async handleDel(params = {}) {
      params.ids = this.checkRow.map(i => { return Number(i.id) }).join(',')
      try {
        await this.Fetch.post('V4/acl.module.delete', params)
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    }
  }
}
</script>
