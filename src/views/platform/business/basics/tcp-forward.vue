<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.name"
          placeholder="业务组名称"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <el-date-picker
          v-model="time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          class="input-box"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开通日期"
          end-placeholder=""
          @change="e =>{
            bindParams.start_time = ''
            bindParams.expire_time = ''
            if(e) {
              bindParams.start_time = e && e[0] && e[0] || ''
              bindParams.expire_time = e && e[1] && e[1] || ''
            }
            $refs.DmData.initPage()
          }"
        />
        <DmSelect
          v-model="bindParams.expire_status"
          :selects="options.expire_status"
          class="input-box"
          placeholder="过期状态"
          @change="$refs.DmData.initPage()"
        />
      </DmToolbar>
    </div>
    <el-card :body-style="{ padding: '5px' }" shadow="never" >
      <div class="tabs">
        <el-button type="primary" icon="el-icon-plus" @click="$refs.add.handleOpen()">新 增</el-button>
        <!-- <el-button :disabled="options.checkRow.length === 0" plain icon="el-icon-setting" @click="$refs.remark.handleOpen(options.checkRow, 'disp-domain-forward-batch.remark')">批量备注</el-button> -->
      </div>
      <div class="tabs" style="float:right;">
        <el-button @click="setColumn">自定义展示</el-button>
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
                <div v-if="_.prop === 'create_at'">
                  {{ scope.row.create_at }}<br>
                  {{ scope.row.expire_time }}
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
                    path: `/platform/business/basics/tcp-forward/${scope.row.id}`,
                    query: {
                      domain:scope.row.domain,
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
    <Add ref="add" @init="$refs.DmData.initPage()" />
    <AutoColumn ref="autoColumn" @initColumn="initColumn" />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import Add from './components/tcp-forward/add'
export default {
  components: { Add },
  mixins: [consoleData, initColumn],
  data() {
    return {
      initPage: false,
      pannel_name: 'disp_tcp-forward',
      API_INDEX: '/fd/V4/tcp.forward.list',
      bindParams: {},
      time: '',
      column: [
        { label: '业务组名称', prop: 'name', width: 200 },
        { label: '邮箱', prop: 'email', width: 200 },
        { label: '已绑定调度包', prop: 'group_name', width: 200 },
        { label: '服务开通时间/到期时间', prop: 'create_at', width: 200 },
        { label: '所属平台', prop: 'plat_type', width: 120 }
      ],
      options: {
        checkRow: [],
        expire_status: [
          { label: '到期', value: '1' },
          { label: '未到期', value: '2' }
        ]
      }
    }
  },

  methods: {
    formartValue(data, prop) {
      const val = data[prop]

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
