<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.domain"
          placeholder="域名"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="用户邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <el-select
          v-model="bindParams.user_id_sales"
          filterable
          placeholder="销售"
          clearable
          class="input-box"
          @change="$refs.DmData.initPage()"
        >
          <el-option-group
            v-for="(group, g_index) in options.sale"
            :key="g_index"
            :label="group.role_name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.value"
              :disabled="item.label === '' || item.status !=='1'"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
        <DmSelect
          v-model="bindParams.check_status"
          :selects="options.check_status_map"
          class="input-box"
          placeholder="审核状态"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.is_record"
          :selects="options.is_record"
          class="input-box"
          placeholder="备案状态"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.test_user"
          :selects="options.test_user"
          class="input-box"
          placeholder="测试用户"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.agent_plat_type"
          :selects="options.agent_plat_type"
          class="input-box"
          placeholder="所属平台"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.disp_v3"
          :selects="options.disp_v3"
          class="input-box"
          placeholder="V3调度"
          @change="$refs.DmData.initPage()"
        />
        <el-date-picker
          v-model="time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="input-box"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="服务日期"
          end-placeholder=""
          @change="e =>{
            bindParams.created_at_start = ''
            bindParams.created_at_end = ''
            if(e) {
              bindParams.created_at_start = e && e[0] && e[0] || ''
              bindParams.created_at_end = e && e[1] && e[1] || ''
            }
            $refs.DmData.initPage()
          }"
        />
      </DmToolbar>
    </div>

    <el-card :body-style="{ padding: '5px' }" shadow="never" >
      <div class="tabs">
        <el-dropdown
          trigger="click"
          placement="bottom-start"
        >
          <el-button plain>批量操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="options.checkRow.length === 0">
              <div @click="$refs.batchHandAudit.handleOpen(options.checkRow, 'ok')">审核通过</div>
            </el-dropdown-item>
            <el-dropdown-item :disabled="options.checkRow.length === 0">
              <div @click="$refs.batchHandAudit.handleOpen(options.checkRow, 'fail')">审核不通过</div>
            </el-dropdown-item>
            <el-dropdown-item :disabled="options.checkRow.length === 0">
              <div @click="$refs.remark.handleOpen(options.checkRow,'disp-domain-forward-batch.remark')">批量备注</div>
            </el-dropdown-item>
            <el-dropdown-item :disabled="options.checkRow.length === 0">
              <div @click="$refs.batchBackResource.handleOpen(options.checkRow,'domain-forward')">批量回源</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="setColumn">自定义展示</el-button>
      </div>
      <DmData ref="DmData" @init="fetchList" >
        <DmTable :loading="loading">
          <el-table
            :data="list"
            @selection-change="e =>{
              options.checkRow = e
          }">
            <el-table-column type="selection" width="55" />
            <el-table-column
              v-for="(_, _index) in filtet_column"
              :key="_.prop"
              :label="_.label"
              :min-width="_.width"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-if="_.prop === 'hwws_created_at'">
                  {{ scope.row.hwws_created_at }}<br>
                  {{ scope.row.hwws_expire_time }}
                </div>
                <div v-else-if="_.prop === 'group_name'">
                  {{ scope.row.group_bn }}<br>
                  {{ formartValue(scope.row, 'group_name') }}
                </div>
                <div v-else>
                  {{ formartValue(scope.row, _.prop) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <router-link
                  :to="{
                    path: `/platform/business/basics/domain-forward/${scope.row.id}`,
                    query: {
                      domain: scope.row.domain,
                      member_id: scope.row.member_id,
                      is_record: scope.row.is_record
                    }
                }">
                  <el-button type="text">管理</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmData>
    </el-card>
    <AutoColumn ref="autoColumn" @initColumn="initColumn" />
    <Remark ref="remark" @init="$refs.DmData.initPage()" />
    <BatchBackResource ref="batchBackResource" :reason="options.reason" @init="$refs.DmData.initPage()" />
    <BatchHandAudit ref="batchHandAudit" :reason="options.reason" @init="$refs.DmData.initPage()" />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import Remark from './components/remark'
import BatchBackResource from './components/batch-back-resource'
import BatchHandAudit from './components/domain-forward/batch-hand-audit'
import { mapState } from 'vuex'
export default {
  components: { Remark, BatchBackResource, BatchHandAudit },
  mixins: [consoleData, initColumn],
  data() {
    return {
      initPage: false,
      pannel_name: 'disp_domain-forward',
      API_INDEX: '/V4/WebCdnProtection.Domain.list',
      bindParams: { },
      time: '',
      column: [
        { label: '域名', prop: 'domain', width: 200 },
        { label: '邮箱', prop: 'email', width: 200 },
        { label: '已绑定调度包', prop: 'group_name', width: 200 },
        { label: '付费服务开通时间/到期时间', prop: 'hwws_created_at', width: 200 },
        { label: '审核状态', prop: 'check_status_desc', width: 120 },
        { label: '备案信息', prop: 'is_record_desc', width: 120 },
        { label: '接入模式', prop: 'protected_mode_desc', width: 120 },
        { label: 'V3调度', prop: 'disp_v3', width: 120 },
        { label: '所属平台', prop: 'agent_plat_type', width: 120 },
        { label: '备注', prop: 'remark', width: 300 }
      ],
      options: {
        checkRow: [],
        sale: [],
        agent_plat_list: {},
        agent_plat_type: [],
        check_status_map: [],
        buy_serve: [{ label: '付费服务', value: '1' }, { label: '免费服务', value: '0' }],
        is_record: [{ label: '已备案', value: '1' }, { label: '未备案', value: '0' }, { label: '未检测', value: '2' }],
        test_user: [{ label: '测试用户', value: '1' }, { label: '非测试用户', value: '0' }],
        disp_v3: [{ label: '是', value: '1' }, { label: '否', value: '0' }],
        reason: []
      }
    }
  },
  computed: {
    ...mapState({
      conf: state => state.finance.conf
    })
  },
  watch: {
    responseData: {
      deep: true,
      handler(val) {
        let mapData
        if (this.responseData.agent_plat_list) {
          mapData = this.responseData.agent_plat_list
          this.options.agent_plat_list = this.responseData.agent_plat_list
          this.options.agent_plat_type = Object.keys(mapData).map(i => { return { label: mapData[i], value: i } })
        }
        if (this.responseData.check_status_map) {
          mapData = this.responseData.check_status_map
          this.options.check_status_map = Object.keys(mapData).map(i => { return { label: mapData[i], value: i } })
        }
        if (this.responseData.back_source_reasons) {
          mapData = this.responseData.back_source_reasons
          this.options.reason = Object.keys(mapData).map(i => { return { label: mapData[i], value: mapData[i] } })
        }
      }
    },
    conf: {
      deep: true,
      handler(val) {
        if (this.conf) {
          this.options.sale = this.conf.group
        }
      }
    }
  },
  async created() {
    this.$store.dispatch('getbasicconf')
  },
  methods: {
    init() {

    },

    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'email') {
        return data.member_info && data.member_info.email || ''
      } else if (prop === 'agent_plat_type') {
        return this.options.agent_plat_list[val] || ''
      } else if (prop === 'disp_v3') {
        return Number(val) === 1 ? '是' : '否'
      }
      return val
    }
  }
}
</script>
<style lang="scss" scoped>
.input-box{
  width: 210px;
  margin-bottom: 5px;
}
.tabs {
  display: inline-block;
  height: 50px;
  line-height: 50px;
}
</style>
