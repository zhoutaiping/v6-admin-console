<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogAdd.handleOpen()"
      >分配</el-button>
      <InputSearch
        slot="right"
        v-model="bindParams.email"
        placeholder="用户邮箱"
        @submit="handleSearch"
      />
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="已分配内网IP段"
            prop="ip_range"
            min-width="200"
          />
          <el-table-column
            label="IP数"
            prop="amount_of_ip"
            min-width="80"
          />
          <el-table-column
            label="占用数"
            prop="ip_used"
            min-width="80"
          />
          <el-table-column
            label="用户邮箱"
            prop="email"
            min-width="200"
          />
          <el-table-column
            label="分配目的"
            prop="purpose"
            min-width="200"
          />
          <el-table-column
            label="分配时间"
            prop="created_at"
            min-width="200"
          />
          <el-table-column
            label="操作"
            align="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.ip_used"
                type="text"
                @click="handleDelete(scope.row)"
              >回收</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogDetail.handleOpen(scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogDetail ref="DialogDetail" />
    <DialogAdd ref="DialogAdd" @init="fetchList" />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogDetail from './components/DialogDetail'
import DialogAdd from './components/DialogAdd'

export default {
  components: {
    DialogDetail,
    DialogAdd
  },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: '/ip/list',
      fetch: this.FetchGateWay,
      bindParams: {
        email: ''
      },
      GROUP_TYPE: { 'domain': '域名', 'ip': 'IP' }
    }
  },

  methods: {
    handleDelete(row) {
      this.$confirm(`是否确认回收该IP段? <br>用户邮箱：${row.email}<br>内网IP段：${row.ip_range}`, '回收', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.fetchDelete([row.id])
      })
    },

    async fetchDelete(ip_ids) {
      const params = {
        ip_ids
      }
      try {
        await this.FetchGateWay.delete(`/ip/delete`, params)
        this.Message('ACTION_SUCCESS')
        this.handleSearch()
      } catch (e) {
        return
      }
    }
  }
}
</script>
