<style lang="postcss" scoped>
.app-center-finance-log {
  padding: 10px;
  .search-form-input {
    width: 180px;
    margin: 0 2px;
  }
}
</style>

<template>
  <div class="app-center-finance-log">
    <DmToolbar>
      <div slot="right">
        <InputSearch
          v-model="bindParams.user_nickname"
          placeholder="操作人员昵称"
          class="search-form-input"
          @submit="$refs.DmData.initPage()"
        />
      </div>
    </DmToolbar>
    <DmData ref="DmData" @init="fetchList" >
      <el-card :body-style="{'padding':'5px'}" shadow="never">
        <el-tabs v-model="bindParams.type" type="card" class="tab-box" @tab-click="$refs.DmData.initPage()">
          <ElTabPane label="应收日志" name="2"/>
          <ElTabPane label="流水日志" name="3"/>
        </el-tabs>
        <DmTable :loading="loading" >
          <el-table :data="list">
            <el-table-column
              v-for="(item, index) in column"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :fixed="item.fiexd"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ formartValue(scope.row, item.prop) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a class="color--primary" @click="handleRowClick(scope.row, 'info')">详 情</a>
              </template>
            </el-table-column>
          </el-table>
        </dmtable>
      </el-card>
    </DmData>
    <DialogDetail ref="dialogDetail" @loadGrid="$refs.DmData.initPage()"/>
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
import * as FORM from './from'
import DialogDetail from './components/DialogDetail'
export default {
  components: { DialogDetail },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/admin.user.log.list',
      bindParams: { user_nickname: '', type: '2' },
      column: FORM.COLUMN,
      myBackToTopStyle: FORM.myBackToTopStyle,
      tabPanels: {
        items: [
          { key: '2', title: '应收日志' },
          { key: '3', title: '流水日志' }
        ]
      }
    }
  },
  methods: {
    formartValue(row, prop) {
      let row_text = row[prop]
      if (prop === 'user_nickname') {
        row_text = '用户ID:' + row['user_id'] + '--' + row[prop]
      }
      return row_text
    },
    handleRowClick(data, type) {
      const rowData = JSON.parse(JSON.stringify(data))
      const activeTabe = this.activeTabe === '2' ? 'receivable' : 'flow'
      if (type === 'info') {
        this.$refs.dialogDetail.handleOpen(rowData, activeTabe)
      }
    }
  }
}
</script>
