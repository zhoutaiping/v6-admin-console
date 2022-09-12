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
          v-model="bindParams.flow_id"
          placeholder="流水ID"
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
          placeholder="支付邮箱"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        /><br>
        <DmSelect
          v-model="bindParams.flow_confirm_status"
          :selects="options.flow_confirm_status"
          class="input-box"
          placeholder="流水审核状态"
          @change="$refs.DmData.initPage()"
        />
        <DmSelect
          v-model="bindParams.flow_rsync_status"
          :selects="options.flow_rsync_status"
          class="input-box"
          placeholder="流水同步状态"
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
      </DmToolbar>
    </div>
    <DmData ref="DmData" @init="fetchList">
      <DmTable :loading="loading">
        <el-table :data="list" @selection-change="e => selectRow = e">
          <el-table-column v-for="(_, _index) in filtet_column" :key="_.prop" :label="_.label" :mini-width="_.width" show-overflow-tooltip >
            <template v-slot="scope">
              <div v-if="_.prop === 'meal_flag'">{{ mealText(scope.row.meal_flag) }}</div>
              <div v-else-if="_.prop === 'flow_source'">
                {{ FLOW_TYPE_TEXT[scope.row.flow_type] +'--' }}{{ FLOW_SOURCE_TEXT[Number(scope.row.flow_source)] || '--' }}
              </div>
              <div v-else-if="_.prop === 'flow_status'">
                <el-tag
                  :type="Number(scope.row.flow_status) === 1 ?'success':'warning'"
                  size="mini"
                >{{ Number(scope.row.flow_status) === 1 ?'正常':'作废' }}</el-tag>
              </div>
              <div v-else-if="_.prop === 'sales'">{{ saleText(scope.row.sale_user_ids) }}</div>
              <div v-else>
                {{ formartValue(scope.row, _.prop) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AutoColumn ref="autoColumn" @initColumn="initColumn" />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import initColumn from '@/mixins/initColumn'
import indexMixins from '../mixins/refund_mixins'
import formart from '../mixins/formart'
export default {
  mixins: [consoleData, initColumn, indexMixins, formart]
}
</script>
