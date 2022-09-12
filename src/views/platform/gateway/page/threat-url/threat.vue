
<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    @init="fetchList"
  >
    <div slot="filter">
      <router-link :to="{path:'/gateway/threat/domain/type-add'}">
        <el-button type="primary">新 增</el-button>
      </router-link>
      <el-button
        :loading="loading"
        type="primary"
        @click="$refs.DmData.initPage()"
      >刷 新</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      class="margin-top"
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
            v-show="row.status === 0"
            type="text"
          >
            启用
          </el-button>
          <el-button
            v-show="row.status === 1"
            type="text"
          >
            禁用
          </el-button>
          <el-divider direction="vertical" />
          <router-link :to="`/gateway/threat/domain/type/${row.id}`">
            <el-button
              type="text"
              @click="e =>{}"
            >编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  components: {},
  mixins: [consoleData],
  data() {
    return {
      search: true,
      visible: false,
      type: 1,

      PagePanel: 'MSG_EMAIL',
      API_INDEX: '',
      bindParams: {},
      list: [{ id: '12312', desc: '31231', name: '1231312', status: 1 }],
      column: [
        { label: '编号', dataIndex: 'id' },
        { label: '威胁类别', dataIndex: 'name' },
        { label: '类别映射', dataIndex: 'type' },
        { label: '说明', dataIndex: 'desc' },
        { label: '启用状态', dataIndex: 'status' },
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
      else if (index === 'status') val = val === 1 ? '启用' : '禁用'
      return val
    }
  }
}
</script>
