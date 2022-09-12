<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    width="800px"
    title="修改记录"
  >
    <DmData
      ref="DmData"
      :auto-init="false"
      class="margin-top"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            width="150px"
            label="编辑时间"
          >
            <template slot-scope="scope">
              {{ scope.row.update_at }}
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="规则 ID"
            prop="id"
          />
          <el-table-column
            min-width="200"
            label="规则详情"
          >
            <template slot-scope="scope">
              <ColumnRules :items="scope.row.rules" />
            </template>
          </el-table-column>
          <el-table-column
            label="处置方式"
            min-width="100px"
          >
            <template slot-scope="scope">
              <ColumnRulesAction :data="scope.row" />
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </DmDialog>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import createDialog from '@/utils/createDialog'
import ColumnRulesAction from './ColumnRulesAction'
import wafMixins from '@/views/platform/business/mixins/waf'
import ColumnRules from './ColumnRules'

export default createDialog({
  components: { ColumnRules, ColumnRulesAction },

  mixins: [consoleData, wafMixins],

  data() {
    return {
      API_INDEX: '/fd/V4/firewall.policy.tpl.history',
      bindParams: {
        main_id: ''
      }
    }
  },

  methods: {
    afterOpen(row) {
      this.bindParams.main_id = row.id
      this.$nextTick(() => {
        this.fetchList()
      })
    }
  }
})
</script>
