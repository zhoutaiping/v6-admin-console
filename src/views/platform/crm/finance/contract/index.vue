<style lang="postcss">
  .app-container-finance-contract{
    padding: 10px;
    .search-form {
      margin-top: 10px;
      .search-form-item {
        margin-bottom: 5px;
        .search-form-input {
          width: 200px;
        }
        .search-form-time{
          width: 405px;
        }
      }
      .top-button{
        margin-left: 5px;
      }
    }
  }
</style>
<template>
  <div class="app-container-finance-contract">
    <DmData ref="dmData" :params="params" :inner-card="false" @init="init">
      <yd-dm-header>
        <el-form :model="search" label-position="left" label-width="0px" size="mini" class="search-form">
          <el-form-item label="" class="search-form-item">
            <el-input v-model="search.id" placeholder="合同ID" clearable class="search-form-input" @keyup.enter.native="handleload"/>
            <el-input v-model="search.order_id" placeholder="关联订单ID" clearable class="search-form-input" @keyup.enter.native="handleload"/>
            <el-select v-model="search.status" placeholder="" clearable class="search-form-input" @change="handleload">
              <el-option v-for="(item,index) in STATUS" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="search-form-item">
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
            <el-date-picker
              v-model="search.created_at"
              :default-time="['00:00:00', '23:59:59']"
              class="search-form-time"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="创建开始日期"
              range-separator="至"
              end-placeholder="结束日期"/>
            <el-button type="primary" @click="handleload">搜 索</el-button>
            <el-button type="primary" class="top-button" @click="handleSave">新增合同</el-button>
          </el-form-item>
        </el-form>
      </yd-dm-header>
      <el-card>
        <DmTable v-loading="loading">
          <el-table :data="list" @selection-change="handleSelectionChange">
            <el-table-column label="" type="selection" width="55" fixed="left">></el-table-column>
            <el-table-column label="合同ID" width="80" fixed="left">></el-table-column>
            <el-table-column label="用户邮箱" width="200" show-overflow-tooltip/>
            <el-table-column label="用户名称" width="160" show-overflow-tooltip/>
            <el-table-column label="关联订单ID" width="120" show-overflow-tooltip/>
            <el-table-column label="创建时间" width="120"/>
            <el-table-column label="合同状态" width="80">
              <template slot-scope="scope">
                {{ STATUS_TEXT[scope.row.status] }}
              </template>
            </el-table-column>
            <el-table-column label="附件" width="120px">
              <template slot-scope="scope">
                <el-button type="text">下载</el-button>
                <el-button type="text">重新上传</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="text">管理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </el-card>
    </DmData>
    <dialog-contract-save ref="dialogContractSave" @handleload="handleload"/>
  </div>
</template>

<script>
import DialogContractSave from './components/dialog-contract-save'
import defaultSetting from '@/core/defaultSetting'
import MealResource from '@/api/mealApi'
export default {
  components: { DialogContractSave },
  data() {
    return {
      loading: false,
      search: { id: '', order_id: '', status: '', product_flag: '', meal_flag: '', created_at: '' },
      STATUS_TEXT: { 1: '未生效', 2: '服务中', 3: '已过期', 4: '已作废' },
      STATUS: [{ label: '全部合同状态', value: '' }, { label: '未生效', value: '1' }, { label: '服务中', value: '2' }, { label: '已过期', value: '3' }, { label: '已作废', value: '4' }],
      params: {},
      list: [],
      select: [],
      MealAll: []
    }
  },
  mounted() {
    // this.search.reset()
    this.getMealList()
  },
  methods: {
    async init(params) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
      this.$refs.dmData.init({ total: parseInt(this.list.length, 10) })
    },

    handleload() {
      this.$refs.dmData.initPage()
    },

    handleSelectionChange(val) {
      this.select = val
    },

    handleSave() {
      this.$refs.dialogContractSave.handleOpen()
    },

    async getMealList() {
      this.MealAll = []
      const params = {
        page: 1, per_page: 9999
      }

      await MealResource.getProductMeal(params).then(res => {
        const list = res
        this.MealAll = defaultSetting.getProductGroup(list)
      })
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
    }
  }
}
</script>
