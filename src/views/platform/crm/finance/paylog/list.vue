<style lang="postcss" scoped>
.app-center-finance-bill-main {
  padding: 10px;
  .input-box {
    width: 210px;
    margin: 0 2px 5px;
  }
  .m-5 {
    margin: 5px;
  }
}
</style>
<template>
  <div class="app-center-finance-bill-main">
    <DmToolbar>
      <InputSearch
        v-model="bindParams.member_email"
        placeholder="用户邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <DmSelect
        v-model="bindParams.flow_source"
        :selects="FLOW_SOURCE"
        placeholder="打款路径"
        class="input-box"
        @change="$refs.DmData.initPage()"
      />
      <DmSelect
        v-model="bindParams.flow_status"
        :selects="FLOW_STATUS"
        placeholder="状态"
        class="input-box"
        @change="$refs.DmData.initPage()"
      />
      <el-date-picker
        v-model="flow_time"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        range-separator=" "
        class="input-box"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开具日期"
        end-placeholder=" "
        @change="changeTime"
      />
      <el-button
        :loading="loading"
        type="primary"
        icon="el-icon-search"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
    </DmToolbar>
    <DmData ref="DmData" @init="fetchList" >
      <el-card :body-style="{ padding: '5px' }" shadow="always" >
        <el-tabs
          v-model="bindParams.plat"
          class="m-5 tab-box"
          type="card"
          @tab-click="$refs.DmData.initPage()"
        >
          <ElTabPane label="云盾" name="yd" />
          <ElTabPane label="白山云" name="bs" />
        </el-tabs>
        <DmAlert style="margin-bottom: 10px;">
          <i class="el-icon-info primar-color" />
          <span class="tip-text">合计打款数量: </span> <span class="primar-color tip-text">{{ responseData.total }} </span>
          <span class="tip-text">合计打款金额: </span> <span class="primar-color tip-text">{{ responseData.total_flow_money }}</span>
        </DmAlert>
        <DmTable :loading="loading" class="m-5" >
          <el-table :data="list" >
            <el-table-column v-for="(item, index) in column" :key="index" :label="item.label" :width="item.width" show-overflow-tooltip >
              <template slot-scope="scope">
                <div v-if="item.prop === 'flow_source'">
                  {{ FLOW_SOURCE_TEXT[Number(scope.row.flow_source)] }}
                </div>
                <div v-else-if="item.prop === 'flow_money'">
                  {{ Math.abs(Number(scope.row.flow_money)).toFixed(2) }}
                </div>
                <div v-else-if="item.prop === 'flow_status'">
                  <el-tag :type="Number(scope.row.flow_status) === 1 ?'success':'warning'">{{ FLOW_STATUS_TEXT[Number(scope.row.flow_status)] || '--' }}</el-tag>
                </div>
                <div v-else>
                  {{ scope.row[item.prop] }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </Dmtable>
      </el-card>
    </DmData>
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
import consoleData from '@/mixins/consoleData'
import * as FORM from './form'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/financial.flow.pay.list',
      flow_time: '',
      bindParams: {
        member_email: '',
        flow_source: '',
        flow_status: '',
        flow_time_start: '',
        flow_time_end: '',
        plat: 'yd'
      },
      column: [
        { label: 'ID', prop: 'id', width: 100 },
        { label: '打款流水号', prop: 'flow_code' },
        { label: '所属订单', prop: 'order_id' },
        { label: '用户邮箱', prop: 'member_email' },
        { label: '打款路径', prop: 'flow_source' },
        { label: '打款金额', prop: 'flow_money' },
        { label: '打款时间', prop: 'flow_time' },
        { label: '状态', prop: 'flow_status' }
      ],
      FLOW_STATUS: FORM.FLOW_STATUS,
      FLOW_STATUS_TEXT: FORM.FLOW_STATUS_TEXT,
      FLOW_SOURCE_TEXT: FORM.FLOW_SOURCE_TEXT,
      myBackToTopStyle: FORM.myBackToTopStyle,
      FLOW_SOURCE: FORM.FLOW_SOURCE
    }
  },
  methods: {
    changeTime(val) {
      this.bindParams.flow_time_start = val ? val[0] || '' : ''
      this.bindParams.flow_time_end = val ? val[1] || '' : ''
      this.$refs.DmData.initPage()
    }
  }
}
</script>
