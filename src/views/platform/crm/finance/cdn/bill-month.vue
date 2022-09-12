<template>
  <DmTable>
    <el-table :data="list" >
      <el-table-column
        v-for="(item,key) in Column"
        :key="key"
        :label="item.label"
        :fixed="item.fixed"
        :width="item.width"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="item.prop === 'financial_confirm_status'">
            <el-tag :type="FINANCIAL_CONFIRM_STATUS_TAG[scope.row.financial_confirm_status]">
              {{ formartValue(scope.row, item.prop) }}
            </el-tag>
          </div>
          <div v-else-if="item.prop === 'status'">
            <el-tag :type="MONTH_STATUS_TAG[scope.row.status]">
              {{ formartValue(scope.row, item.prop) }}
            </el-tag>
          </div>
          <div v-else-if="item.prop === 'user_name'">
            {{ scope.row.user_name.join(',') }}
          </div>
          <div v-else>{{ formartValue(scope.row, item.prop) }}</div>
        </template>
      </el-table-column>
      <ElTableColumn
        label="操作"
        fixed="right"
        width="140"
      >
        <template slot-scope="scope">
          <a class="color--primary" @click="$emit('handleRowClick', scope.row, 'month-info')">详 情</a>
          <el-divider direction="vertical"/>
          <a class="color--primary" @click="$emit('handleRowClick', scope.row, 'edit')">确认账单</a>
        </template>
      </ElTableColumn>
    </el-table>
  </dmtable>
</template>

<script>
import * as FORM from './form'
export default {
  props: {
    list: {
      type: Array, default: () => []
    }
  },
  data() {
    return {
      Column: FORM.BILL_MONTH_COLUMN,
      FINANCIAL_CONFIRM_STATUS_TAG: FORM.FINANCIAL_CONFIRM_STATUS_TAG,
      PLATFORM_TEXT: FORM.PLATFORM_TEXT,
      FINANCIAL_CONFIRM_STATUS_TEXT: FORM.FINANCIAL_CONFIRM_STATUS_TEXT,
      MONTH_STATUS_TEXT: FORM.MONTH_STATUS_TEXT,
      MONTH_STATUS_TAG: FORM.MONTH_STATUS_TAG
    }
  },
  methods: {
    formartValue(row, prop) {
      let row_text = row[prop]
      switch (prop) {
        case 'financial_confirm_status':
          row_text = this.FINANCIAL_CONFIRM_STATUS_TEXT[row[prop]]
          break
        case 'platform':
          row_text = this.PLATFORM_TEXT[row[prop]]
          break
        case 'status':
          row_text = this.MONTH_STATUS_TEXT[(+row[prop])]
          break
      }
      return row_text || '--'
    }
  }
}
</script>
