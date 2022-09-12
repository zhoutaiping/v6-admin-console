<template>
  <div>
    <DmAlert>
      1、边缘节点解析线路依据所绑定的调度域名生成的解析线路同步而来，调度域名解析线路通过CNAME/A记录方式全量同步至业务（域名）；<br>
      2、当前绑定的调度包为：<span class="color--primary">{{ domain_group.group_name || '暂无' }} </span>，其调度域名： 主域名 <span class="color--primary">{{ domain_group.cname_server || '暂无' }}</span>
      备用域名 <span class="color--primary">{{ domain_group.cname_server_slaves || '暂无' }}</span><br>
      3、当前接入模式为：<span class="color--primary">{{ domain_basic && domain_basic.info && domain_basic.info.protected_mode_desc || '暂无' }}</span> 模式，记录同步方式: <span class="color--primary">{{ resData && resData.recordRsync || '暂无' }} </span>记录同步；
    </DmAlert>
    <el-radio-group
      v-model="bindParams.type"
      style="margin-bottom:10px;"
      @change="e =>{
        if (e === '1') {
          API_INDEX = '/V4/WebCdnProtection.Records.cnameRecords'
        } else if(e === '2') {
          API_INDEX = '/V4/WebCdnProtection.Records.aRecords'
        }
        $refs.DmData.initPage()
      }"
    >
      <el-radio-button v-for="i in protected_mode" :key="i.value" :label="i.value">{{ i.label }}</el-radio-button>
    </el-radio-group>
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            type="index"
            width="55"
          />
          <el-table-column
            v-for="tab in column"
            :key="tab.prop"
            :label="tab.label"
            :width="tab.width"
          >
            <template slot-scope="scope">
              <div v-if="tab.prop === 'status_list'">
                <el-tag
                  v-for="tag in scope.row.status_list"
                  :key="tag.key+tag.name"
                  style="margin:2px;"
                >{{ tag.name }}</el-tag>
              </div>
              <div v-else-if="tab.prop === 'ip_alive'">
                <template v-if="scope.row.type === 'A' && Object.keys(ip_map).length">
                  <span v-if="Number(formartValue(ip_map[scope.row.value], 'ip_alive')) === 1" class="color--success">正常</span>
                  <span v-else-if="formartValue(ip_map[scope.row.value], 'ip_alive') && Number(formartValue(ip_map[scope.row.value], 'ip_alive')) === 0" class="color--danger">宕机</span>
                </template>
              </div>
              <div v-else> {{ formartValue(scope.row, tab.prop) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import moment from 'moment'
import { mapState } from 'vuex'
import { deepClone } from '@/utils'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '',
      bindParams: {
        type: '1',
        domain_id: ''
      },
      column: [
        { label: '线路类型', prop: 'view' },
        { label: '记录类型', prop: 'type' },
        { label: '记录值', prop: 'value', width: 180 },
        { label: '分配方式', prop: 'op_type' },
        { label: 'TTL', prop: 'ttl' },
        { label: '使用状态', prop: 'status_list', width: 180 },
        { label: '健康状态', prop: 'ip_alive', width: 180 },
        { label: '添加时间', prop: 'update_time', width: 180 }
      ],
      protected_mode: [],
      domain_group: {},
      ip_map: {}
    }
  },
  computed: {
    ...mapState({
      domain_basic: state => state.disp.domain_basic
    })
  },

  watch: {
    resData: {
      handler(val) {
        let list = deepClone(this.resData.list) || []
        list = list.filter(i => i.type === 'A')
        list = list.map(i => i.value)
        this.ip_map = {}
        if (list.length > 0) {
          this.getIpMap({ ips: list })
        }
      },
      deep: true
    }
  },

  created() {
    this.bindParams.domain_id = this.$route.params.id
  },

  methods: {
    init() {
      this.bindParams.type = this.domain_basic.info.protected_mode
      this.protected_mode = []
      if (this.bindParams.type === '1') {
        this.API_INDEX = '/V4/WebCdnProtection.Records.cnameRecords'
      } else if (this.bindParams.type === '2') {
        this.API_INDEX = '/V4/WebCdnProtection.Records.aRecords'
        this.protected_mode = [{ label: 'CNAME模式解析记录', value: '1' }, { label: 'NS模式解析记录', value: '2' }]
      }

      this.$refs.DmData.initPage()
      this.domainGroup()
    },

    async getIpMap(params = {}) {
      try {
        const data = await this.FetchDisp.post('/ip/map', params)
        this.ip_map = data
      } catch (error) {
        return
      }
    },

    async domainGroup() {
      this.domain_group = {}
      try {
        const data = await this.Fetch.get('/fd/V4/disp.domain.group.info', { domain_id: this.$route.params.id })
        this.domain_group = data
      } catch (error) {
        return error
      }
    },

    formartValue(data, prop) {
      const value = data && data[prop] || ''
      if (prop === 'create_at') {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      } else if (prop === 'view') {
        return value && this.resData.allLines[value] && this.resData.allLines[value].desc || value || ''
      } else if (prop === 'op_type') {
        const op_type = {
          0: '自动',
          1: '后台手动添加'
        }
        return value && op_type[value] || value || ''
      } else if (prop === 'ip_alive') {
        return value || ''
      }
      return value
    }
  }
}
</script>
