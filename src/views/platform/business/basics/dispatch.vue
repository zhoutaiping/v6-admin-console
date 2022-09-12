<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.name"
          placeholder="调度包名称/编号"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.ip"
          placeholder="IP/CNAME"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="用户邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.is_expired"
          :selects="options.is_expired"
          class="input-box"
          placeholder="是否过期"
          @change="$refs.DmData.initPage()"
        />
        <el-date-picker
          v-model="time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="input-box"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建日期"
          end-placeholder=""
          @change="e =>{
            bindParams.start_time = ''
            if(e) {
              bindParams.start_time = e && e.join(',')
            }
            $refs.DmData.initPage()
          }"
        />
        <el-date-picker
          v-model="time2"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="input-box"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="到期日期"
          end-placeholder=""
          @change="e =>{
            bindParams.expire_time = ''
            if(e) {
              bindParams.expire_time = e && e.join(',')
            }
            $refs.DmData.initPage()
          }"
        />
      </DmToolbar>
    </div>

    <el-card :body-style="{ padding: '5px' }" shadow="never" >
      <div class="tabs">
        <el-button type="primary" @click="$refs.add.handleOpen()">新增调度组</el-button>
        <el-button :disabled="options.checkRow.length === 0" plain icon="el-icon-setting" @click="$refs.remark.handleOpen(options.checkRow,'disp-group-batch.remark')">批量备注</el-button>
      </div>
      <div class="tabs" style="float:right;">
        <el-button type="primary" @click="setColumn">自定义展示</el-button>
      </div>

      <DmData ref="DmData" @init="fetchList" >
        <DmTable :loading="loading">
          <el-table
            :data="disp_list"
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
                <div v-if="_.prop === 'create_at'">
                  {{ formartValue(scope.row, 'create_at') }}<br>
                  {{ formartValue(scope.row, 'expire_time') }}
                </div>
                <div v-else-if="_.prop === 'name'">
                  {{ scope.row.group_bn }}<br>
                  <template v-if="scope.row.edit">
                    <el-input v-model="scope.row.name" style="width:150px;"/>
                    <el-button-group size="small" style="vertical-align: bottom;">
                      <el-button plain @click="scope.row.edit = !scope.row.edit">取消</el-button>
                      <el-button
                        type="primary"
                        style="margin-left:0"
                        @click="e =>{
                          if(scope.row.name) {
                            scope.row.edit = !scope.row.edit
                            edit({
                              id:scope.row.group_id,
                              name:scope.row.name
                            })
                          }
                      }">保存</el-button>
                    </el-button-group>
                  </template>
                  <template v-else>
                    {{ formartValue(scope.row, _.prop) }}
                    <el-button type="text" icon="el-icon-edit" @click="scope.row.edit = !scope.row.edit"/>
                  </template>
                </div>
                <div v-else-if="_.prop === 'ippool_name'">
                  <div v-for="(i, _i) in scope.row.ippool_name" :key="_i">
                    {{ scope.row.ippool_ids[_i] }}（{{ i }}）
                  </div>
                </div>
                <div v-else-if="_.prop === 'ippool_ips'">
                  <div
                    v-for="i in scope.row.ippool_ips"
                    :key="i.ip"
                  >
                    {{ i.ip }} ( {{ formartValue(i, 'isp').join(',') }} / {{ formartValue(i, 'regions') }}  )
                  </div>
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
                    path: `/platform/business/basics/dispatch/${scope.row.group_id}`,
                    query: {
                      name:scope.row.name,
                      member_id:scope.row.member_id
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
    <Add ref="add" @init="$refs.DmData.initPage()" />
    <Remark ref="remark" @init="$refs.DmData.initPage()" />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import Remark from './components/remark'
import Add from './components/disp/add'
import SELECT from '../constant/select'
import { formartRegion } from '../constant/utils'
import moment from 'moment'
import { mapState } from 'vuex'
import { deepClone } from '@/utils'
export default {
  components: { Remark, Add },
  mixins: [consoleData, initColumn],
  data() {
    return {
      initPage: false,
      disp_list: [],
      pannel_name: 'disp_dispatch',
      API_INDEX: '/disp/group/list',
      fetch: this.FetchDisp,
      time: '',
      time2: '',
      bindParams: { ip: '', email: '', create_at: '', expire_time: '' },
      column: [
        { label: '调度包名称', prop: 'name', width: 300 },
        { label: '用户邮箱', prop: 'email', width: 120 },
        { label: '关联资源包', prop: 'ippool_name', width: 150 },
        { label: '服务类型', prop: 'service_type', width: 100 },
        { label: 'IP/CNAME(地域/运营商)', prop: 'ippool_ips', width: 300 },
        { label: '开通时间/到期时间', prop: 'create_at', width: 180 }
      ],
      options: {
        checkRow: [],
        service_type: SELECT.service_type,
        r_type: [
          { label: '共享资源', value: '1' },
          { label: '专享资源', value: '2' }
        ],
        tags: [],
        is_expired: [
          { label: '未过期', value: '1' },
          { label: '已过期', value: '2' }
        ],
        plat: [
          { label: '平台1', value: '1' },
          { label: '平台2', value: '2' }
        ],
        isps: [
          { label: '电信 ', value: 'dx' },
          { label: '联通 ', value: 'lt' },
          { label: '移动 ', value: 'yd' },
          { label: 'BGP ', value: 'bgp' },
          { label: 'CN2 ', value: 'cn2' },
          { label: '国际线路 ', value: 'gjxl' },
          { label: '其他 ', value: 'other' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      node_type: state => state.disp.node_type,
      region_list: state => state.disp.region_list
    })
  },

  watch: {
    list: {
      deep: true,
      handler(val) {
        const list = deepClone(this.list)
        this.disp_list = list.map(i => {
          this.$set(i, 'edit', false)
          return i
        })
      }
    }
  },

  async created() {
    await Promise.all([
      this.$store.dispatch('fetchNodeType'),
      this.$store.dispatch('featchRegion'),
      this.$store.dispatch('feachIpGroup')
    ])
  },

  methods: {
    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'service_type') {
        return this.options.service_type.find(e => { return e.value === val }) ? this.options.service_type.find(e => { return e.value === val }).label : ''
      } else if (prop === 'isp') {
        return val.map(i => { return this.options.isps.find(k => k.value === i).label || '' })
      } else if (prop === 'regions') {
        return formartRegion(val, this.region_list)
      } else if (prop === 'create_at' || prop === 'expire_time') {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      }
      return val
    },

    async edit(params = {}) {
      try {
        await this.Fetch.put('/fd/V4/disp.group.edit', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
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
