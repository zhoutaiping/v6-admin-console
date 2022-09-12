<template>
  <el-card :body-style="{'padding':'10px'}">
    <DmToolbar>
      <div slot="right">
        <DmSelect
          v-model="column_status"
          :selects="options.column_status"
          :clearable="false"
          class="input-box"
          @change="e =>{
            column = e === 'ip' ? ip_column : cell_column
            API_INDEX = e === 'ip' ?'/ip/distribute/list':'/ip/distributeinfo/list'
            $refs.DmData.initPage()
          }"
        />
        <DmSelect
          v-model="bindParams.status"
          :selects="options.status"
          class="input-box"
          placeholder="状态"
          @change="$refs.DmData.initPage()"
        />

        <InputSearch
          v-model="bindParams.ip"
          placeholder="IP"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
      </div>

      <el-button
        :disabled="options.selRow.length === 0"
        type="primary"
        @click="batchStatus(options.selRow, 1)"
      >启用</el-button>
      <el-button
        :disabled="options.selRow.length === 0"
        type="primary"
        @click="batchStatus(options.selRow, 2)"
      >暂停</el-button>
      <el-button
        :disabled="options.selRow.length === 0"
        type="primary"
        @click="$refs.deleteDisp.handleOpen(options.selRow)"
      >删除&调度</el-button>
      <el-button
        type="primary"
        @click="setColumn"
      >自定义展示</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table
          :data="list"
          @selection-change="e =>{ options.selRow = e}"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            v-for="(_, _index) in column"
            :key="_.prop"
            :label="_.label"
            :width="_.width"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              <template v-if="_.prop === 'ip_alive'">
                <template v-if="column_status === 'cell'">
                  <span :class="row.status === 1 ? 'color--primary':'color--danger'">
                    {{ formartValue(row, 'status') }}
                    <el-divider direction="vertical"/>
                  </span>
                </template>
                <span :class="row.ip_alive === 1 ? 'color--success':'color--danger'">
                  {{ formartValue(row, 'ip_alive') }}
                </span>
              </template>
              <template v-else-if="_.prop === 'groupInfo'">
                <span v-show="row.group_bn">【{{ row.group_bn }}】</span>
                {{ row.group_name }}
              </template>
              <template v-else-if="_.prop === 'ippoolInfo'">
                <template v-if="column_status === 'cell'">
                  <span v-show="row.ippool_bn">【{{ row.ippool_bn }}】</span>
                  {{ row.ippool_name }}
                </template>
                <template v-els>
                  <div v-for="ippool in row.ippoolInfo" :key="ippool.ippool_bn">
                    【{{ ippool.ippool_bn }}】{{ ippool.name }}
                  </div>

                </template>
              </template>
              <div v-else>
                {{ formartValue(row, _.prop) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AutoColumn ref="autoColumn" @initColumn="initColumn" />
    <DeleteDisp ref="deleteDisp" @init="$refs.DmData.initPage()"/>
  </el-card>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import DeleteDisp from './components/delete-disp'
export default {
  components: { DeleteDisp },
  mixins: [consoleData, initColumn],
  data() {
    return {
      pannel_name: 'resources_allocated-template',
      initPage: false,
      fetch: this.FetchDisp,
      API_INDEX: '/ip/distribute/list',
      bindParams: {
        status: '',
        ip: ''
      },

      ip_column: [
        { label: '节点ID', prop: 'ip_id' },
        { label: '节点IP', prop: 'ip' },
        { label: '已绑定资源包', prop: 'ippoolInfo' },
        { label: '健康状态', prop: 'ip_alive' }
      ],
      cell_column: [
        { label: '节点ID', prop: 'id' },
        { label: '节点IP', prop: 'ip' },
        { label: '已绑调度包', prop: 'groupInfo' },
        { label: '已绑定资源包', prop: 'ippoolInfo' },
        { label: '使用状态/健康状态', prop: 'ip_alive' }
      ],
      column: [],
      column_status: 'ip',
      options: {
        column_status: [
          { label: 'IP维度', value: 'ip' },
          { label: '详细列', value: 'cell' }
        ],
        selRow: [],
        ip_alive: {
          0: '宕机智能',
          1: '正常智能',
          2: '宕机离线',
          3: '宕机在线',
          4: '正常离线',
          5: '正常在线'
        },
        isp: [],
        status: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ],
        group: []
      }
    }
  },
  created() {
    this.column = this.column_status === 'ip' ? this.ip_column : this.cell_column
  },
  methods: {
    formartValue(data, prop) {
      const value = data[prop]
      if (prop === 'ip_alive') {
        return this.options.ip_alive[value]
      } else if (prop === 'status') {
        return value === 1 ? '启用' : '暂停'
      }
      return value
    },

    async batchStatus(list, status) {
      try {
        const params = {
          ips: list.map(i => i.ip),
          type: status
        }
        await this.FetchDisp.post('/ip/distribute/op', params)
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
.input-box {
  width: 160px;
  margin: 0 0 5px 5px;
}
</style>
