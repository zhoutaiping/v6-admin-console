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
  <div>
    <el-card class="is-horizonta">
      <div slot="header" class="clearfix">
        <span>资源列表</span>
      </div>
      <div>
        <DmToolbar>
          <el-button type="primary" @click="$refs.log.handleOpen()">日志记录</el-button>
          <el-button type="primary" @click="$refs.DmData.initPage()">刷 新</el-button>
        </DmToolbar>
        <DmData ref="DmData" @init="fetchList">
          <DmTable :loading="loading">
            <el-table :data="list">
              <el-table-column v-for="tab in column" :key="tab.prop" :label="tab.label" :width="tab.width">
                <template slot-scope="scope">
                  <div v-if="tab.prop === 'isp'">
                    {{ formartValue(scope.row,'regions') }}/{{ formartIsp(scope.row.isp).join(',') }}
                  </div>
                  <template v-else-if="tab.prop === 'ip_alive'">
                    <span v-if="Number(scope.row.ip_alive) === 1" class="color--success">正常</span>
                    <span v-else-if="Number(scope.row.ip_alive) === 0" class="color--danger">宕机</span>
                    <el-divider direction="vertical"/>
                    <span v-if="Number(scope.row.status) === 1" class="color--success">启用</span>
                    <span v-else-if="Number(scope.row.status) === 2" class="color--warning">暂停</span>
                  </template>
                  <template v-else>
                    {{ formartValue(scope.row, tab.prop) }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="{row}">
                  <el-button :disabled="Number(row.status) === 1" type="text" @click="handleOn(row)">启用</el-button>
                  <el-divider direction="vertical"/>
                  <el-button :disabled="Number(row.status) === 2" type="text" @click="handleEdit(row)">暂停</el-button>
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmData>
      </div>
    </el-card>
    <Log ref="log"/>
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Log from '../../log'
import SELECT from '../../../../constant/select'
import moment from 'moment'
import { mapState } from 'vuex'
import { formartRegion } from '@/views/platform/business/constant/utils'
export default {
  components: { Log },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/ip/pool/group/list',
      fetch: this.FetchDisp,
      bindParams: {
        group_id: ''
      },
      column: [
        { label: 'IP/CNAME', prop: 'ip' },
        { label: '所属资源包', prop: 'name' },
        { label: '节点类型', prop: 'node_type' },
        { label: '区域/运营商', prop: 'isp' },
        { label: '健康状态/使用状态', prop: 'ip_alive' },
        { label: '添加时间', prop: 'create_time' }
      ],
      options: {
        isp: SELECT.isp
      }
    }
  },
  computed: {
    ...mapState({
      node_type: state => state.disp.node_type,
      region_list: state => state.disp.region_list
    })
  },
  created() {
    this.bindParams.group_id = this.$route.params.id
  },
  methods: {
    init() {
      this.$refs.DmData.initPage()
    },

    formartValue(data, prop) {
      let val = data[prop]
      switch (prop) {
        case 'create_time':
          val = moment(data[prop]).format('YYYY-MM-DD HH:mm:ss')
          break
        case 'node_type':
          val = this.node_type.find(e => { return e.value === val }) ? this.node_type.find(e => { return e.value === val }).label : val
          break
        case 'regions':
          val = formartRegion(val, this.region_list)
          break
      }
      return val
    },

    formartIsp(data = []) {
      const val = []
      if (data && Array.isArray(data) && data.length) {
        data.forEach(e => {
          if (e) {
            val.push(this.options.isp.find(i => { return i.value === e }) && this.options.isp.find(i => { return i.value === e }).label || e)
          }
        })
      }
      return val.length && val || ['暂无']
    },

    async handleEdit(data = {}) {
      try {
        await this.FetchDisp.post('/ip/pool/ip/pause', { ippool_id: data.ippol_id, ip: data.ip })
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    },

    async handleOn(data = {}) {
      try {
        await this.FetchDisp.post('/ip/pool/ip/on', { ippool_id: data.ippol_id, ip: data.ip })
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    }

  }
}
</script>
