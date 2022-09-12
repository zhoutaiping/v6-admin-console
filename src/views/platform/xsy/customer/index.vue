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
          v-model="bindParams.member_name"
          placeholder="客户名称"
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
          v-model="bindParams.member_status"
          :selects="options.member_status"
          class="input-box"
          placeholder="服务阶段"
          @change="$refs.DmData.initPage()"
        />

        <el-button
          icon="el-icon-search"
          type="primary"
          @click="$refs.DmData.initPage()"
        >搜索</el-button>
      </DmToolbar>
    </div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list" >
          <el-table-column
            v-for="(_, _index) in column"
            :key="_.prop"
            :label="_.label"
            :width="_.width"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ formartValue(scope.row, _.prop) }}
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import indexMixins from './mixins'
export default {
  mixins: [consoleData, indexMixins],
  methods: {
    formartValue(row, prop) {
      let val = row[prop]
      if (prop === 'section_formal_service_months') {
        val = this.options.section_formal_service_months[val] || ''
      } else if (prop === 'section_end_service_months') {
        val = this.options.section_end_service_months[val] || ''
      } else if (prop === 'customer_rsync_status') {
        val = this.options.customer_rsync_status[val] || ''
      } else if (prop === 'member_status') {
        val = this.options.member_status.find(i => Number(i.value) === Number(val)) ? this.options.member_status.find(i => Number(i.value) === Number(val)).label : ''
      }
      return val
    }
  }
}
</script>
