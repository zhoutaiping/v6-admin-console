<style lang="scss" scoped>
.is-horizonta {
  display: flex;
  margin-bottom: 16px;
  /deep/.el-card__header {
    flex: 0 0 180px;
    padding-right: 24px;
  }
  /deep/.el-card__body {
    flex: 1;
    overflow: hidden;
    clear: both;
    height: 100%;
  }
}
</style>
<template>
  <el-card class="is-horizonta">
    <div slot="header" class="clearfix">
      <span>线路列表</span>
    </div>
    <div>
      <DmToolbar>
        <el-button type="primary" @click="$refs.add.handleOpen()">手动添加线路</el-button>
        <el-button type="primary" @click="handleLog()">解析线路变动记录</el-button>
        <el-button type="primary" @click="$refs.DmData.initPage()">刷 新</el-button>
      </DmToolbar>
      <DmData
        ref="DmData"
        @init="fetchList"
      >
        <DmTable :loading="loading">
          <el-table :data="list" >
            <el-table-column type="index" width="55" />
            <el-table-column v-for="tab in column" :key="tab.prop" :label="tab.label" :width="tab.width">
              <template slot-scope="scope">
                <div v-if="tab.prop === 'status'">
                  <span v-if="Number(scope.row.status) === 1" class="color--success">开启</span>
                  <span v-else-if="Number(scope.row.status) === 2" class="color--warning">暂停(手动)</span>
                  <span v-else-if="Number(scope.row.status) === 3" class="color--warning">暂停(宕机)</span>
                  <span v-else-if="Number(scope.row.status) === 0" class="color--danger">关闭</span>
                  <el-divider direction="vertical"/>
                  <span v-if="Number(scope.row.ip_alive) === 1" class="color--success">正常</span>
                  <span v-else-if="Number(scope.row.ip_alive) === 0" class="color--danger">宕机</span>
                </div>
                <template v-else>
                  {{ formartValue(scope.row, tab.prop) }}
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button :disabled="Number(scope.row.status) === 1" type="text" @click="handleOption(scope.row, 'open')" >开启</el-button>
                <el-divider direction="vertical" />
                <el-button :disabled="Number(scope.row.status) !== 1" type="text" @click="handleOption(scope.row, 'pause')">暂停</el-button>
                <el-divider direction="vertical"/>
                <el-button type="text" @click="handleOption(scope.row, 'delete')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmData>
      <Add ref="add" @init="$refs.DmData.initPage()"/>
      <Log ref="log"/>

    </div>
  </el-card>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Add from './add-line'
import Log from '../../log'
import moment from 'moment'
export default {
  components: { Add, Log },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/disp/record/list',
      fetch: this.FetchDisp,
      bindParams: {
        bid: '',
        btype: 'generateDNSLine'
      },
      options: {
        template: []
      },
      column: [
        { label: '线路类型', prop: 'line' },
        { label: '记录类型', prop: 'dns_type' },
        { label: '记录值', prop: 'dns_value', width: 180 },
        { label: '分配方式', prop: 'is_hand' },
        { label: 'TTL', prop: 'dns_ttl' },
        { label: '使用状态/健康状态', prop: 'status', width: 180 },
        { label: '添加时间', prop: 'create_at', width: 180 },
        { label: '备注', prop: 'remark' }
      ]
    }
  },
  created() {
    this.bindParams.bid = this.$route.params.id
  },
  mounted() {
  },
  methods: {
    formartValue(data, prop) {
      const value = data[prop]
      if (prop === 'create_at') {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      } else if (prop === 'is_hand') {
        return Number(value) === 1 ? '手动' : '自动'
      }
      return value
    },

    async handleOption(data, type) {
      try {
        await this.FetchDisp.get('/disp/record/turn_status', { _id: data._id, op: type })
        this.$refs.DmData.initPage()
        await this.Message('ACTION_SUCCESS')
      } catch (error) {
        return
      }
    },

    handleLog() {
      this.$refs.log.handleOpen({
        bid: this.$route.params.id,
        btype: 'generateDNSLine'
      })
    }
  }
}
</script>
