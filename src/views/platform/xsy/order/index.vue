<style lang="scss" scoped>
.input-box {
  width: 185px;
  margin-bottom: 5px;
}
</style>
<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.order_id"
          placeholder="订单ID"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.order_match_opportunity"
          :selects="options.order_match_opportunity"
          class="input-box"
          placeholder="商机匹配"
          @change="$refs.DmData.initPage()"
        /><br>
        <DmSelect
          v-model="bindParams.order_rsync_status"
          :selects="options.order_rsync_status"
          class="input-box"
          placeholder="同步状态"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.order_confirm_status"
          :selects="options.order_confirm_status"
          class="input-box"
          placeholder="审核状态"
          @change="$refs.DmData.initPage()"
        />
        <el-select
          v-model="sale_user_id"
          placeholder="所属销售"
          filterable
          multiple
          collapse-tags
          clearable
          class="input-box"
          @change="e =>{
            bindParams.sale_ids = e.join(',')
            $refs.DmData.initPage()
          }"
        >
          <el-option-group
            v-for="(group, g_index) in conf.group"
            :key="g_index"
            :label="group.role_name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.user_id"
              :disabled="!item.label || item.status !=='1'"
              :label="item.label"
              :value="item.user_id"
            />
          </el-option-group>
        </el-select>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="$refs.DmData.initPage()"
        >搜索</el-button>
        <el-button
          icon="el-icon-setting"
          plain
          class="op-btn"
          @click="setColumn"
        >自定义列</el-button>
        <div slot="right">
          <el-button :disabled="selectRow.length === 0" type="primary" @click="$refs.confirm.handleOpen(selectRow)">CRM审核</el-button>
        </div>
      </DmToolbar>
    </div>
    <DmData ref="DmData" @init="fetchList">
      <DmTable :loading="loading">
        <el-table :data="list" @selection-change="e => selectRow = e">
          <el-table-column type="selection" width="55"/>
          <el-table-column v-for="(_, _index) in filtet_column" :key="_.prop" :label="_.label" :width="_.width" show-overflow-tooltip >
            <template slot-scope="scope">
              <div v-if="_.prop === 'meal_flag'">{{ mealText(scope.row.meal_flag) }}</div>
              <div v-else-if="_.prop === 'sales'">{{ saleText(scope.row.sale_user_ids) }}</div>
              <div v-else-if="_.prop === 'confirm'">
                <span :class="Number(scope.row.confirm) === 1 ? 'color--primary':'color--warning'">
                  {{ Number(scope.row.confirm) === 1?'已确认':'未确认' }}
                </span>
              </div>
              <div v-else>
                {{ formartValue(scope.row, _.prop) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <a class="color--primary" @click="$refs.edit.handleOpen(scope.row, mealText(scope.row.meal_flag))">CRM关联管理</a>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <order-edit ref="edit" @init="$refs.DmData.initPage()"/>
    <confirm ref="confirm" @init="$refs.DmData.initPage()"/>
    <AutoColumn ref="autoColumn" @initColumn="initColumn" />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import indexMixins from './mixins'
import OrderEdit from '../components/order-edit'
import Confirm from '../components/confirm'
export default {
  components: { OrderEdit, Confirm },
  mixins: [consoleData, initColumn, indexMixins],
  methods: {
    formartValue(row, prop) {
      let _text = ''
      switch (prop) {
        case 'buy_type':
          _text = this.buy_type[row[prop]] || ''
          break
        case 'payment_mode':
          _text = this.platform_text[row[prop]] || ''
          break

        case 'status':
          _text = this.order_status[row[prop]] || ''
          break
        case 'order_match_opportunity' :
          _text = this.match_opportunity_text[row[prop]] || ''
          break
        case 'order_rsync_status' :
          _text = this.rsync_text[row[prop]] || ''
          break
        case 'order_confirm_status' :
          _text = this.confirm_text[row[prop]] || ''
          break
        default :
          _text = row[prop]
          break
      }
      return _text
    },
    mealText(val) {
      let _text = ''
      if (val === '') {
        return _text
      } else {
        let meal = null
        meal = this.meal_list.find(i => {
          return i.meal_flag === val
        })
        _text = meal ? meal.product_name + '【' + meal.meal_name + '】' : val
      }
      return _text
    },
    saleText(val) {
      let _text = ''
      if (val === '') {
        return _text
      } else {
        const ids = val.split(',')
        const sale = []
        ids.forEach(_ => {
          if (this.conf.user_list.find(i => {
            return Number(i.user_id) === Number(_)
          })) {
            sale.push(this.conf.user_list.find(i => {
              return Number(i.user_id) === Number(_)
            }).name)
          }
        })
        _text = sale.join(',')
      }
      return _text
    }
  }
}
</script>
