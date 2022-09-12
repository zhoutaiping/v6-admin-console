<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    @init="fetchList"
  >
    <div slot="filter">
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增</el-button>
      <el-button
        :disabled="multipleActionDisable"
        @click="handleDelete()"
      >删除</el-button>
      <InputSearch
        v-model="bindParams.app_name"
        placeholder="应用名称"
        style="width: 200px; margin-left: 12px"
        @clear="handleSearch"
        @submit="handleSearch"
      />
      <InputSearch
        v-model="bindParams.ip"
        placeholder="0.0.0.0"
        style="width: 200px; margin-left: 12px"
        @clear="handleSearch"
        @submit="handleSearch"
      />
      <InputSearch
        v-model="bindParams.domain"
        placeholder="www.demo.com"
        style="width: 200px"
        @clear="handleSearch"
        @submit="handleSearch"
      />
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="id"
        label="编号"
        min-width="100"
      />
      <el-table-column
        prop="app_name"
        label="应用名称"
        min-width="140"
      />
      <el-table-column
        label="域名"
        min-width="80"
      >
        <template slot-scope="scope">
          <a>
            {{ scope.row.domain }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="IP"
        min-width="120"
      >
        <template slot-scope="scope">
          <ColumnList :list="scope.row.ipList" />
        </template>
      </el-table-column>
      <el-table-column
        label="启用状态"
        min-width="80"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="status => handleChangeStatus(status, [scope.row.id])"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="备注"
        min-width="140"
      />
      <el-table-column
        prop="updated_at"
        label="更新时间"
        min-width="140"
      />
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="{row}">
          <el-button
            type="text"
            @click="$refs.DialogRow.handleOpen(row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <DialogRow
      ref="DialogRow"
      @init="handleSearch()"
    />
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import ColumnList from '@/components/Column/ColumnList'
import DialogRow from './components/DialogRow'

export default {
  components: { DialogRow, ColumnList },

  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'CONTENT-INDEX',
      selectionId: [],
      fetch: this.FetchGateWay,
      API_INDEX: '/bypass/list',
      bindParams: {
        domain: '',
        ip: ''
      }
    }
  },

  methods: {
    formatResponse(response) {
      const { list = [] } = response
      list.forEach(item => {
        const ipList = item.ips.split(',')

        item.ipList = ipList
        item.ips = ipList.join('\n')
      })
      return response
    },

    async handleChangeStatus(status, app_ids) {
      await this.FetchGateWay.put('bypass/status', {
        status,
        app_ids
      })

      this.Message('ACTION_SUCCESS')
    },

    async handleDelete() {
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(async () => {
        await this.fetchDelete()
        this.Message('ACTION_SUCCESS')
        this.handleSearch()
      })
    },

    async fetchDelete() {
      await this.FetchGateWay.delete('bypass/delete', {
        app_ids: this.multipleSelection.map(_ => _.id)
      })
      this.Message('ACTION_SUCCESS')
    }
  }
}
</script>
