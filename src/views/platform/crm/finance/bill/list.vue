<style lang="postcss" scoped>
.app-center-finance-bill-main{
  padding: 10px;
  .search-form{
    margin: 5px;
  }
  .search-form-item {
    margin-bottom: 5px;
  }
  .search-form-input {
    width: 200px;
  }
  .m-5 {
    margin: 5px;
  }
}
</style>
<template>
  <div class="app-center-finance-bill-main">
    <DmData ref="dmData" :params="params" :inner-card="false" @init="init">
      <yd-dm-header>
        <el-form ref="searchForm" :model="search" size="mini" label-width="0px" class="search-form">
          <ElFormItem label="" class="search-form-item">
            <el-input v-model="search.bill_id" placeholder="账单ID" suffix-icon="el-icon-search" clearable class="search-form-input" @keyup.enter.native="handleload"/>
            <el-input v-model="search.order_id" placeholder="订单ID" suffix-icon="el-icon-search" clearable class="search-form-input" @keyup.enter.native="handleload"/>
            <!-- <el-cascader
              ref="meal_select"
              :options="MealAll"
              class="search-form-input"
              expand-trigger="click"
              placeholder="套餐"
              change-on-select
              clearable
              @change="handleSelctProduct"/> -->

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
                handleload()
              }"
            />
          </ElFormItem>
          <ElFormItem label="" class="search-form-intem">
            <el-input v-model="search.email" placeholder="用户邮箱" suffix-icon="el-icon-search" clearable class="search-form-input" @keyup.enter.native="handleload"/>
            <el-date-picker
              v-model="search.time"
              type="date"
              placeholder="计费时间"
              suffix-icon="el-icon-search"
              clearable
              class="search-form-input"
              @change="handleload"/>
            <el-select v-model="search.confirm" placeholder="财务确认状态" clearable class="search-form-input" @change="handleSelctProduct">
              <ElOption v-for="(item, index) in CONFIRM" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
            <el-button :loading="loading" type="primary" icon="el-icon-search" style="width:85px;" @click="handleload">搜 索</el-button>
          </ElFormItem>
          <el-form-item label="" class="search-form-item">
            <h3>合计:<br>
              应收金额 ： {{ is_select ? Number(sum_total_select).toFixed(2) : sum_total }}
              <el-button size="mini" icon="el-icon-setting" type="" plain style="margin-left:20px;" @click="handleSetColumn()">自定义列</el-button>
            </h3>
          </el-form-item>
        </el-form>
      </yd-dm-header>
      <el-card shadow="always">
        <DmTable v-loading="loading" class="m-5">
          <el-table :data="list" :key="key" border fit highlight-current-row style="width: 100%">
            <el-table-column v-for="(fruit,index) in defalutColumns" :key="index" :width="fruit.width" :label="fruit.label">
              <template slot-scope="scope">
                {{ scope.row[fruit.prop] }}
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </el-card>
    </DmData>
    <DialogPayBack ref="dialogPayBack" @loadGrid="handleload"/>
    <TabAutoClumn ref="tabAutoClumn" :columns="columns" :check="checkColumns" @initColumn="initColumn"/>
    <el-tooltip placement="top" content="回到顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade"/>
    </el-tooltip>

  </div>
</template>
<script>

import MealResource from '@/api/mealApi'
import * as FORM from './form'
import defaultSetting from '@/core/defaultSetting'
import BackToTop from '@/components/BackToTop'
import DialogPayBack from './components/DialogPayBack'
import DialogDetail from './components/DialogDetail'
import TabAutoClumn from '@/components/TabAutoClumn/index'
const columns = [
  {
    label: 'ID',
    prop: 'id'
  },
  {
    label: '事件',
    prop: 'event',
    width: 200
  },
  {
    label: '时间线',
    prop: 'timeLine'
  },
  {
    label: '备注',
    prop: 'comment'
  }
]
export default {
  components: { BackToTop, DialogDetail, DialogPayBack, TabAutoClumn },
  data() {
    return {
      columns: columns,
      defalutColumns: columns,
      checkColumns: [
        'id', 'event', 'timeLine', 'comment'
      ],
      list: [{ id: '123213' }],
      loading: false,
      params: {},
      is_select: false,
      sum_total_select: 0.00,
      sum_total: 0.00,
      search: FORM.LIST_SEARCH,
      CONFIRM: FORM.CONFIRM,
      MealAll: [],
      productList: [],
      myBackToTopStyle: FORM.myBackToTopStyle,
      key: 1 // table key
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },

  mounted() {
    // this.search.reset()
    this.$nextTick(() => {
      // this.$refs.searchForm.resetFields()
      this.getMealList()
    })
  },
  methods: {
    handleSetColumn() {
      this.$refs.tabAutoClumn.handleOpen()
    },
    initColumn(data) {
      this.key = this.key + 1
      this.defalutColumns = this.columns.filter(i => data.indexOf(i.prop) >= 0)
      this.init()
    },
    async init(params) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
    },

    handleload() {
      this.init()
    },

    handleSelctProduct(val) {
      this.search.meal_flag = ''
      this.search.product_flag = ''
      if (val.length > 0) {
        this.search.product_flag = val[0] || ''
        this.search.meal_flag = val[1] || ''
      } else {
        this.handleload()
      }
    },
    async getMealList() {
      this.MealAll = []
      this.productList = []
      const params = {
        page: 1, per_page: 9999
      }

      await MealResource.getProductMeal(params).then(res => {
        const list = res
        this.productList = list
        this.MealAll = defaultSetting.getProductGroup(list)
      })
    },

    hangdRowClick(type, data) {
      const { dialogDetail, dialogPayBack } = this.$refs
      switch (type) {
        case 'INFO' :
          dialogDetail.handleOpen(data)
          break
        case 'PAYBACK':
          dialogPayBack.handleOpen(data)
          break
        case 'CONFIRM' :
          this.handleConfirm(data)
          break
        default:
          break
      }
    },

    handleConfirm(data) {
      this.$confirm('账单确认后将会生成应收账单，是否确认操作？', '确认账单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Message('ACTION_SUCCESS')
      }).catch(e => { return true })
    }
  }
}
</script>
