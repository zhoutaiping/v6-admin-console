<template>
  <DmPage
    ref="DmData"
    :page-panel="PagePanel"
    @init="fetchList"
  >
    <div slot="filter">
      <el-button
        type="primary"
        @click="$refs.add.handleOpen()"
      >新增规则集</el-button>
      <el-button
        :disabled="selRow.length === 0"
        @click="handleOpen('off')"
      >暂停</el-button>
      <el-button
        :disabled="selRow.length === 0"
        @click="handleOpen('on')"
      >启用</el-button>
      <el-button
        :disabled="selRow.length === 0"
        @click="handleOpen('del')"
      >删除</el-button>
      <el-button @click="$refs.DmData.initPage()">刷新</el-button>
    </div>

    <DmTable
      :loading="loading"
      min-height
    >
      <el-table
        :data="list"
        @selection-change="e =>{ selRow = e}"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          v-for="(_, _index) in column"
          :key="_.prop"
          :label="_.label"
          :min-width="_.width"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="_.prop === 'level'">
              <ColumnBtnSort
                :disabled="scope.row.disabled"
                :disabled-up="scope.$index === 0"
                :disabled-down="scope.$index === list.length - 1"
                type="text"
                @on-set-down="handleRuleSort(scope.$index, 'set-down')"
                @on-down="handleRuleSort(scope.$index, 'down')"
                @on-up="handleRuleSort(scope.$index, 'up')"
                @on-set-up="handleRuleSort(scope.$index, 'set-up')"
              />
            </div>
            <div v-else>
              {{ formartValue(scope.row, _.prop) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          fixed="right"
        >
          <template slot-scope="{row}">
            <router-link :to="ToDetail(row)">
              <el-button type="text">管理</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
    <Add
      ref="add"
      @init="fetchList"
    />
  </DmPage>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import Add from './components/add'
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import wafMixins from '@/views/platform/business/mixins/waf'
import { arrToSortObj } from '@/utils/array'
export default {
  components: { Add, ColumnBtnSort },
  mixins: [consoleData, wafMixins],
  data() {
    return {
      PagePanel: 'APPLICATION-NETWORK-RULE',
      API_INDEX: '/fd/V4/firewall.policyGroup.tpl.list',
      bindParams: {},
      selRow: [],
      column: [
        { label: '规则集名称', prop: 'name' },
        { label: '规则数', prop: 'policy_num' },
        { label: '更新时间', prop: 'update_at' },
        { label: '状态', prop: 'status' },
        { label: '优先级', prop: 'level' },
        { label: '备注', prop: 'remark' }
      ],
      ToDetail: (data) => {
        return {
          path: `/platform/business-application-network/rule-detail/${data.id}`,
          query: {}
        }
      }
    }
  },
  created() {
    this.initAreaView()
    this.wafFetchSettings()
  },
  methods: {
    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'status') {
        val = val === 'on' ? '启用' : '暂停'
      }
      return val
    },
    async handleRuleSort(index, type) {
      console.log(index, type)
      this.loading = true
      const list = JSON.parse(JSON.stringify(this.list)).map(item => item.id)
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
        await this.Fetch.put('/fd/V4/firewall.policyGroup.tpl.alter.sort', { new_sorts: arg })
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
      this.$message.success('操作成功')
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
          api = '/fd/V4/firewall.policyGroup.tpl.del'
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
