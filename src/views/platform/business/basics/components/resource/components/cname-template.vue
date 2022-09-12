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
        <span>资源</span>
      </div>
      <div>
        <DmToolbar>
          <el-button type="primary" @click="handleObtain">重新获取资源</el-button>
          <el-button type="primary" @click="$refs.add.handleOpen(ip_pool.ippool_id)">手动新增节点</el-button>
          <el-button type="primary" @click="handleLog()">调度日志</el-button>
        </DmToolbar>

        <DmTable :loading="loading">
          <el-table :data="list">
            <el-table-column v-for="tab in column" :key="tab.prop" :label="tab.label" :width="tab.width">
              <template slot-scope="scope">
                <div v-if="tab.prop === 'isp'">
                  {{ formartIsp(scope.row.isp).join(',') }}
                </div>
                <template v-else-if="tab.prop === 'ip_alive'">
                  <span v-if="Number(scope.row.ip_alive) === 1" class="color--success">正常</span>
                  <span v-else-if="Number(scope.row.ip_alive) === 0" class="color--danger">宕机</span>
                </template>
                <template v-else>
                  {{ formartValue(scope.row, tab.prop) }}
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </div>
    </el-card>
    <Add ref="add" @init="Pinit"/>
    <Log ref="log"/>
  </div>
</template>
<script>
import Log from '../../log'
import { mapState } from 'vuex'
import SELECT from '../../../../constant/select'
import moment from 'moment'
import Add from './add-ip'
export default {
  components: { Log, Add },
  data() {
    return {
      loading: false,
      list: [],
      column: [
        { label: 'IP/CNAME', prop: 'ip' },
        { label: '区域/运营商', prop: 'isp' },
        { label: '健康状态', prop: 'ip_alive' },
        { label: '分配方式', prop: 'type' },
        { label: '添加时间', prop: 'create_time' },
        { label: '备注', prop: 'remark' }
      ],
      options: {
        isp: SELECT.isp
      }
    }
  },
  computed: {
    ...mapState({
      ip_pool: state => state.disp.ip_pool
    })
  },

  watch: {
    ip_pool: {
      deep: true,
      handler(val) {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.list = []
      if (this.ip_pool.ips) {
        this.list = this.ip_pool.ips
      }
      setTimeout(() => {
        this.loading = false
      }, 500)
    },

    formartValue(data, prop) {
      let val = ''
      switch (prop) {
        case 'type':
          val = Number(data[prop]) === 1 ? '手动' : '自动'
          break
        case 'create_time':
          val = moment(data[prop]).format('YYYY-MM-DD HH:mm:ss')
          break
        default:
          val = data[prop]
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

    async handleObtain() {
      try {
        const params = {
          ippool_ids: [this.$route.params.id.toString()]
        }
        await this.FetchDisp.post('/ip/pool/obtain', params)
        await this.$store.dispatch('fetchIpPool', { ippool_id: this.$route.params.id, page: 1, pagesize: 1 })
        this.Message('ACTION_SUCCESS')
      } catch (error) {
        return
      }
    },

    Pinit() {
      this.$store.dispatch('fetchIpPool', { ippool_id: this.$route.params.id, page: 1, pagesize: 1 })
    },

    handleLog() {
      this.$refs.log.handleOpen({
        bid: this.$route.params.id,
        btype: 'obtainIP'
      })
    },

    async handleDel(data) {
      try {
        const params = {
          ip: data.ip,
          ippool_id: this.$route.params.id
        }
        await this.FetchDisp.post('/ip/pool/ip/delete', params)
        this.Message('ACTION_SUCCESS')
        await this.Pinit()
      } catch (error) {
        return
      }
    }
  }
}
</script>
