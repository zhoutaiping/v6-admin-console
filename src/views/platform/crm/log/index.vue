<style lang="scss" scoped>
.input-box {
  width: 210px;
  margin-bottom: 5px;
}
</style>
<template>
  <console-page-layout>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.operator"
        placeholder="操作管员邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.user_email"
        placeholder="被操作用户邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.data_key"
        placeholder="操作对象"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.ip"
        placeholder="操作IP"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <InputSearch
        v-model="bindParams.op_type"
        placeholder="操作类型"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <el-date-picker
        v-model="value"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="input-box"
        @change="changeDate"
      />
      <el-button
        type="primary"
        @click="$refs.DmData.initPage()"
      >搜索</el-button>
      <el-button
        :disabled="exportLoading"
        type="primary"
        @click="exportData"
      >导出</el-button>
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
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="item.prop === 'update_at'">
                {{ formartData(scope.row.update_at) }}
              </div>
              <div v-else-if="item.prop === 'data_key'">
                <div
                  v-for="(_, _i) in Object.keys(scope.row.data_key)"
                  v-show="responseData.data_key_map[_]"
                  :key="_i"
                >
                  {{ responseData.data_key_map[_] }} : {{ scope.row.data_key[_] }}
                </div>
              </div>
              <div v-else-if="item.prop === 'ip'">
                {{ formartValue(scope.row, item.prop) }}
                <span v-show="scope.row.client_port">：</span>
                {{ formartValue(scope.row, 'client_port') }}
              </div>
              <div v-else>
                {{ formartValue(scope.row, item.prop) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.info.handleOpen(scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <info ref="info" />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import info from './info'
import moment from 'moment'
export default {
  components: { info },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/oplog/list',
      fetch: this.InvokeOpLogApi,
      list: [],
      bindParams: {
        operator: '',
        user_email: '',
        domain: '',
        ip: '',
        start_time: '',
        end_time: '',
        op_type: '',
        data_key: ''
      },
      exportLoading: false,
      value: '',
      column: [
        { label: '操作时间', prop: 'update_at', width: 160 },
        { label: '操作者(管理员)', prop: 'op_admin_name' },
        { label: '操作者(用户)', prop: 'op_user_email' },
        { label: '被操作账号(邮箱)', prop: 'user_email' },
        { label: '被操作对象', prop: 'data_key', width: 300 },
        { label: '操作IP', prop: 'ip', width: 200 },
        { label: '模块', prop: 'biz_type' },
        { label: '操作类型', prop: 'op_type' },
        { label: '状态', prop: 'result' }
      ]
    }
  },
  methods: {
    formartValue(data, prop) {
      let str = ''
      switch (prop) {
        case 'status':
          str = '成功'
          break
        case 'data_key':
          str = data[prop] ? data.user_emails : ''
          break
        default:
          str = data[prop]
          break
      }
      return str
    },
    formartData(time) {
      if (time) return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },

    changeDate(value) {
      this.bindParams.start_time = value && value.length && moment(value[0]).format('YYYY-MM-DD HH:mm:ss') || ''
      this.bindParams.end_time = value && value.length && moment(value[1]).format('YYYY-MM-DD HH:mm:ss') || ''
      this.$refs.DmData.initPage()
    },

    exportData() {
      const params = {
        ...this.bindParams, ...this.$refs.DmData.getParams(), export: 'on'
      }
      this.exportLoading = true
      let search_url = '?'
      Object.keys(params).forEach(e => {
        if (e && params[e] !== '') search_url = search_url + '&' + e + '=' + params[e]
      })
      window.open(window.location.origin + '/agw/oplog/oplog/list' + search_url)
      this.exportLoading = false
    }
  }
}
</script>
