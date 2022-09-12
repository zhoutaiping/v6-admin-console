<style lang="scss" scoped>
.input-box {
  width: 180px;
}
</style>
<template>
  <console-page-layout>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.id"
        placeholder="ID"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.router"
        placeholder="路由"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.router_title"
        placeholder="路由名称"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <el-cascader
        :options="option.model"
        v-model="module_key"
        placeholder="所属模块"
        filterable
        clearable
        class="input-box"
        @change="e =>{
          bindParams.class_type = ''
          if(e && e[1]) {
            bindParams.class_type = e[1]
          }
          this.$refs.DmData.initPage()
        }"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$refs.add.handleOpen()"
      >新 增</el-button>
      <el-button @click="handleSync()">同步</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        v-loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            v-for="(tab, t_index) in column"
            :key="t_index"
            :label="tab.label"
          >
            <template slot-scope="scope">
              {{ formartValue(scope.row, tab.prop) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.add.handleOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.edit.handleOpen(scope.row)"
              >绑定API</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Add
      ref="add"
      :module="option.model"
      @init="$refs.DmData.initPage()"
    />
    <Edit ref="edit" />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import Add from './components/router/add'
import Edit from './components/router/edit'
import routerMixins from './mixins/router-mixins'
import { formartArrLabel } from '@/utils/utils'
export default {
  components: { Add, Edit },
  mixins: [consoleData, routerMixins],
  data() {
    return {
      API_INDEX: '/V4/acl.router.list',
      bindParams: {
        id: '',
        class_type: ''
      },
      list: [],
      module_key: [],
      column: [
        { label: 'ID', prop: 'id' },
        { label: '路由名称', prop: 'router_title' },
        { label: '路由', prop: 'router' },
        { label: '类别', prop: 'class_type' },
        { label: '状态', prop: 'status' },
        { label: '更新时间', prop: 'updated_at' },
        { label: '备注', prop: 'remark' }
      ],

      routerConfig: [
        {
          path: 'anti-ddos',
          name: `anti-ddos.title`,
          class_type: 'anti-ddos',
          module_flags: 'cloud',
          meta: { title: 'DDoS原生清洗', rememberPage: true }
        }
      ]
    }
  },
  methods: {
    handleSync() {
      this.$confirm('确认同步?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('/fd/V4/permission.router.import')
        } catch (error) {
          return
        }
        this.Message('ACTION_SUCCESS')
      })
    },
    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'class_type') {
        val = formartArrLabel(this.option.model, data[prop], 'label') || data[prop]
      } else {
        val = this.option.status.find(i => { return i.value === val }) && this.option.status.find(i => { return i.value === val }).label || val
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
