<template>
  <console-page-layout>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.id"
        placeholder="ID"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <el-button type="primary" icon="el-icon-search" @click="$refs.DmData.initPage()">搜 索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="$refs.add.handleOpen()">新 增</el-button>
    </DmToolbar>

    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading" min-height>
        <el-table :data="list">
          <el-table-column
            type="selection"
            fixed="left"
            width="55"
          />
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
              <el-button type="text" @click="$refs.add.handleOpen(scope.row)">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Add ref="add" :module="option.model" @init="$refs.DmData.initPage()"/>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import { formartArrLabel } from '@/utils/utils'
import routerMixins from './mixins/router-mixins'
import Add from './components/router/add-group'
export default {
  components: { Add },
  mixins: [consoleData, routerMixins],
  data() {
    return {
      API_INDEX: '/V4/acl.router.group.list',
      bindParams: {
        id: ''
      },
      list: [],
      column: [
        { label: 'ID', prop: 'id' },
        { label: '授权操作名称', prop: 'group_name' },
        { label: '产品模块', prop: 'class_type' },
        { label: '组内路由', prop: 'setting_type' },
        { label: '是否需要授权对象', prop: 'is_setting' },
        { label: '状态', prop: 'status' },
        { label: '更新时间', prop: 'updated_at' },
        { label: '备注', prop: 'remark' }
      ],
      option: {
        status: [
          { label: '未启用', value: '0' },
          { label: '启用', value: '1' },
          { label: '禁用', value: '2' }
        ],
        is_setting: [
          { label: '是', value: '1' },
          { label: '否', value: '0' }
        ]
      }
    }
  },
  methods: {
    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'is_setting') {
        val = this.option.is_setting.find(i => { return i.value === val }) ? this.option.is_setting.find(i => { return i.value === val }).label : val
      } else if (prop === 'class_type') {
        val = formartArrLabel(this.option.model, data[prop], 'label') || data[prop]
      } else if (prop === 'status') {
        val = this.option.status.find(i => { return i.value === val }) ? this.option.status.find(i => { return i.value === val }).label : val
      }
      return val || ''
    },
    handleDel(data) {
      const params = {
        group_ids: [data.id]
      }
      this.$confirm('此操作将删除路由分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('/V4/acl.router.group.delete', params)
          this.Message('ACTION_SUCCESS')
          this.$refs.DmData.initPage()
        } catch (error) {
          return
        }
      })
    }
  }
}
</script>
