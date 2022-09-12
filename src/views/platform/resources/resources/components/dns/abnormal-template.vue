<template>
  <div>
    <el-card :body-style="{'padding':'10px'}">
      <div>
        <DmToolbar>
          <div slot="right">
            <InputSearch
              v-model="bindParams.template_name"
              placeholder="模板名称"
              class="input-box"
              @submit="$refs.DmData.initPage()"
            />
            <DmSelect
              v-model="bindParams.status"
              :selects="options.status"
              class="input-box"
              placeholder="状态"
              @change="$refs.DmData.initPage()"
            />
            <el-date-picker
              v-model="time"
              :default-time="['00:00:00', '23:59:59']"
              type="daterange"
              range-separator="-"
              class="time-box"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="创建开始日期"
              end-placeholder="结束日期"
              @change="e =>{
                bindParams.start_time = e && e[0] && e[0] || ''
                bindParams.end_time = e && e[1] && e[1] || ''
                $refs.DmData.initPage()
              }"
            />

          </div>
          <el-button type="primary" @click="$refs.DialogRow.handleOpen()">  新增异常处置策略模板</el-button>

          <el-dropdown trigger="click" placement="bottom-start" >
            <el-button plain >批量操作<i class="el-icon-arrow-down el-icon--right"/></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="options.selRow.length === 0" >
                <div @click="e=>{handleAction('start')}"> 启  用 </div>
              </el-dropdown-item>
              <el-dropdown-item :disabled="options.selRow.length === 0" >
                <div @click="e=>{handleAction('stop')}"> 禁  用 </div>
              </el-dropdown-item>
              <el-dropdown-item :disabled="options.selRow.length === 0" >
                <div @click="e=>{handleAction('delete')}"> 删 除 </div>
              </el-dropdown-item>
              <el-dropdown-item :disabled="options.selRow.length === 0" >
                <div @click="e=>{handleAction('application')}"> 应 用 </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button type="primary" @click="setColumn" >自定义展示</el-button>
        </DmToolbar>
        <DmData ref="DmData" @init="fetchList" >
          <DmTable :loading="loading">
            <el-table
              :data="list"
              @selection-change="e =>{ options.selRow = e}"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column
                v-for="tab in filtet_column"
                :key="tab.prop"
                :label="tab.label"
                :width="tab.width"
              >
                <template slot-scope="{row}">
                  <template v-if="tab.prop === 'bn'">
                    {{ row.bn }}<br> {{ row.template_name }}
                  </template>
                  <template v-if="tab.components === 'ColumnUseStatus'">
                    <span v-if="Number(row.use_status) === 0" class="color--danger" >未应用</span>
                    <span v-else class="color--success" >已应用</span>
                  </template>
                  <template v-else-if="tab.prop === 'status'">
                    <span v-if="Number(row.status) === 0" class="color--danger" >禁用</span>
                    <span v-else class="color--success" >启用</span>
                  </template>
                  <template v-else-if="tab.prop ==='created_at'">
                    {{ formartValue(row, 'created_at') }}<br>
                    {{ formartValue(row, 'updated_at') }}
                  </template>
                  <template v-else>
                    {{ formartValue(row, tab.prop) }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button type="text" @click="$refs.DialogRow.handleOpen(scope.row)">编辑</el-button>
                  <el-divider direction="vertical" />
                  <router-link :to="`/platform/resources/resources/dns-abnormal-detail/${scope.row.id}`">
                    <el-button type="text">编辑规则</el-button>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmData>
      </div>
    </el-card>
    <AutoColumn ref="autoColumn" @initColumn="initColumn" />
    <DialogRow ref="DialogRow" @init="$refs.DmData.initPage()" />
  </div>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import { mapState } from 'vuex'
import DialogRow from './components/DialogRow-abnormal'
export default {
  components: { DialogRow },
  mixins: [consoleData, initColumn],
  data() {
    return {
      pannel_name: 'resources_abnormal-template',
      initPage: false,
      API_INDEX: '/fd/V4/dispatch.template.get',
      bindParams: {
        template_name: '',
        stauts: '',
        updated_at: '',
        start_time: '',
        end_time: '',
        template_type: 'abnormal'
      },
      time: '',
      options: {
        selRow: [],
        service_type: [
          { label: '免费 ', value: 'fee' },
          { label: '付费', value: 'nofee' }
        ],
        type: [
          { label: '全局非默认', value: 'notglobal' },
          { label: '全局', value: 'global' },
          { label: '自定义', value: 'custom' }
        ],
        status: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      },
      column: [
        { label: '模板', prop: 'bn' },
        { label: '版本', prop: 'service_type' },
        { label: '模板类型', prop: 'type' },
        { label: '状态', prop: 'status' },
        { label: '创建/更新时间', prop: 'created_at' },
        { label: '最后一次操作员', prop: 'operator' },
        { label: '规则数量', prop: 'rule_num' },
        {
          label: '应用状态',
          width: 80,
          prop: 'use_status',
          components: 'ColumnUseStatus'
        },
        { label: '备注', prop: 'remark' }
      ]
    }
  },
  computed: {
    ...mapState({
      node_type: state => state.disp.node_type
    })
  },
  methods: {
    async handleAction(name) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        const params = {
          id: this.options.selRow.map(i => i.id)
        }

        try {
          if (name === 'start') {
            params.status = 1
            await this.InvokeAllApi.put('/fd/V4/dispatch.template.save', params)
          } else if (name === 'stop') {
            params.status = 0
            await this.InvokeAllApi.put('/fd/V4/dispatch.template.save', params)
          } else if (name === 'delete') {
            await this.InvokeAllApi.delete('/fd/V4/dispatch.template.del', params)
          } else if (name === 'application') {
            params.use_status = 1
            await this.InvokeAllApi.put('/fd/V4/dispatch.template.save', params)
          }
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      }).catch(e => { return true })
    },

    formartValue(data, prop) {
      const value = data[prop]
      if (prop === 'service_type') {
        return this.options.service_type.find(i => { return i.value === value }) ? this.options.service_type.find(i => { return i.value === value }).label : ''
      } else if (prop === 'type') {
        return this.options.type.find(i => { return i.value === value }) ? this.options.type.find(i => { return i.value === value }).label : ''
      }
      return value
    }
  }
}
</script>
<style lang="scss" scoped>
.input-box {
  width: 160px;
  margin: 0 0 5px 5px;
}
.time-box {
  width: 340px;
  margin: 0 0 5px 5px;
}
</style>
