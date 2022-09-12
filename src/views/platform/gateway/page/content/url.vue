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
      <el-button
        :disabled="options.checkRow.length === 0"
        @click="handleStatus(1)"
      >加 白</el-button>
      <el-button
        :disabled="options.checkRow.length === 0"
        @click="handleStatus(2)"
      >取消加白</el-button>
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
import AddEdit from '../../components/add-edit-url'
export default {
  components: { AddEdit },
  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'MSG_EMAIL',
      API_INDEX: '',
      bindParams: {},
      list: [{ id: '12312', desc: '31231', name: '1231312', status: '1' }],
      column: [
        { label: '编号', dataIndex: 'id' },
        { label: 'URL', dataIndex: 'name1' },
        { label: '域名', dataIndex: 'name2' },
        { label: '一级分类', dataIndex: 'template_name' },
        { label: '二级分类', dataIndex: 'desc' },
        { label: '信誉', dataIndex: 'status' },
        { label: '备注', dataIndex: 'title' },
        { label: '更新时间', dataIndex: 'created_at' }
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
    },

    handleStatus(type) {
      const text = {
        1: '是否确认该域名信誉良好？加白后将跳过系统威胁检测模块，请谨慎操作。',
        2: '是否确认该域名取消加白?'
      }
      this.$confirm(text[type], type === 1 ? '加白' : '取消加白', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Message('ACTION_SUCCESS')
      })
    }
  }
}
</script>
