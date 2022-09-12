<style lang="scss" scoped>
.is-horizonta {
  display: flex;
  margin-bottom: 16px;
  /deep/.el-card__header {
    flex: 0 0 180px;
    padding-right: 24px;
  }
  /deep/.el-card__body {
    flex: 1;
    overflow: hidden;
    clear: both;
    height: 100%;
  }
}
</style>
<template>
  <el-card class="is-horizonta">
    <div slot="header" class="clearfix">
      <span>策略列表</span>
    </div>
    <div>
      <DmToolbar>
        <el-button type="primary" @click="handleOption('4')">使用推荐策略重新生成</el-button>
        <el-button type="primary" @click="$refs.add.handleOpen(null, 'Create')">手动新增访问规则</el-button>
        <el-button :disabled="checkRow.length === 0" type="primary" @click="handleOption('2')">启 用</el-button>
        <el-button :disabled="checkRow.length === 0" type="primary" @click="handleOption('3')">删 除</el-button>
        <el-button type="primary" @click="$refs.DmData.initPage()">刷 新</el-button>
      </DmToolbar>
      <DmData
        ref="DmData"
        @init="fetchList"
      >
        <DmTable :loading="loading">
          <el-table :data="record" @selection-change="e =>{ checkRow = e}" >
            <el-table-column type="selection" width="55"/>
            <el-table-column v-for="tab in column" :key="tab.prop" :label="tab.label" :width="tab.width" show-overflow-tooltip>
              <template slot-scope="{row}">
                <template v-if="tab.prop === 'records'">
                  <div v-for="i in row['records']" :key="i.ip">
                    {{ i.level }} / {{ i.ip }}
                  </div>
                </template>
                <template v-else-if="tab.prop === 'records2'">
                  <div v-for="i in formartValue(row, tab.prop)" :key="i.ip">
                    {{ i.ip }}
                  </div>
                </template>
                <template v-else-if="tab.prop === 'status'">
                  <span :class="row.status === 0 ? 'color--primary':'color--warning'">
                    {{ formartValue(row, tab.prop) }}
                  </span>
                </template>
                <div v-else-if="tab.prop === 'name'">
                  {{ row.policy_bn }}<br>
                  <template v-if="row.edit">
                    <el-input v-model="row.name" style="width:140px;"/>
                    <el-button-group size="small" style="vertical-align: bottom;">
                      <el-button style="margin-left:0; width:50px;padding: 9px 10px;" plain @click="row.edit = !row.edit">取消</el-button>
                      <el-button
                        type="primary"
                        style="margin-left:0; width:50px;padding: 9px 10px;"
                        @click="e =>{
                          if(row.name) {
                            row.edit = !row.edit
                            editOption({
                              type:6,
                              policy_bn:row.policy_bn,
                              id:row.id,
                              disp_group_id:row.disp_group_id,
                              name:row.name
                            })
                          }
                      }">保存</el-button>
                    </el-button-group>
                  </template>
                  <template v-else>
                    {{ formartValue(row, tab.prop) }}
                    <el-button type="text" icon="el-icon-edit" @click="row.edit = !row.edit"/>
                  </template>
                </div>

                <template v-else>
                  {{ formartValue(row, tab.prop) }}
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" >
              <template slot-scope="{row}">
                <el-button type="text" @click="$refs.add.handleOpen(row, 'Edit')">编辑</el-button>
                <el-divider direction="vertical"/>
                <el-button :disabled="row.status === 1" type="text" @click="handleOption('1', [row])">暂停</el-button>
                <el-divider direction="vertical"/>
                <el-button type="text" @click="handleOption('3', [row])">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmData>
      <Add ref="add" @init="$refs.DmData.initPage()"/>
    </div>
  </el-card>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Add from './add-visit'
import moment from 'moment'
import { deepClone } from '@/utils'
export default {
  components: { Add },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/disp/policy/list',
      bindParams: {
        disp_group_id: ''
      },
      fetch: this.FetchDisp,
      checkRow: [],
      record: [],
      column: [
        { label: '策略ID', prop: 'name', width: 250 },
        { label: '请求来源', prop: 'line_groups' },
        { label: '优先级/资源', prop: 'records' },
        { label: '当前生效资源', prop: 'records2' },
        { label: '最近一次生效时间', prop: 'update_at' },
        { label: '状态', prop: 'status' },
        { label: '配置方式', prop: 'type' }
      ]
    }
  },
  watch: {
    list: {
      deep: true,
      handler(val) {
        const list = deepClone(this.list)
        this.record = list.map(i => {
          this.$set(i, 'edit', false)
          return i
        })
      }
    }
  },

  created() {
    this.bindParams.disp_group_id = this.$route.params.id
  },
  methods: {
    formartValue(data, prop) {
      const val = data[prop]
      if (prop === 'status') {
        return data[prop] === 0 ? '启用' : '暂停'
      } else if (prop === 'request_from') {
        return val && val.length && val.join(',')
      } else if (prop === 'type') {
        return data[prop] === 0 ? '自动调度' : '手动调度'
      } else if (prop === 'update_at') {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      } else if (prop === 'records2') {
        return data.records && data.records.length && data.records.filter(i => i.apply_dns !== 0) || []
      } else if (prop === 'line_groups') {
        return data.lines && Array.isArray(data.lines) ? data.lines.join(',') : ''
      }
      return val
    },
    async editOption(params) {
      try {
        await this.FetchDisp.post('/disp/policy/operate', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    },
    async handleOption(type = '', option = this.checkRow) {
      if (type === '') {
        return
      }
      const policy_bns = option.map(i => { return i.policy_bn })

      const params = {
        disp_group_id: this.$route.params.id,
        type: type,
        policy_bns
      }

      try {
        await this.FetchDisp.post('/disp/policy/operate', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    }
  }
}
</script>
