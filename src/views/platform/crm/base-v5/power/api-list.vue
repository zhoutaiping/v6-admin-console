<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <DmSelect
          v-model="bindParams.methsys_keyod"
          :selects="option.sys_key"
          placeholder="系统"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.keyword"
          placeholder="关键字搜索"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$refs.DmData.initPage()"
        >搜索</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handleImport">导入</el-button>
      </DmToolbar>
    </div>
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
          <el-table-column
            label="操作"
            width="200"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="$refs.info.handleOpen(scope.row)">详情</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" @click="$refs.replace.handleOpen(scope.row)">替换</el-button>
              <el-divider direction="vertical" />
              <el-button v-if="scope.row.status !== '1'" type="text" @click="handleDown(scope.row, 1)">上架</el-button>
              <el-divider v-if="scope.row.status === '0'" direction="vertical" />
              <el-button v-if="scope.row.status !== '2'" type="text" @click="handleDown(scope.row, 2)">下架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <InFo ref="info" />
    <Replace ref="replace" />
    <Group ref="group" />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import InFo from './components/api/info'
import Replace from './components/api/replace'
import Group from './components/api/group'
export default {
  components: { InFo, Replace, Group },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/acl.api.list',
      bindParams: {
        sys_key: '',
        keyword: ''
      },
      list: [],
      column: [
        { label: 'API名称', prop: 'api_name' },
        { label: '路由', prop: 'api' },
        { label: '系统', prop: 'sys_name' },
        { label: '请求方式', prop: 'method' },
        { label: '所属模块', prop: 'api_group' },
        { label: '状态', prop: 'status' }
      ],
      option: {
        method: [
          { label: 'GET', value: 'get' },
          { label: 'POST', value: 'post' }
        ],
        sys_key: [
          { label: 'ApiV4', value: 'apiv4' },
          { label: 'AdminV5', value: 'adminV5' }
        ]
      },
      status: {
        0: '未启用',
        1: '上架',
        2: '下架'
      }
    }
  },
  methods: {
    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'status') val = this.status[val]
      return val || ''
    },
    async handleImport() {
      try {
        await this.Fetch.get('/V4/acl.api.import', { sys_key: 'apiv4' })
        setTimeout(() => {
          this.$refs.DmData.initPage()
        }, 1000)
      } catch (error) {
        return
      }
    },
    handleDown(data, type) {
      const params = {
        id: data.id,
        status: type
      }
      const text = type === 1 ? '上架' : '下架'
      this.$confirm('此操作将' + text + 'API, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Fetch.post('/V4/acl.api.save', params).then(res => {
          this.Message('ACTION_SUCCESS')
          this.$refs.DmData.initPage()
        })
      })
    }
  }
}
</script>
