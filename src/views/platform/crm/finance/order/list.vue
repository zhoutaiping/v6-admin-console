
<template>
  <div style="padding:10px;">
    <Form ref="Form" :vm="$data" @init="$refs.dmData.initPage()" @changeTabs="changeTabs"/>
    <el-card :body-style="{ padding: '5px' }" shadow="never" >
      <div>
        <a-tabs
          v-model="actionTab"
          :tab-bar-style="{'border-bottom': 'none'}"
          class="actionTab"
          type="card"
          @change="handleTabs"
        >
          <a-tab-pane
            v-for="i in orderTabs"
            :tab="i.label"
            :key="i.name"
          />
        </a-tabs>
        <div class="actionTab" style="float:right;">
          <el-button type="primary" plain icon="el-icon-setting" class="op-btn" @click="$refs.dialogAdjustOrder.handleOpen()" >新增调整单</el-button>
          <el-button type="primary" plain icon="el-icon-download" class="op-btn" @click="handleExcel" >导 出</el-button>
          <el-button type="primary" plain icon="el-icon-setting" class="op-btn" @click="setColumn" >自定义列</el-button>
        </div>
      </div>
      <DmAlert v-loading="listLoading" style="margin-bottom: 10px;">
        <i class="el-icon-info primar-color" />
        <span class="tip-text">已选择: </span> <span class="primar-color tip-text">{{ selectRecord.length }}</span>
        <span class="tip-text">应付金额: </span> <span class="primar-color tip-text">{{ selectRecord.length > 0 ? pay_price_select.toFixed(2) : pay_price || 0 }}</span>
        <span class="tip-text">实付金额: </span> <span class="primar-color tip-text">{{ selectRecord.length > 0 ? pay_off_price_select.toFixed(2) : pay_off_price || 0 }}</span>
      </DmAlert>
      <DmData ref="dmData" :auto-init="false" @init="init" >
        <DmTable :loading="listLoading" class="m-top" >
          <el-table
            ref="orderList"
            :data="orderList"
            :key="tabKey"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" fixed="left" />
            <el-table-column
              v-for="(item,index) in filtet_column"
              :key="index"
              :width="item.width"
              :label="item.label"
              :prop="item.prop"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'id'">
                  <el-tooltip :content="'备注：' + scope.row.remark" class="item" effect="dark" placement="top" >
                    <el-button v-show="scope.row.remark" type="text" style="float:right;padding:5px 0;" ><i class="el-icon-document el-icon--right" /></el-button>
                  </el-tooltip>
                  {{ formatValue(scope.row, item.prop) }}
                </div>
                <div v-else-if="item.prop === 'status'">
                  <span>{{ listMap.map_order_status[scope.row.status] || '--' }}</span>
                </div>
                <div v-else-if="item.prop === 'has_receive'">
                  <el-tag :type="Number(scope.row.has_receive) === 1 ? 'success' : 'warning'">
                    {{ Number(scope.row.has_receive) === 1 ?'已拆分':'未拆分' }}
                  </el-tag>
                </div>
                <div v-else-if="item.prop === 'confirm'">
                  <div v-if="Number(scope.row.confirm) === 1">
                    <el-tag type="success">已确认</el-tag>
                  </div>
                  <div v-else>
                    <el-tag type="warning">未确认</el-tag>
                    <template v-if="scope.row.status !== '7'">
                      <el-divider direction="vertical" />
                      <el-button type="primary" size="mini" plain @click="handleRowClick(scope.row,'Confirm')" >确认</el-button>
                    </template>
                  </div>
                </div>
                <div v-else-if="item.prop === 'order_time'">
                  <span>
                    {{ scope.row.order_start_time }}<br>
                    {{ scope.row.order_end_time }}
                  </span>
                </div>
                <div v-else-if="item.prop==='performance_time'">
                  <span>
                    {{ scope.row.performance_start_time }}<br>
                    {{ scope.row.performance_end_time }}
                  </span>
                </div>
                <div v-else>{{ formatValue(scope.row, item.prop) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300" fixed="right" >
              <template slot-scope="scope">
                <a class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'Details')">详情</a>
                <a v-show="parseInt(scope.row.confirm, 10) === 0 && Number(scope.row.status) !== 7" class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'edit')">编辑</a>
                <a v-show="Number(scope.row.status) === 4 && Number(scope.row.pay_price) >= 0" class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'Receipt')">确认回款</a>
                <a v-show="Number(scope.row.status) === 5 && Number(scope.row.pay_price) >= 0" class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'Receipt')">确认回款</a>
                <a v-show="Number(scope.row.status) === 5 && Number(scope.row.pay_price) < 0" class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'Refund')">处理退款</a>
                <a v-show="Number(scope.row.confirm) === 1 && Number(scope.row.status) !== 7" class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'Reorder')">重出订单</a>
                <a v-show="parseInt(scope.row.confirm, 10) === 0 && Number(scope.row.status) !== 7" class="color--primary" style="margin:0 5px;" @click="handleRowClick(scope.row,'deserted')">作废订单</a>
                <a class="color--primary" @click="$refs.performance.handleOpen(scope.row, formatSalesName(scope.row))">业绩调整</a>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmData>
    </el-card>
    <dialog-detail ref="dialogDetail" @on-success="$refs.dmData.initPage()" />
    <dialog-payback ref="dialogPayback" @on-success="$refs.dmData.initPage()" />
    <dialog-edit ref="dialogEdit" @on-success="$refs.dmData.initPage()" />
    <dialog-refund ref="dialogRefund" @on-success="$refs.dmData.initPage()" />
    <dialog-reorder ref="dialogReorder" @on-success="$refs.dmData.initPage()" />
    <dialog-adjust-order ref="dialogAdjustOrder" @on-success="$refs.dmData.initPage()" />
    <DialogConfirm ref="dialogConfirm" @on-success="$refs.dmData.initPage()" />
    <Performance ref="performance" @on-success="$refs.dmData.initPage()"/>
    <AutoColumn ref="autoColumn" @initColumn="initColumn" />
    <el-tooltip placement="top" content="回到顶部" >
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
import indexMixins from './mixins'
import initColumn from '@/mixins/initColumn'
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [indexMixins, initColumn, consoleData],
  methods: {
    handleSelectionChange(val) {
      this.selectRecord = val
      if (!val.length) {
        this.pay_price_select = 0
        this.pay_off_price_select = 0
        return
      }
      let pay_price_select = 0
      let pay_off_price_select = 0
      for (let i = 0, len = val.length; i < len; i++) {
        const pay_price = parseFloat(val[i].pay_price)
        pay_price_select = pay_price + parseFloat(pay_price_select)
        pay_off_price_select = parseFloat(val[i].pay_off_price) + parseFloat(pay_off_price_select)
      }
      this.pay_price_select = pay_price_select
      this.pay_off_price_select = pay_off_price_select
    }
  }
}
</script>
<style lang="scss" scoped>
@import url("./index.scss");
</style>

