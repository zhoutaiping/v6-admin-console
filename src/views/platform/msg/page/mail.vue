<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    @init="fetchList"
  >
    <div slot="filter">
      <el-button
        type="primary"
        @click="$refs.addedit.handleOpen(null,'Create')"
      >新 增</el-button>
      <el-button :disabled="options.checkRow.length === 0">禁 用</el-button>
      <el-button :disabled="options.checkRow.length === 0">启 用</el-button>
      <el-button :disabled="options.checkRow.length === 0">删 除</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="$refs.DmData.initPage()"
      >刷 新</el-button>
    </div>
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
        width="120"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="e =>{$refs.addedit.handleOpen(row,'Edit')}"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddEdit
      ref="addedit"
      @init="$refs.DmData.initPage()"
    />
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import AddEdit from '../components/add-edit-mail'
export default {
  components: { AddEdit },
  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'MSG_MAIL',
      API_INDEX: '',
      bindParams: {},
      list: [{ id: '12312', desc: '31231', name: '1231312', status: '1' }],
      column: [
        { label: 'APP_ID', dataIndex: 'id' },
        { label: '消息类型', dataIndex: 'name1' },
        { label: '消息类型', dataIndex: 'name2' },
        { label: '消息模板', dataIndex: 'template_name' },
        { label: '消息标识', dataIndex: 'desc' },
        { label: '状态', dataIndex: 'status' },
        { label: '短信标题', dataIndex: 'title' },
        { label: '参数', dataIndex: 'email_desc' },
        { label: '添加/修改时间', dataIndex: 'created_at' }
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
      else if (index === 'status') val = val === '1' ? '开启' : '关闭'
      return val
    }
  }
}
</script>
