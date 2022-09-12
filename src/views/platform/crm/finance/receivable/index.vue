<style lang="scss" scoped>
.search-form-input {
  width: 210px;
  margin: 0 2px 5px;
}
.top-button {
margin-left: 5px;
}
.tag_text {
  margin: 1px 1px 1px 10px;
  font-size: 14px;
  font-weight: 500;
}
.op-btn {
  margin: 0 2px;
}
</style>
<template>
  <console-page-layout>
    <dm-data
      ref="dmData"
      :params="params"
      :auto-init="false"
      :inner-card="false"
      @init="init"
    >
      <DmToolbar>
        <el-form
          :model="search"
          label-position="left"
          label-width="0px"
          class="search-form"
        >
          <el-input
            v-model="search.id"
            placeholder="应收单ID"
            clearable
            class="search-form-input"
            @keyup.enter.native="$refs.dmData.initPage()"
          />
          <el-input
            v-model="search.order_id"
            placeholder="源单ID"
            clearable
            class="search-form-input"
            @keyup.enter.native="$refs.dmData.initPage()"
          />
          <el-input
            v-model="search.plan_id"
            placeholder="套餐实例ID"
            clearable
            class="search-form-input"
            @keyup.enter.native="$refs.dmData.initPage()"
          />
          <el-input
            v-model="search.email"
            placeholder="用户邮箱"
            clearable
            class="search-form-input"
            @keyup.enter.native="$refs.dmData.initPage()"
          />
          <el-input
            v-model="search.correct_member_email"
            placeholder="校正邮箱"
            clearable
            class="search-form-input"
            @keyup.enter.native="$refs.dmData.initPage()"
          />
          <el-select
            v-model="search.financial_confirm_status"
            clearable
            placeholder="财务确认状态"
            class="search-form-input"
            @change="$refs.dmData.initPage()"
          >
            <el-option
              v-for="(item,index) in FINANCIAL_CONFIRM_STATUS"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="search.type"
            clearable
            placeholder="状态"
            class="search-form-input"
            @change="$refs.dmData.initPage()"
          >
            <el-option
              v-for="(item,index) in TYPE"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="search.sync_status"
            clearable
            placeholder="状态"
            class="search-form-input"
            @change="$refs.dmData.initPage()"
          >
            <el-option
              v-for="(item,index) in SYNC_STATUS"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model="period"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator=" "
            start-placeholder="账期"
            end-placeholder=" "
            class="search-form-input"
            @change="e => {
              search.period = []
              if(e && e.length) {
                search.period = period
              }
              $refs.dmData.initPage()
            }"
          />
          <el-select
            v-model="search.test_user"
            placeholder="用户状态"
            class="search-form-input"
            @change="$refs.dmData.initPage()"
          >
            <el-option
              v-for="(item,index) in TEST_USER"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-cascader
            ref="meal_select"
            :options="MealAll"
            :props="{ checkStrictly: true }"
            class="search-form-input"
            placeholder="套餐"
            clearable
            @change="e =>{
              search.meal_flag = ''
              search.product_flag = ''
              if(e) {
                search.product_flag = e && e[0] ? e[0] :''
                search.meal_flag = e && e[1] ? e[1] :''
              }
              $refs.dmData.initPage()
            }"
          />
          <el-button
            type="primary"
            class="op-btn"
            @click="$refs.dmData.initPage()"
          >搜 索</el-button>
          <el-button
            type="primary"
            class="op-btn"
            @click="handleExport"
          >导 出</el-button>
          <el-button
            type="primary"
            class="op-btn"
            @click="handleRowClick({},'Confirm')"
          >财务确认</el-button>
          <el-button
            icon="el-icon-setting"
            plain
            class="op-btn"
            @click="setColumn"
          >自定义列</el-button>
        </el-form>
      </DmToolbar>
      <el-card
        :body-style="{ padding: '5px' }"
        shadow="never"
      >
        <el-tabs
          v-model="tabPanel"
          class="tab-box"
          type="card"
          @tab-click="changeTabPanel"
        >
          <ElTabPane
            v-for="item in tabs"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          />
        </el-tabs>
        <DmAlert style="margin-bottom: 10px;">
          <i class="el-icon-info primar-color" />
          <span class="tip-text">已选择: </span> <span class="primar-color tip-text">{{ select.length }}</span>
          <span class="tip-text">应收金额: </span> <span class="primar-color tip-text">{{ is_select ? Number(sum_total_select).toFixed(2) : sum_total }}</span>
        </DmAlert>
        <DmTable :loading="loading">
          <el-table
            ref="receivableList"
            :data="list"
            :key="tablekey"
            @selection-change="checkList"
          >
            <el-table-column
              label=""
              type="selection"
              width="55px"
              fixed="left"
            />
            <el-table-column
              v-for="(item,key) in filtet_column"
              :key="key"
              :label="getTableLabel(item.prop,item.label)"
              :fixed="item.fixed"
              :min-width="item.width"
              :show-overflow-tooltip="item.show_overflow_tooltip || true"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'type'">
                  <el-tag :type="Number(scope.row.type) === 1?'':'danger'"><span>{{ TYPE_TEXT[Number(scope.row.type)] || '--' }}</span></el-tag>
                </div>
                <div v-else-if="item.prop === 'sync_status'">
                  <el-tag :type="Number(scope.row.sync_status) === 2?'success':'warning'">{{ SYNC_STATUS_TEXT[Number(scope.row.sync_status)] || '--' }}</el-tag>
                </div>
                <div v-else-if="item.prop === 'financial_confirm_status'">
                  <span v-if="Number(scope.row.financial_confirm_status) === 2" class="color--success">确认通过</span>
                  <span v-else-if="Number(scope.row.financial_confirm_status) === 3" class="color--warning">确认不通过</span>
                  <div v-else>
                    <span disabled>未确认</span>
                    <el-divider direction="vertical"/>
                    <a class="color--primary" @click="handleRowClick(scope.row,'Confirm')">确认</a>
                  </div>
                </div>
                <div v-else>
                  {{ formartValue(scope.row, item.prop) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="left"
              fixed="right"
              width="200"
            >
              <template slot-scope="scope">
                <a class="color--primary" @click="handleRowClick(scope.row,'Detail')">详 情</a>
                <el-divider direction="vertical"/>
                <a class="color--primary" @click="handleRowClick(scope.row,'edit')">编 辑</a>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </el-card>
    </dm-data>
    <DialogReceivableDetail
      ref="dialogReceivableDetail"
      :users="users"
      @handleload="$refs.dmData.initPage()"
    />
    <DialogConfirm
      ref="dialogConfirm"
      @handleload="$refs.dmData.initPage()"
    />
    <DialogEdit
      ref="dialogEdit"
      @handleload="$refs.dmData.initPage()"
    />

    <AutoColumn
      ref="autoColumn"
      @initColumn="initColumn"
    />
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
  </console-page-layout>
</template>

<script>
import * as FORM from './from'
import DialogReceivableDetail from './components/dialog-receivable-detail'
import DialogEdit from './components/DialogEdit'
import MealResource from '@/api/mealApi'
import ReceivableResource from '@/api/finance/receivable'
import BackToTop from '@/components/BackToTop'
import DialogConfirm from './components/DialogConfirm'
import initColumn from '@/mixins/initColumn'
import defaultSetting from '@/core/defaultSetting'
export default {
  components: { DialogReceivableDetail, BackToTop, DialogConfirm, DialogEdit },
  mixins: [initColumn],
  data() {
    return {
      pannel_name: 'finance_receivable_list',
      loading: false,
      refreshLoading: false,
      is_select: false,
      tabPanel: 'yd',
      tablekey: 1,
      sum_total: 0.00, // 合计
      sum_total_select: 0.00, // 选中合计
      search: FORM.search,
      period: [],
      column: FORM.COLUMN,
      params: {},
      list: [],
      select: [],
      users: [],
      MealAll: [],
      productList: [],
      TYPE: FORM.TYPE,
      TYPE_TEXT: FORM.TYPE_TEXT,
      SYNC_STATUS: FORM.SYNC_STATUS,
      SYNC_STATUS_TEXT: FORM.SYNC_STATUS_TEXT,
      TEST_USER: FORM.TEST_USER,
      FINANCIAL_CONFIRM_STATUS: FORM.FINANCIAL_CONFIRM_STATUS,
      FINANCIAL_CONFIRM_STATUS_TEXT: FORM.FINANCIAL_CONFIRM_STATUS_TEXT, // 财务确认状态：1-未确认，2-确认通过，3-确认不通过.
      myBackToTopStyle: FORM.myBackToTopStyle,
      tabs: [
        { label: '云盾', name: 'yd' },
        { label: '白山', name: 'bs' }
      ],
      tabPanels: {}

    }
  },

  mounted() {
    this.getMealList()
  },
  methods: {
    init(params = this.$refs.dmData.getParams()) {
      params = {
        ...params,
        ...this.search,
        plat: this.tabPanel
      }
      this.loading = true
      this.select = ''
      ReceivableResource.getReceivableList(this.formatParams(params)).then(res => {
        const list = res.list && JSON.parse(JSON.stringify(res.list)) || []
        const total = res.total && Number(res.total) || 0
        this.list = list
        this.users = res.users && JSON.parse(JSON.stringify(res.users)) || {}
        this.sum_total = res.sum_total && Number(res.sum_total).toFixed(2) || 0.00
        this.$refs.dmData.init({ total: total })
        this.loading = false
      }).catch(() => {
        this.list = []
        this.sum_total = 0.00
        this.users = {}
        this.$refs.dmData.init({ total: 0 })
        this.loading = false
      })
    },

    formatParams(params) {
      const keys = Object.keys(JSON.parse(JSON.stringify(params)))
      const data = JSON.parse(JSON.stringify(params))
      keys.forEach(i => {
        if (data[i] === '') delete data[i]
      })
      return data
    },

    changeTabPanel(tabPanel) {
      this.tablekey += 1
      // this.tabPanel = tabPanel
      this.$refs.dmData.initPage()
      const plan_id_text = this.tabPanel === 'bs' ? '关联套餐ID' : '套餐实例ID'
      const order_id_text = this.tabPanel === 'bs' ? '关联月账单ID' : '订单ID'
      const order_code_text = this.tabPanel === 'bs' ? '关联日账单ID' : '订单ID'
      this.column.forEach(item => {
        if (item.prop === 'plan_id') item.label = plan_id_text
        if (item.prop === 'order_id') item.label = order_id_text
        if (item.prop === 'order_code') item.label = order_code_text
      })
    },

    getTableLabel(prop, label) {
      let label_text = label
      if (prop === 'plan_id') label_text = this.tabPanel === 'bs' ? '关联套餐ID' : label
      if (prop === 'order_id') label_text = this.tabPanel === 'bs' ? '关联月账单ID' : label
      if (prop === 'order_code') label_text = this.tabPanel === 'bs' ? '关联日账单ID' : label
      return label_text
    },

    formartValue(row, prop) {
      let row_text = row[prop]
      switch (prop) {
        case 'plan_id':
          row_text = this.tabPanel === 'bs' ? row['cbm_plan_id'] : row[prop] || row['cbm_plan_id']
          break
        case 'order_id':
          row_text = this.tabPanel === 'bs' ? row['bill_month_id'] : row[prop] || row['order_id']
          break
        case 'order_code':
          row_text = this.tabPanel === 'bs' ? row['cbm_bill_day_ids'] : row[prop] || row['order_code']
          break
        case 'meal_flag':
          row_text = this.getProductAndMealName('meal_flag', row[prop]) || this.getProductAndMealName('meal_flag', row['mp_meal_flag'])
          break
        case 'total_fee':
          row_text = row[prop] && Number(row[prop]).toFixed(2)
          break
      }
      return row_text || ' '
    },

    handleRowClick(data, type) {
      const rowData = JSON.parse(JSON.stringify(data))
      switch (type) {
        case 'Detail':
          this.handleDetail(rowData)
          break
        case 'Confirm':
          this.handleConfirm(rowData) // 确认订单
          break
        case 'edit':
          this.$refs.dialogEdit.handleOpen(rowData)
          break
      }
    },

    handleConfirm(data) {
      const SelectRow = this.select || []
      SelectRow.forEach(item => {
        if (Number(item.financial_confirm_status) !== 1) {
          this.$refs.receivableList.toggleRowSelection(item, false)
        }
      })
      const params = {}
      if (data && data.id) {
        params.id = data.id
        this.$refs.dialogConfirm.handleOpen(params) // 确认订单
        return
      }
      if (!this.select.length) {
        this.message.warning('请选择未确认状态的数据')
        return
      }
      const id = []
      this.select.forEach(item => {
        id.push(item.id)
        params.id = id
      })
      this.$refs.dialogConfirm.handleOpen(params)
    },

    async getMealList() {
      this.MealAll = []
      this.productList = []
      const params = { page: 1, per_page: 9999 }
      await MealResource.getProductMeal(params).then(res => {
        const list = res
        this.productList = list
        this.MealAll = defaultSetting.getProductGroup(list)
      })
    },

    getProductAndMealName(type, flag) {
      let name = ''
      if (type === 'product_flag') {
        this.MealAll.forEach(product => {
          if (product.value === flag) name = product.label || ''
        })
      } else if (type === 'meal_flag') {
        const meal = this.productList.find(find => {
          return find.meal_flag === flag
        })
        if (meal) name = meal.product_name + '【' + meal.meal_name + '】' || ''
      }
      return name
    },

    checkList(val) {
      this.select = val
      if (!val.length) {
        this.sum_total_select = 0.00
        this.is_select = false
        return
      }
      this.is_select = true
      let sum_total_select = 0
      for (let i = 0, len = val.length; i < len; i++) {
        sum_total_select = parseFloat(sum_total_select) + parseFloat(val[i].total_fee)
      }
      this.sum_total_select = sum_total_select
    },

    handleExport() {
      const id = []
      if (this.select.length) {
        this.select.forEach(sel => {
          id.push(sel.id)
        })
      }
      const params = {
        id: id,
        receivables: {
          product_flag: this.search.product_flag || '',
          meal_flag: this.search.meal_flag || '',
          ...this.search,
          plat: this.tabPanel
        }
      }
      this.$confirm('将会导出账单和其关联的订单，是否确认操作？', '导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ReceivableResource.receivableExport(params).then(res => {
          const url_List = []
          if (res.url) url_List.push(res.url)
          if (res.order_url) url_List.push(res.order_url)
          if (res.cdnBill_url) url_List.push(res.cdnBill_url)
          if (res.relation_bill_url) url_List.push(res.relation_bill_url)
          url_List.forEach((item, index) => {
            this.downloadFile(item)
          })
          setTimeout(() => {
            this.message.success('导出成功')
          }, 1000)
        }).catch(e => {
          this.message.warning('导出失败')
        })
      }).catch(e => { return true })
    },

    downloadFile(url) {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none' // 防止影响页面
      iframe.style.height = 0 // 防止影响页面
      iframe.src = url
      document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
      // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
      setTimeout(() => {
        iframe.remove()
      }, 5 * 60 * 1000)
    },
    handleDetail(data) {
      data.product_name = this.getProductAndMealName('product_flag', data.product_flag)
      data.meal_name = this.getProductAndMealName('meal_flag', data.meal_flag)
      this.$refs.dialogReceivableDetail.handleOpen(data)
    }
  }
}
</script>
