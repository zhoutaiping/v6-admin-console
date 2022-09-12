<template>
  <DmTable>
    <el-table :data="list" @selection-change="changeSelTab" >
      <el-table-column label="" width="55" type="selection"/>
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
            <el-tag :type="DAY_STATUS_TAG[scope.row.status]">
              {{ formartValue(scope.row, item.prop) }}
            </el-tag>
          </div>
          <div v-else-if="item.prop === 'user_name'">
            {{ scope.row.user_name.join(',') }}
          </div>
          <div v-else>
            {{ formartValue(scope.row, item.prop) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" >
        <template slot-scope="scope">
          <a class="color--primary" @click="$emit('handleRowClick', scope.row, 'info')">详 情</a>
        </template>
      </el-table-column>
    </el-table>
  </DmTable>
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
      listExpands: [],
      FINANCIAL_CONFIRM_STATUS_TAG: FORM.FINANCIAL_CONFIRM_STATUS_TAG,
      FINANCIAL_CONFIRM_STATUS_TEXT: FORM.FINANCIAL_CONFIRM_STATUS_TEXT,
      PLATFORM_TEXT: FORM.PLATFORM_TEXT,
      Column: FORM.BILL_DAY_COLUMN,
      DAY_STATUS_TAG: FORM.DAY_STATUS_TAG,
      DAY_STATUS_TEXT: FORM.DAY_STATUS_TEXT,
      DAY_CALC_WAY: FORM.DAY_CALC_WAY,
      DAY_TYPE: FORM.DAY_TYPE,
      select: []
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
          row_text = this.DAY_STATUS_TEXT[(+row[prop])]
          break
        case 'calc_way' :
          row_text = this.DAY_CALC_WAY[(+row[prop])] + '计费'
          break
        case 'type' :
          row_text = this.DAY_TYPE[(+row[prop])]
          break
      }
      return row_text || '--'
    },
    changeSelTab(val) {
      this.select = val
    },
    cellClick(row, column, cell, event) {
      if (column.label === '操作') {
        return
      }
      const index = this.listExpands.indexOf(row.id)
      if (index < 0) {
        this.listExpands.push(row.id)
        const currentExpandedIcon = document.querySelector('.el-table__expand-icon.el-table__expand-icon--expanded')
        if (currentExpandedIcon) currentExpandedIcon.click()
      } else {
        this.listExpands.splice(index, 1)
      }
    }
  }
}
</script>
