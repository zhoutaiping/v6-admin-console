<style lang="scss" scoped>
.input-box {
  width: 160px;
}
</style>
<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    title="DNS服务器管理（CNAME）"
    @init="fetchList"
  >
    <div slot="filter">
      <div style="float:right">
        <dm-select
          v-model="bindParams.server_id"
          :selects="SERVERS"
          filterable
          placeholder="服务器"
          @change="$refs.DmData.initPage()"
        />
        <dm-select
          v-model="bindParams.user_trades"
          :selects="USER_TRADES"
          filterable
          placeholder="用户行业"
          @change="$refs.DmData.initPage()"
        />
      </div>
      <el-button
        type="primary"
        @click="$refs.addedit.handleOpen(null,'Created')"
      >新 增</el-button>
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
          <el-divider direction="vertical" />
          <el-button
            type="text"
            @click="e =>{handleDel(row)}"
          >删除</el-button>
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
import { deepClone } from '../../../../utils'
import AddEdit from '../components/add-edit-service.vue'
export default {
  components: { AddEdit },
  mixins: [consoleData],
  data() {
    return {
      PagePanel: 'DNS-SERVER-LIST',
      API_INDEX: '/V4/CloudDns.Server.cname.getServerUserTradesList',
      bindParams: {},
      column: [
        { label: 'ID', dataIndex: 'id' },
        { label: '服务名称', dataIndex: 'server' },
        { label: 'Cname域名', dataIndex: 'cname' },
        { label: 'Cname备域名', dataIndex: 'slaves' },
        { label: '服务器属性', dataIndex: 'is_overseas_desc' },
        { label: '适用行业', dataIndex: 'user_trades_desc' },
        { label: '状态', dataIndex: 'status' },
        { label: '创建时间', dataIndex: 'created_at' },
        { label: '更新时间', dataIndex: 'updated_at' }
      ],
      SERVERS: [],
      USER_TRADES: [
        { label: '默认-小微企业', value: 0 },
        { label: '企业', value: 1 },
        { label: '政企', value: 2 },
        { label: '互联网', value: 3 }
      ]
    }
  },
  async created() {
    await Promise.all([this.getAllCnameServer()])
  },
  methods: {
    async getAllCnameServer() {
      try {
        const data = await this.Fetch.get('/V4/CloudDns.Server.cname.getAllCnameServer', {})
        const list = deepClone(data).map(i => {
          return { label: i.server, value: i.id }
        })
        this.SERVERS = list
      } catch (error) {
        return
      }
    },
    async getDnsServerPackageList() {
      this.serverList = []
      try {
        const data = await this.Fetch.get('/V4/CloudDns.Server.getDnsPackageList', {})
        const list = deepClone(data).map(i => {
          return { label: i.meal_name, value: i.meal_flag }
        })
        this.serverList = list
      } catch (error) {
        return
      }
    },

    formartValue(data, index) {
      let val = data[index]
      if (index === '34') val = ''
      else if (index === 'status') val = val === '1' ? '开启' : '关闭'
      return val
    },
    handleDel(row) {
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          id: row.id
        }
        try {
          await this.Fetch.delete('/V4/CloudDns.Server.cname.delServerUserTrades', params)
          this.fetchList()
          this.Message('ACTION_SUCCESS')
        } catch (error) {
          return
        }
      })
    }
  }

}
</script>
