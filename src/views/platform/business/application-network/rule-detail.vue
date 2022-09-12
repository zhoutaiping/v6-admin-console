<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    :back="back"
    @init="fetchList"
  >
    <div slot="filter">
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增规则</el-button>

      <el-button
        :disabled="selRow.length === 0"
        @click="handleAction('delete')"
      >删除</el-button>
      <div style="display:inline-box;float:right">
        <yd-form-select
          v-model="bindParams.action"
          :selects="actionTypeView"
          default-text="处置方式"
          style="width: 120px; margin-right: 12px;"
        />
        <InputSearch
          v-model="bindParams.searchValue"
          placeholder="匹配条件"
          style="margin-right: 12px"
          @submit="$refs.DmData.initPage()"
        />
        <el-button
          type="primary"
          @click="$refs.DmData.initPage()"
        >查询</el-button>
      </div>
    </div>

    <DmTable :loading="loading">
      <el-table
        :data="list"
        @selection-change="e =>{ selRow = e}"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="规则ID/创建时间"
          min-width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.id }}<br>
            {{ scope.row.create_at }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="200"
          label="匹配条件"
          prop="active"
        >
          <template slot-scope="scope">
            <ColumnRules :items="scope.row.rules" />
          </template>
        </el-table-column>
        <el-table-column
          label="处置方式"
          min-width="180"
        >
          <template slot-scope="scope">
            <ColumnRulesAction :data="scope.row" />
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="备注"
        >
          <template slot-scope="scope">
            <ColumnRemark
              :row="scope.row"
              @submit="handleSubmitRemark"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="70"
        >
          <template slot-scope="scope">
            <ColumnRulesStatus :data="scope.row" />
          </template>
        </el-table-column>
        <el-table-column
          label="优先级"
          min-width="100"
        >
          <template slot-scope="scope">
            <ColumnBtnSort
              :disabled="scope.row.disabled || disabledAction"
              :disabled-up="scope.$index === 0"
              :disabled-down="scope.$index === list.length - 1"
              type="text"
              @on-set-down="handleRuleSort(scope.$index, 'set-down')"
              @on-down="handleRuleSort(scope.$index, 'down')"
              @on-up="handleRuleSort(scope.$index, 'up')"
              @on-set-up="handleRuleSort(scope.$index, 'set-up')"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="right"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$refs.DialogRow.handleOpen(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="$refs.DialogLog.handleOpen(scope.row)"
            >修改记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
    <DialogRow
      ref="DialogRow"
      :type="'plus'"
      :group_id="$route.params.id"
      @init="fetchList"
    />
    <DialogLog ref="DialogLog" />
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import ColumnRemark from '@/components/Column/ColumnRemark'
import ColumnRulesStatus from '@/components/Column/ColumnRulesStatus'
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import ColumnRulesAction from './components/ColumnRulesAction'
import DialogRow from './components/DialogRow'
import DialogLog from './components/DialogLog'
import ColumnRules from './components/ColumnRules'
import { arrToSortObj } from '@/utils/array'
import wafMixins from '@/views/platform/business/mixins/waf'
export default {
  components: { ColumnRemark, DialogRow, DialogLog, ColumnRules, ColumnRulesAction, ColumnRulesStatus, ColumnBtnSort },
  mixins: [consoleData, wafMixins],
  data() {
    return {
      PagePanel: 'APPLICATION-NETWORK-RULE-DETAIL',
      API_INDEX: '/fd/V4/firewall.policy.tpl.list',
      bindParams: {
        group_id: this.$route.params.id
      },
      selRow: [],
      back: {
        path: '/platform/business-application-network/rule',
        query: {}
      },
      disabledAction: false,
      column: [
        { label: '规则集名称', prop: 'name' },
        { label: '规则数', prop: 'policy_num' },
        { label: '更新时间', prop: 'update_at' },
        { label: '备注', prop: 'remark' }
      ]
    }
  },
  computed: {
    actionTypeView() {
      return [
        {
          label: '通用',
          value: 'anticc'
        },
        {
          label: '观察',
          value: 'watch'
        },
        {
          label: '放行',
          value: 'pass'
        },
        {
          label: '阻断',
          value: 'deny'
        },
        {
          label: '封禁',
          value: 'block'
        },
        {
          label: '人机验证',
          value: 'verification'
        },
        {
          label: '加白',
          value: 'white'
        },
        {
          label: '蜜网牵引',
          value: 'web_pot'
        },
        {
          label: '重定向',
          value: 'redirect'
        }
      ]
    }
  },
  async created() {
    await this.wafFetchSettings()
    await this.initAreaView()
  },
  methods: {
    async handleAction(type) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        if (type === 'delete') {
          await this.Fetch.delete('/fd/V4/firewall.policy.tpl.del', { ids: this.selRow.map(i => i.id) })
        }
        this.$message.success('操作成功')
        this.fetchList()
      })
    },
    async handleRuleSort(index, type) {
      this.loading = true
      const list = this.list.map(item => item.id)
      const item = list.splice(index, 1)[0]

      if (type === 'up') {
        if (index === 0) { // 置顶
          list.unshift(item)
        } else { // 上移
          list.splice(index - 1, 0, item)
        }
      }
      if (type === 'down') {
        if (index === list.length - 1) { // 置底
          list.push(item)
        } else {
          list.splice(index + 1, 0, item)
        }
      }
      if (type === 'set-up') {
        list.unshift(item)
      }
      if (type === 'set-down') {
        list.push(item)
      }

      const arg = arrToSortObj(list)

      try {
        await this.Fetch.put('/fd/V4/firewall.policy.tpl.alter.sort', { new_sorts: arg })
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
      this.$message.success('操作成功')
      this.fetchList()
    },
    async handleSubmitRemark(data) {
      if (data.remark.length > 255) {
        this.$message.warning('备注内容过长, 最长支持255字节')
        return
      }
      const params = {
        id: data.id,
        remark: data.remark
      }
      try {
        await this.Fetch.put('/fd/V4/firewall.policy.tpl.alter.remark', params)
      } catch (e) {
        return
      }
      this.$message.success('编辑成功')
      this.fetchList()
    },
    async handleOpen(type) {
      try {
        let api
        let params
        if (type === 'on' || type === 'off') {
          api = '/fd/V4/firewall.policyGroup.tpl.alter.status'
          params = {
            ids: this.selRow.map(i => i.id),
            status: type
          }
          await this.Fetch.put(api, params)
        } else if (type === 'del') {
          api = '/V4/firewall.policyGroup.tpl.del'
          params = {
            ids: this.selRow.map(i => i.id)
          }
          await this.Fetch.delete(api, params)
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      } catch (error) {
        return
      }
    }
  }
}
</script>
