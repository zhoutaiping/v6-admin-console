<style lang="scss" scoped>
.input-box {
  width: 185px;
  margin-bottom: 5px;
}
.flort-box {
  float: right;
}
</style>
<template>
  <console-page-layout>
    <div slot="filter">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.receivable_id"
          placeholder="应收ID"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
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
        /><br>

        <DmSelect
          v-model="bindParams.receivable_rsync_status"
          :selects="select.rsync_status"
          :default-text="'全部'"
          :default-value="'0'"
          placeholder="销售易同步状态"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.receivable_confirm_status"
          :selects="select.confirm_status"
          placeholder="确认状态"
          class="input-box"
          @change="$refs.DmData.initPage()"
        />
        <el-select
          v-model="sale_ids"
          filterable
          multiple
          collapse-tags
          placeholder="所属销售"
          clearable
          class="input-box"
          @change="e =>{
            bindParams.sale_ids = sale_ids.join(',')
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
          class="op-btn flort-box"
          @click="setColumn"
        >自定义列</el-button>
      </DmToolbar>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            v-for="(_, _index) in filtet_column"
            :key="_.prop"
            :label="_.label"
            :width="_.width"
            show-overflow-tooltip
          >
            <template v-slot="scope">
              <span>
                {{ formartValue(scope.row, _.prop) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AutoColumn
      ref="autoColumn"
      @initColumn="initColumn"
    />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import indexMixins from '../mixins/receivable_mixins'
function findValue(list = [], val = '', key = '', keyValue = '') {
  let text = ''
  const find = list.find(i => { return i[key] === val })
  if (find) {
    text = find[keyValue]
  }
  return text
}
export default {
  mixins: [consoleData, initColumn, indexMixins],
  methods: {
    formartValue(row, prop) {
      let _text = ''
      function sale(list = [], value = '') {
        const sale_val = []
        const user = value && value.split(',') || []
        user.forEach(i => {
          sale_val.push(findValue(list, i, 'user_id', 'name'))
        })
        return sale_val.join(',')
      }

      switch (prop) {
        case 'meal_flag':
          _text = findValue(this.meal_list, row[prop], 'meal_flag', 'product_name') + '【' + findValue(this.meal_list, row[prop], 'meal_flag', 'meal_name') + '】'
          break
        case 'sale_user_ids':
          _text = sale(this.conf.user_list, row[prop])
          break
        case 'order_rsync_status':
          _text = findValue(this.select.order_rsync_status, row[prop], 'value', 'label')
          break
        case 'receivable_rsync_status':
          _text = findValue(this.select.rsync_status, row[prop], 'value', 'label')
          break
        case 'receivable_confirm_status':
          _text = findValue(this.select.confirm_status, row[prop], 'value', 'label')
          break
        default:
          _text = row[prop]
          break
      }
      return _text
    }
  }
}
</script>
