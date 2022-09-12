<style lang="scss" scoped>
.app-center-finance-bill-main {
  padding: 10px;
  .input-box {
    width: 210px;
    margin: 0 2px 5px;
  }
  .m-5 {
    margin: 5px;
  }
  .op-btn {
    margin: 0 2px;
  }
  .m-l-0 {
    margin-left: 0px;
  }
}
</style>
<template>
  <div class="app-center-finance-bill-main">
    <DmToolbar>
      <InputSearch
        v-model="bindParams.member_email"
        placeholder="用户邮箱"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <el-select
        v-model="sales_id"
        filterable
        multiple
        collapse-tags
        placeholder="所属销售"
        clearable
        class="input-box"
        @change="$refs.DmData.initPage()"
      >
        <el-option-group
          v-for="(group, g_index) in SALES"
          :key="g_index"
          :label="group.role_name"
        >
          <el-option
            v-for="item in group.children"
            :disabled="!item.label || item.status !=='1'"
            :key="item.user_id"
            :label="item.label"
            :value="item.user_id"
          />
        </el-option-group>
      </el-select>
      <el-date-picker
        v-model="flow_time"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        range-separator=" "
        class="input-box"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开具日期"
        end-placeholder=""
        @change="$refs.DmData.initPage()"
      />
      <el-button
        :loading="loading"
        type="primary"
        icon="el-icon-search"
        @click="$refs.DmData.initPage()"
      >搜 索</el-button>
      <el-button
        type="primary"
        icon="el-icon-download"
        @click="handleExport"
      >导 出</el-button>
      <el-button
        type="primary"
        @click="handleSetColumn"
      >自定义显示</el-button>
    </DmToolbar>
    <DmData ref="DmData" @init="fetchList(initParams())" >
      <el-card :body-style="{ padding: '5px' }" shadow="always" >
        <el-tabs
          v-model="actionTab"
          class="tab-box"
          type="card"
          @tab-click="handleTabs"
        >
          <el-tab-pane
            v-for="(item, index) in orderTabs"
            :key="index"
            :label="item.label"
            :name="item.name"
          />
        </el-tabs>
        <DmAlert style="margin-bottom: 10px;">
          <i class="el-icon-info primar-color" />
          <span class="tip-text">选中: </span> <span class="primar-color tip-text">{{ select.length }} </span>
          <span class="tip-text">总回款金额: </span> <span class="primar-color tip-text">{{ responseData.total_flow_money_payback }} </span>
          <span v-show="actionTab ==='1' || actionTab ==='2'">
            <span class="tip-text">总退款金额: </span> <span class="primar-color tip-text">{{ responseData.total_flow_money_refund }}</span>
          </span>
          <span v-show="select.length > 0">
            <span class="tip-text">选中回款金额: </span> <span class="primar-color tip-text">{{ select_payback_money || 0 }}</span>
          </span>
          <span v-show="select.length > 0 && (actionTab !=='3' || actionTab !=='4')">
            <span class="tip-text">选中退款金额: </span> <span class="primar-color tip-text">{{ select_refund_money || 0 }}</span>
          </span>
        </DmAlert>
        <DmTable :loading="loading" >
          <el-table :data="list" class="m-5 tab-box" @selection-change="handleSelectionChange" >
            <el-table-column type="selection" width="55" />
            <el-table-column
              v-for="(item, index) in defalutColumns"
              :key="index"
              :label="getTableLabel(item.prop, item.label)"
              :prop="item.prop"
              :min-width="item.width"
              :fixed="item.fiexd"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'flow_status'">
                  <el-tag
                    :type="Number(scope.row.flow_status) === 1 ?'success':'warning'"
                    size="mini"
                  >{{ formartValue(scope.row, item.prop) }}</el-tag>
                </div>
                <div v-else-if="item.prop === 'order_status'">
                  <el-tag size="mini">{{ formartValue(scope.row, item.prop) }}</el-tag>
                </div>
                <div v-else-if="item.prop === 'flow_source'">
                  {{ FLOW_TYPE_TEXT[scope.row.flow_type] +'--' }}{{ FLOW_SOURCE_TEXT[Number(scope.row.flow_source)] || '--' }}
                </div>
                <div v-else>
                  {{ formartValue(scope.row, item.prop) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="详情" fixed="right" width="120" >
              <template slot-scope="scope">
                <a class="color--primary" @click="handleRowClick('info', scope.row)">详 情</a>
                <el-divider direction="vertical"/>
                <a class="color--primary" @click="handleRowClick('edit', scope.row)">修 改</a>
              </template>
            </el-table-column>
          </el-table>
        </dmtable>
      </el-card>
    </DmData>
    <DialogDetail ref="dialogDetail" @loadGrid="$refs.DmData.initPage()" />
    <DialogEdit ref="dialogEdit" @loadGrid="$refs.DmData.initPage()" />
    <TabAutoClumn ref="tabAutoClumn" @initColumn="initColumn" />
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
import consoleData from '@/mixins/consoleData'
import * as FORM from './form'
import DialogDetail from './DialogDetail'
import DialogEdit from './DialogEdit'
import TabAutoClumn from '@/components/TabAutoClumn/index'
export default {
  components: { DialogDetail, DialogEdit, TabAutoClumn },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/V4/financial.flow.payback.refund.list',
      sales_id: '',
      flow_time: '',
      bindParams: { member_email: '' },
      COLUMN: FORM.COLUMN_YD,
      defalutColumns: FORM.COLUMN_YD,
      checkColumns: [],
      total_flow_money: 0,
      tablekey: 1,
      select: [],
      select_payback_money: 0,
      select_refund_money: 0,
      search: FORM.LIST_SEARCH,
      FLOW_STATUS: FORM.FLOW_STATUS,
      FLOW_STATUS_TEXT: FORM.FLOW_STATUS_TEXT,
      FLOW_SOURCE_TEXT: FORM.FLOW_SOURCE_TEXT,
      myBackToTopStyle: FORM.myBackToTopStyle,
      FLOW_SOURCE: FORM.FLOW_SOURCE,
      FLOW_TYPE: FORM.FLOW_TYPE,
      FLOW_TYPE_TEXT: FORM.FLOW_TYPE_TEXT,
      ORDERSTATUSMAP: FORM.orderStatusMap,
      actionTab: '1',
      orderTabs: FORM.orderTabs,
      SALES: []
    }
  },
  async created() {
    this.getSaleList()
  },
  methods: {
    initParams() {
      const params = {}
      params.sales_id = this.sales_id.join(',')
      params.flow_time_start = this.flow_time && this.flow_time[0] ? this.flow_time[0] : ''
      params.flow_time_end = this.flow_time && this.flow_time[1] ? this.flow_time[1] : ''
      if (this.actionTab === '1' || this.actionTab === '2') { // 云盾
        params.pay_type = this.actionTab
        params.plat = 'yd'
      }
      if (this.actionTab === '3' || this.actionTab === '4') { // 白山
        params.pay_type = this.actionTab === '3' ? '1' : '2'
        params.plat = 'bs'
      }
      return params
    },
    handleSetColumn() {
      this.$refs.tabAutoClumn.handleOpen(this.COLUMN, this.checkColumns)
    },
    initColumn(data) {
      this.tabKey += 1
      if (data) {
        this.defalutColumns = this.COLUMN.filter(i => data.indexOf(i.prop) >= 0)
        this.checkColumns = this.defalutColumns
        this.$store.dispatch('setPayBackrefundlColumn', this.checkColumns)
      } else {
        const base_column = JSON.parse(localStorage.getItem('paybackrefund_column')) || []
        this.defalutColumns = base_column.length > 0 ? base_column : this.COLUMN
        this.checkColumns = base_column.length > 0 ? base_column : []
      }
    },
    handleTabs(val) {
      if (val.name === '1' || val.name === '2') {
        this.COLUMN = FORM.COLUMN_YD
      }
      if (val.name === '3' || val.name === '4') {
        const column = JSON.parse(JSON.stringify(FORM.COLUMN_BS))
        const column_2 = column.filter(i => i.prop !== 'refund_money')
        this.COLUMN = val.name === '3' ? column : column_2
      }
      this.defalutColumns = this.COLUMN
      this.$refs.DmData.initPage()
    },
    getTableLabel(prop, label) {
      let label_text = label
      if (prop === 'order_id') {
        label_text = this.actionTab === '2' || this.actionTab === '4' ? '关联账单ID' : label
      }
      return label_text
    },
    formartValue(row, prop) {
      let row_text = row[prop]
      switch (prop) {
        case 'order_id':
          row_text = this.actionTab === '2' || this.actionTab === '4' ? row['bill_id'] : row['order_id']
          break
        case 'flow_status':
          row_text = this.FLOW_STATUS_TEXT[(+row[prop])] || '--'
          break
        case 'order_status':
          row_text = this.ORDERSTATUSMAP[(row[prop])] || '其他'
          break
        case 'flow_type':
          row_text = this.FLOW_TYPE_TEXT[row[prop]]
          break
        case 'payback_money':
          row_text = Number(row.flow_type) === 3 ? Number(row.flow_money).toFixed(2) : '--'
          break
        case 'refund_money':
          row_text = Number(row.flow_type) === 4 ? (Number(row.flow_money) * (-1)).toFixed(2) : '--'
          break
      }
      return row_text || '--'
    },
    handleRowClick(type, data) {
      const rowData = JSON.parse(JSON.stringify(data))
      rowData.sales_id = (rowData.sales_id).split(',')
      const panel_type = this.actionTab === '3' || this.actionTab === '4' ? 'bs' : 'yd'
      const is_bill = !!(this.actionTab === '2' || this.actionTab === '4')
      switch (type) {
        case 'info':
          this.$refs.dialogDetail.handleOpen(rowData, panel_type, is_bill)
          break
        case 'edit':
          this.$refs.dialogEdit.handleOpen(rowData, panel_type, is_bill)
          break
      }
    },
    handleSelectionChange(val) {
      this.select = val || []
      if (!this.select.length) return
      let select_payback_money = 0
      let select_refund_money = 0
      this.select.forEach(sel => {
        if ((+sel.flow_type) === 4) {
          select_refund_money = (+sel.flow_money) * (-1) + select_refund_money
        } else if ((+sel.flow_type) === 3) {
          select_payback_money = (+sel.flow_money) + select_payback_money
        }
      })
      this.select_payback_money = select_payback_money
      this.select_refund_money = select_refund_money
    },
    async getSaleList() {
      this.SALES = []
      await this.InvokeAllApi.get('/fd/V4/customer.manage.getbasicconf', {}).then(res => {
        const role = JSON.parse(JSON.stringify(res.role_list))
        const user = JSON.parse(JSON.stringify(res.user_list))
        const SALES = this.group(role, user)
        this.SALES = SALES
      })
    },

    group(role, user) {
      const newRole = role.filter(i => i.role_flag !== 'CRM_ADMIN') || []
      const newUser = user || []
      if (!newRole.length) return []
      newRole.forEach(r => {
        r.label = r.role_name || r.id || '--'
        r.value = r.id
        r.children = []
        newUser.forEach(u => {
          if (u.role_id === r.id) {
            u.label = u.name || u.user_id || '--'
            u.value = u.user_id || ''
            u.disabled = !u.name
            r.children.push(u)
          }
        })
      })
      return newRole
    },
    handleExport() {
      const id = []
      const api = '/V4/financial.flow.export'
      this.select.forEach(item => {
        id.push(item.id)
      })
      const params = { id: id, flow_type: ['3', '4'], ... this.initParams(), ...this.bindParams }
      this.$confirm('是否进行导出操作？', '导出操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.InvokeAllApi.post(api, params).then(res => {
          if (res.url) {
            const a = document.createElement('a')
            a.setAttribute('href', res.url)
            document.body.appendChild(a)
            a.click()
            a.style.display = 'none'
            this.Message('ACTION_SUCCESS')
          } else {
            this.Message('ACTION_ERROR')
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
