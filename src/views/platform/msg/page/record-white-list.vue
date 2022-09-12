<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    @init="fetchList"
  >
    <div slot="filter">
      <el-button type="primary" @click="$refs.addedit.handleOpen(null,'Create')">新增白名单</el-button>
      <el-button :disabled="options.checkRow.length === 0">批量失效</el-button>
      <el-button :disabled="options.checkRow.length === 0">批量生效</el-button>
      <el-button :disabled="options.checkRow.length === 0">批量删除</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="$refs.DmData.initPage()"
      >刷 新</el-button>
    </div>
    <DmTable min-height>
      <el-table
        v-loading="loading"
        :data="list"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        @selection-change="e =>{ options.checkRow = e}"
      >
        <el-table-column type="selection" />
        <el-table-column
          v-for="item in column"
          :key="item.$index"
          :label="item.label"
        >
          <template slot-scope="{row}">
            <div>
              {{ formartValue(row, item.dataIndex) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              @click="e =>{$refs.addedit.handleOpen(row,'Edit')}"
            >编辑</el-button>
            <el-divider direction="vertical" />
            <el-button
              type="text"
            >失效</el-button>
            <el-button
              type="text"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      iconValue: '',
      PagePanel: 'record-white-list',
      API_INDEX: '',
      bindParams: {},
      list: [{ id: '12312', desc: '31231', name: '1231312', status: '1' }],
      column: [
        { label: '操作时间', dataIndex: 'created_at' },
        { label: '用户名', dataIndex: 'id' },
        { label: '被操作对象', dataIndex: 'name', cell: 'name' },
        { label: '状态', dataIndex: 'status' },
        { label: '检测频率', dataIndex: 'desc' }
      ],
      options: {
        checkRow: []
      }
    }
  },
  methods: {
    loadData() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 800)
    },
    formartValue(data, index) {
      let val = data[index]
      if (index === '34') val = ''
      else if (index === 'status') val = val === '1' ? '生效中' : '已失效'
      return val
    }
  }
}
</script>
