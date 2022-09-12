<style lang="scss" scoped>
.app-center-room-index {
  padding: 10px;
  .search-from {
    .search-form-item {
      margin-bottom: 5px;
    }
    .search-form-input {
      width: 200px;
      margin: 0 2px;
    }
  }
  .setting-btn {
    margin: 0 0 10px;
  }
  .row_text {
    width: 400px;
    word-wrap: break-word;
    word-break: normal;
    display: flexbox;
  }
  .row_title {
    display: inline-block;
    width: 60px;
    text-align: justify;
    font-weight: 600;
  }
}
</style>

<template>
  <div class="app-center-room-index">
    <div style="margin-bottom: 5px;">
      <el-form
        :model="search"
        size="mini"
        label-position="left"
        label-width="0px"
        class="search-from"
      >
        <el-form-item class="search-form-item" >
          <el-input
            v-model="search.ip"
            clearable
            placeholder="请输入节点IP"
            class="search-form-input"
            @keyup.enter.native="handleLoad"
          />
          <el-input
            v-model="search.server_ip"
            clearable
            placeholder="请输入主IP"
            class="search-form-input"
            @keyup.enter.native="handleLoad"
          />
          <el-button type="primary" icon="el-icon-search" @click="handleLoad" >搜 索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card :body-style="{ padding: '5px' }" shadow="hover" >
      <el-tabs v-model="activeTab" @tab-click="handleLoad" >
        <el-tab-pane
          v-for="(item, index) in tabPanel"
          :key="index"
          :label="item.label"
          :name="item.value"
        />
      </el-tabs>
      <el-button
        v-if="Number(activeTab) !== -1"
        type="primary"
        icon="el-icon-setting"
        size="mini"
        class="setting-btn"
        @click="handleRowClick(null, 'edit-batch')"
      >批量配置</el-button>
      <div
        v-if="
          (Number(activeTab) === 2 || Number(activeTab) === 3) && selRow.length
        "
        style="display:inline"
      >
        <el-popover
          v-model="visible"
          placement="right"
          title="批量调度IP"
          width="300"
          trigger="click"
        >
          <p>
            <el-tag
              v-for="(row, index) in selRow"
              :key="index"
              size="mini"
              style="margin:1px;"
            >{{ row.ip }}</el-tag>
          </p>
          <div style="text-align: right; margin: 0">
            <el-button
              size="mini"
              type="text"
              @click="visible = false"
            >取消</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleSchedule"
            >确定</el-button>
          </div>
          <el-button
            slot="reference"
            type="primary"
            icon="el-icon-setting"
            size="mini"
          >批量调度</el-button>
        </el-popover>
      </div>
      <DmTable v-loading="loading">
        <el-table
          ref="receivableList"
          :data="list"
          :key="tablekey"
          @selection-change="changeSel"
        >
          <el-table-column
            label
            type="selection"
            width="55px"
            fixed="left"
          />
          <el-table-column
            v-for="(item, key) in defalutColumns"
            :key="key"
            :label="item.label"
            :fixed="item.fixed"
            :min-width="item.width"
            :show-overflow-tooltip="item.prop === 'params' ? false : true"
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'ip_remove_sensitive'">
                <el-tag
                  v-if="Number(scope.row[item.prop]) === 1"
                  type="success"
                >{{ formartValue(scope.row, item.prop) }}</el-tag>
                <el-tag
                  v-else-if="Number(scope.row[item.prop]) === 2"
                  type="warning"
                >{{ formartValue(scope.row, item.prop) }}</el-tag>
                <div v-else>
                  <el-tag type="info">未设置</el-tag>
                </div>
              </div>
              <div v-else-if="item.prop === 'server_id'">
                <el-popover
                  :content="idc_house_text"
                  trigger="hover"
                  title="所属机房"
                  @show="getHouse(scope.row.server_id)"
                >
                  <span slot="reference">
                    {{ formartValue(scope.row, item.prop) }}
                  </span>
                </el-popover>
              </div>
              <div v-else-if="item.prop === 'params' && scope.row.use_type !== 0">
                <div
                  v-if="isp_line_type[Number(scope.row.isp_line_type)]"
                  class="row_text"
                >
                  <div class="row_title">ISP</div>
                  {{ isp_line_type[Number(scope.row.isp_line_type)] }} :{{
                    getLineType(scope.row)
                  }}
                </div>
                <div class="row_text">
                  <span class="row_title" />
                  <span>地区：{{ getRegionText(scope.row.region_code) }}</span>
                </div>
                <div class="row_text">
                  <span class="row_title">带宽</span>
                  带宽上行 : {{ scope.row.net_speed_up }} Mbps&nbsp;|&nbsp;
                  带宽下行 : {{ scope.row.net_speed_down }} Mbps
                </div>
                <div class="row_text">
                  <span class="row_title" />
                  <span>计费方式: {{ getNetFeeType(scope.row) }}</span>
                </div>
                <div class="row_text">
                  <span class="row_title">ADS</span>
                  <span>
                    黑洞阈值 : {{ scope.row.null_limit }} Gbps &nbsp;|&nbsp;
                    黑洞时间 : {{ scope.row.null_time }} S
                  </span>
                </div>
                <div class="row_text">
                  <span class="row_title" />
                  <span>
                    运营商策略: {{ getRiskPolicy(scope.row) }}&nbsp;|&nbsp;
                    最大清洗能力: {{ scope.row.ads_cluster_clean_max }}
                  </span>
                </div>
                <div class="row_text">
                  <span class="row_title" />
                  <span>
                    最大清洗能力:
                    {{ scope.row.ads_cluster_clean_max }}&nbsp;|&nbsp;
                    清洗方案:{{ getAdsCleanType(scope.row) }}
                  </span>
                </div>
              </div>
              <div v-else>{{ formartValue(scope.row, item.prop) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="left"
            fixed="right"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                size="mini"
                @click="handleRowClick(scope.row, 'edit')"
              >配 置</el-button>
              <el-button
                v-if="
                  (Number(scope.row.is_disp) !== 1) &&
                    (Number(scope.row.use_type) === 2 ||
                    Number(scope.row.use_type) === 3)
                "
                type="primary"
                plain
                size="mini"
                @click="handleRowClick(scope.row, 'dispatch')"
              >添加调度</el-button>
              <span
                v-if="Number(scope.row.is_disp) === 1"
                style="color:#909399"
              >已参与调度</span>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
      <Pagination
        :total="pagination.total"
        :page="pagination.page"
        :limit="pagination.per_page"
        @pagination="handlePagination"
      />
    </el-card>
    <DialogEdit
      ref="dialogEdit"
      @handleLoad="handleLoad"
    />
    <el-tooltip
      placement="top"
      content="回到顶部"
    >
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>
  </div>
</template>

<script>
import Form from './form'
import BackToTop from '@/components/BackToTop'
import DmTable from '@/components/DmTable'
import Pagination from '@/components/Pagination'
import DialogEdit from './components/DialogEdit'
// import Message from 'ant-design-vue/lib/message'
export default {
  components: { BackToTop, DmTable, Pagination, DialogEdit },
  data() {
    return {
      search: Form.search,
      loading: false,
      visible: false,
      msg: 'Hello,Word!',
      list: [],
      selRow: [],
      servers: [],
      pagination: Form.pagination,
      myBackToTopStyle: Form.myBackToTopStyle,
      tablekey: 1,
      defalutColumns: Form.COLUMN,
      activeTab: '-1',
      tabPanel: Form.tabPanel,
      USE_TYPE_TEXT: Form.USE_TYPE_TEXT,
      isp_line_type: { 1: '单线', 2: '多线路' },
      BIG: [],
      CITY: [],

      idc_house_text: '' // 机房名称
    }
  },
  created() {
    this.getRegion()
  },
  mounted() {
    this.handleLoad()
  },

  methods: {
    init() {
      this.loading = true
      this.visible = false
      const params = {
        page: this.pagination.page,
        per_page: this.pagination.per_page
      }
      if (this.activeTab) params.use_type = Number(this.activeTab)
      if (this.search.ip) params.ip = this.search.ip.trim()
      if (this.search.server_ip) {
        params.master_ip = this.search.server_ip.trim()
      }
      this.InvokeAssetApi.get('/serverIp/list', params)
        .then(res => {
          const list = JSON.parse(JSON.stringify(res.list)) || []
          this.list = list
          this.servers = res.servers
          this.pagination.total = res.total
          this.tabKey++
          setTimeout(() => {
            this.loading = false
          }, 1000)
        })
        .catch(() => {
          this.list = []
          this.pagination.total = []
          this.loading = false
        })
    },
    handleLoad() {
      this.pagination.page = 1
      this.pagination.per_page = 10
      this.init()
    },
    getRegionText(code) {
      let text = '--'
      const region = code.split(',')
      if (region[0] === 'CN') {
        const find = this.CITY.filter(
          i =>
            i.region_code === region[1] && i.province_code === region[2] && i.city_code === region[3]
        )
        if (find[0]) {
          text =
            find[0].country_name +
            '-' +
            find[0].region_name +
            '-' +
            find[0].province_name +
            '-' +
            find[0].city_name
        }
        const provinc = this.CITY.filter(
          i =>
            i.city_code === '' &&
            !region[3] &&
            i.province_code === region[2] &&
            i.region_code === region[1]
        )
        if (provinc[0]) {
          text =
            provinc[0].country_name +
            '-' +
            provinc[0].region_name +
            '-' +
            provinc[0].province_name
        }
      } else if (region[0] === 'GAT') {
        const find = this.CITY.filter(
          i => i.country_code === region[1] && i.region_code === region[0]
        )
        if (find[0]) text = find[0].country_name
      } else {
        const find = this.CITY.filter(
          i => i.country_code === region[2] && i.big_state_code === region[1]
        )
        if (find[0]) text = find[0].big_state_name + '-' + find[0].country_name
      }
      return text
    },
    formartValue(row, prop) {
      let row_text = row[prop]
      const type = { 1: '外网', 2: '内网' }
      const ip_remove_sensitive_text = { 1: '脱敏', 2: '不脱敏' }
      switch (prop) {
        case 'ip_version':
          row_text = 'IPv' + row[prop]
          break
        case 'use_type':
          row_text = this.USE_TYPE_TEXT[row[prop]] || ''
          break
        case 'ip_type':
          row_text = type[Number(row[prop])]
          break
        case 'ip_remove_sensitive':
          row_text = ip_remove_sensitive_text[Number(row[prop])] || ''
          break
        case 'server_id':
          row_text =
            this.servers.filter(i => i.id === row[prop]).length &&
            this.servers.filter(i => i.id === row[prop])[0].ip
          break
        default:
          row_text = row_text || '--'
          break
      }
      return row_text || '--'
    },
    handlePagination(params) {
      this.pagination.page = params.page
      this.pagination.per_page = params.pre_page
      this.init()
    },

    getLineType(data) {
      let row_text = ''
      const isp_type = Form.isp_lines
      if (data.isp_line_type === 1) {
        row_text =
          (isp_type.filter(i => i.value === data.isp_lines)[0] &&
            isp_type.filter(i => i.value === data.isp_lines)[0].label) ||
          ''
      } else {
        const isp_lines = data.isp_lines.split(',')
        isp_lines.forEach((i, index) => {
          if (index === 0) {
            row_text =
              (isp_type.filter(isp => isp.value === i)[0] &&
                isp_type.filter(isp => isp.value === i)[0].label) ||
              ''
          } else {
            row_text =
              isp_type.filter(isp => isp.value === i)[0] &&
              isp_type.filter(isp => isp.value === i)[0].label + ',' + row_text
          }
        })
      }
      return row_text
    },
    getNetFeeType(data) {
      let text = ''
      const NET_FEE_TYPE = Form.NET_FEE_TYPE
      text =
        (NET_FEE_TYPE.filter(i => i.value === Number(data.net_fee_type))[0] &&
          NET_FEE_TYPE.filter(i => i.value === Number(data.net_fee_type))[0]
            .label) ||
        '--'
      return text || '--'
    },
    getRiskPolicy(data) {
      let text = ''
      const RISK_POLICY = Form.risk_policy
      text =
        (RISK_POLICY.filter(i => i.value === Number(data.risk_policy))[0] &&
          RISK_POLICY.filter(i => i.value === Number(data.risk_policy))[0]
            .label) ||
        '--'
      return text || '--'
    },
    getAdsCleanType(data) {
      let text = ''
      const ADS_CLEAN_TYPE = Form.ADS_CLEAN_TYPE
      text =
        (ADS_CLEAN_TYPE.filter(
          i => i.value === Number(data.ads_clean_type)
        )[0] &&
          ADS_CLEAN_TYPE.filter(i => i.value === Number(data.ads_clean_type))[0]
            .label) ||
        '--'
      return text || '--'
    },
    changeSel(sel) {
      this.selRow = sel
    },
    handleSchedule() {
      if (!this.selRow.length) {
        this.message.warning('请选择数据!')
        return
      }
      this.visible = false
      const params = { ip: [], type: 'add' }
      this.selRow.forEach(i => {
        params.ip.push(i.ip)
      })
      this.$confirm('此操作将批量调度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.InvokeAssetApi.post('/serverIp/add_to_dispatch', params).then(
          res => {
            this.Message('ACTION_SUCCESS')
            this.init()
          }
        )
      }).catch(e => { return true })
    },
    handleRowClick(row, type) {
      const data = JSON.parse(JSON.stringify(row)) || {}
      let params = {}
      switch (type) {
        case 'edit-batch':
          if (!this.selRow.length) {
            this.message.warning('请选择数据!')
            return
          }
          this.$refs.dialogEdit.handleOpen(
            this.selRow,
            'edit-batch',
            this.BIG,
            this.activeTab
          )
          break
        case 'edit':
          this.$refs.dialogEdit.handleOpen(
            data,
            'edit',
            this.BIG,
            data.use_type
          )
          break
        case 'dispatch':
          params = { ip: [data.ip], type: 'add' }
          this.InvokeAssetApi.post('/serverIp/add_to_dispatch', params).then(
            res => {
              this.Message('ACTION_SUCCESS')
              this.init()
            }
          )
          break
        default:
          break
      }
    },

    getRegion() {
      this.InvokeAssetApi.get('/region/get', { page: 1 }).then(res => {
        const list = JSON.parse(JSON.stringify(res.list))
        this.CITY = list
        const BIG = Form.getBig(list)
        this.BIG = BIG
      })
    },

    getHouse(server_id) {
      const IP = this.servers.filter(i => Number(i.id) === Number(server_id))
      if (IP[0]) {
        this.idc_house_text = ''
        this.InvokeAssetApi.get('/idc_house/info', {
          id: Number(IP[0].idc_house_id)
        }).then(res => {
          this.idc_house_text = res.ukey || res.name
        })
      }
    }
  }
}
</script>
