<style lang="scss" scoped>
.input-box {
  width: 150px;
  margin-right: 3px;
}
</style>
<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="handleExcel"
        >导出</el-button>
        <div slot="right">
          <InputSearch
            v-model="bindParams.member_id"
            placeholder="请输入用户ID"
            class="input-box"
            @submit="$refs.DmData.initPage()"
          />
          <InputSearch
            v-model="bindParams.broker_id"
            placeholder="请输入BrokerID"
            class="input-box"
            @submit="$refs.DmData.initPage()"
          />
          <el-date-picker
            v-model="bindParams.created_at_start"
            type="date"
            placeholder="创建开始日期"
            value-format="yyyy-MM-dd 00:00:00"
            class="input-box"
            @change="$refs.DmData.initPage()"
          />
          <el-date-picker
            v-model="bindParams.created_at_end"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd 23:59:59"
            class="input-box"
            @change="$refs.DmData.initPage()"
          />
        </div>
      </DmToolbar>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ formartValue(scope.row, item.prop) }}
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data: () => {
    return {
      API_INDEX: '/V4/sso.login.log',
      list: [],
      bindParams: {
        broker_id: '',
        member_id: '',
        created_at_start: '',
        created_at_end: ''
      },
      column: [
        { label: 'ID', prop: 'id', width: 100 },
        { label: 'BrokerID', prop: 'broker_id', width: 150 },
        { label: '用户ID', prop: 'member_id', width: 100 },
        { label: 'IP', prop: 'ip', width: 200 },
        { label: 'UserAgent', prop: 'useragent' },
        { label: '状态', prop: 'status', width: 100 },
        { label: '登陆详情', prop: 'detail' },
        { label: '添加时间', prop: 'created_at' }
      ]
    }
  },
  methods: {
    formartValue(data, prop) {
      let str = data[prop]
      if (prop === 'status') {
        str = Number(data[prop]) === 1 ? '显示' : '隐藏'
      }
      return str
    },

    handleExcel(params = {}) {
      params = {
        ...this.bindParams
      }
      this.InvokeAllApi.post('/V4/sso.login.log.export', params).then(res => {
        if (res.url) {
          window.open(res.url)
          this.Message('ACTION_SUCCESS')
          this.$refs.DmData.initPage()
        }
      })
    }
  }
}
</script>
