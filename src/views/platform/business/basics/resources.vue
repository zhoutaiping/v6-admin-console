<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.name"
          placeholder="节点组名称/标号"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.group_name"
          placeholder="调度包编号/名称"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.ip"
          placeholder="节点ip"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="用户邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.tags"
          placeholder="标签多个用,分割"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.node_type"
          :selects="options.node_type"
          class="input-box"
          placeholder="节点组类型"
          @change="$refs.DmData.initPage()"
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
          value-format="yyyy-MM-dd"
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
          value-format="yyyy-MM-dd"
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

    <el-card
      :body-style="{ padding: '5px' }"
      shadow="never"
    >
      <DmTabs
        ref="tabs"
        :tabs="options.tabs"
        :value="active"
        class="tabs"
        @init="(e) =>{
          active = e
        }"
      />
      <div
        class="tabs"
        style="float: right;"
      >
        <el-button
          type="primary"
          @click="$refs.add.handleOpen()"
        >新 增</el-button>
        <el-dropdown
          trigger="click"
          placement="bottom-start"
        >
          <el-button plain>批量操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="options.selRow.length === 0">
              <div @click="$refs.tag.handleOpen(options.selRow,'ip-pool-tag-bind')">批量设置标签</div>
            </el-dropdown-item>
            <el-dropdown-item :disabled="options.selRow.length === 0">
              <div @click="$refs.remark.handleOpen(options.selRow, 'disp-ippool-batch.remark')">批量设置备注</div>
            </el-dropdown-item>
            <el-dropdown-item :disabled="options.selRow.length === 0">
              <div @click="disp(options.selRow)">批量触发资源调度</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="setColumn" >自定义展示</el-button>
      </div>

      <DmData
        ref="DmData"
        @init="fetchList"
      >
        <DmTable :loading="loading">
          <el-table
            :data="ippool_list"
            @selection-change="e =>{ options.selRow = e}"
          >
            <el-table-column
              type="selection"
              width="55"
            />
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
                  {{ scope.row.ippool_bn }}<br>
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
                              id:scope.row.ippool_id,
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
                <template v-else-if="_.prop === 'group_bn_name'">
                  {{ formartValue(scope.row, 'group_bn') }}<br>
                  {{ formartValue(scope.row, 'group_name') }}
                </template>
                <div v-else-if="_.prop === 'ips'">
                  <div
                    v-for="i in scope.row.ips"
                    :key="i.ip"
                  >
                    {{ i.ip }} ( {{ formartValue(i, 'regions') }}/{{ formartIsp(i.isp).join(',') }} )
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
                    path: `/platform/business/basics/resources/${scope.row.ippool_id}`,
                    query: {
                      name:scope.row.name,
                      group_id:scope.row.group_id,
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
    <Tag ref="tag" @init="$refs.DmData.initPage()" />
    <Remark ref="remark" @init="$refs.DmData.initPage()" />
  </console-page-layout>
</template>
<script>
import { mapState } from 'vuex'
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import Remark from './components/remark'
import Add from './components/resource/add'
import Tag from './components/tag'
import moment from 'moment'
import SELECT from '../constant/select'
import { formartRegion } from '../constant/utils'
import { deepClone } from '@/utils'
export default {
  components: { Remark, Add, Tag },
  mixins: [consoleData, initColumn],
  data() {
    return {
      pannel_name: 'disp_resources',
      initPage: false,
      API_INDEX: '/ip/pool/list',
      time: '',
      time2: '',
      bindParams: { ip: '', email: '', name: '', tags: '', start_time: '', expire_time: '', node_type: '' },
      fetch: this.FetchDisp,
      ippool_list: [],
      column: [
        { label: '边缘节点组名称', prop: 'name', width: 300 },
        { label: '用户邮箱', prop: 'email' },
        { label: '服务类型', prop: 'service_type' },
        { label: '节点组类型', prop: 'node_type', width: 160 },
        { label: '已绑定节点IP(地域/运营商)', prop: 'ips', width: 350 },
        { label: '已绑定调度包域名', prop: 'group_bn_name', width: 160 },
        { label: '开通时间/到期时间', prop: 'create_at', width: 160 },
        { label: '最后一次调度结果', prop: 'disp_result', width: 160 }
      ],
      active: '1',
      options: {
        selRow: [],
        service_type: SELECT.service_type,
        isp: SELECT.isp,
        r_type: [
          { label: '共享资源', value: '1' },
          { label: '专享资源', value: '2' }
        ],
        node_type: [],
        tags: [],
        plat: [
          { label: '平台1', value: '1' },
          { label: '平台2', value: '2' }
        ],
        is_expired: [
          { label: '未过期', value: '1' },
          { label: '已过期', value: '2' }
        ],
        tabs: [
          { label: 'YUNDUN资源', value: '1' },
          { label: '客户私有资源', value: '2' }
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
    node_type: {
      handler(val) {
        this.options.node_type = this.node_type
      }
    },
    list: {
      deep: true,
      handler(val) {
        const list = deepClone(this.list)
        this.ippool_list = list.map(i => {
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
      } else if (prop === 'node_type') {
        return this.options.node_type.find(e => { return e.value === val }) ? this.options.node_type.find(e => { return e.value === val }).label : ''
      } else if (prop === 'cname') {
        return val || '未绑定'
      } else if (prop === 'regions') {
        return formartRegion(val, this.region_list)
      } else if (prop === 'create_at' || prop === 'expire_time') {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
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

    disp(list = []) {
      this.$confirm('此操作将触发资源调度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const params = {
            ippool_ids: list.map(i => i.ippool_id)
          }
          await this.FetchDisp.post('/ip/pool/obtain', params)
          this.Message('ACTION_SUCCESS')
          await this.$refs.DmData.initPage()
        } catch (error) {
          return
        }
      })
    },

    async edit(params = {}) {
      try {
        await this.Fetch.put('/fd/V4/disp.ippool.edit', params)
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
/deep/ .el-table__fixed-body-wrapper {
  pointer-events: all;
}
.input-box {
  width: 210px;
  margin-bottom: 5px;
}
.tabs {
  display: inline-block;
  height: 50px;
  line-height: 50px;
}
</style>
