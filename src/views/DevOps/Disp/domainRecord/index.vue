<style lang="scss" scoped>
.input-box {
  width: 250px;
}
.input-option {
  width: 100px;
}
</style>
<template>
  <console-page-layout>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.ip"
        placeholder="请输入ip"
        class="input-box"
        @submit="$refs.DmData.initPage()"
      />
      <el-input
        v-model="bindParams.bid"
        placeholder="请输入业务ID"
        class="input-box"
        clearable
        @keyup.enter.native="$refs.DmData.initPage()"
      >
        <el-select
          slot="prepend"
          v-model="bindParams.btype"
          placeholder="业务类型"
          class="input-option"
          @change="e =>{ bindParams.bid = '' }"
        >
          <el-option
            v-for="(option, key) in option.btype"
            v-show="option.status !==false"
            :key="key"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-input>
      <yd-form-select
        v-model="bindParams.status"
        :selects="option.status"
        placeholder="状态"
        class="input-box"
        @change="$refs.DmData.initPage()"
      />
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable v-loading="loading">
        <el-table
          ref="receivableList"
          :data="list"
          @selection-change="e =>{ selRow = e}"
        >
          <el-table-column
            type="selection"
            width="55px"
            fixed="left"
          />
          <el-table-column
            v-for="(cell, cell_key) in column"
            :key="cell_key"
            :label="cell.label"
            :fixed="cell.fixed"
            :width="cell.width"
          >
            <template slot-scope="scope">{{ formartValue(scope.row, cell.prop) }}</template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      bindParams: { ip: '', bid: '', btype: 'domain', status: '0', dns_view: '' },
      API_INDEX: '/disp/record/list',
      fetch: this.InvokeDispApi,
      option: {
        btype: [
          { label: '域名', value: 'domain' },
          { label: '套餐', value: 'meal' },
          { label: '用户', value: 'user', status: false },
          { label: '代理商', value: 'agent', status: false }
        ],
        status: [
          { label: '默认', value: '0' },
          { label: '开启', value: '1' },
          { label: '暂停(手动)', value: '2' },
          { label: '暂停(宕机)', value: '3' }
        ]
      },
      selRow: []
    }
  },
  computed: {
    column() {
      if (this.bindParams.btype === 'domain') {
        return [
          { label: '业务ID', prop: 'bid' },
          { label: '域名', prop: 'domain' },
          { label: 'IP', prop: 'ip' },
          { label: '业务类型', prop: 'btype' },
          { label: '状态', prop: 'status' },
          { label: '是否手动', prop: 'is_hand' },
          { label: '线路', prop: 'line' },
          { label: '标签', prop: 'tags' }
        ]
      } else {
        return [
          { label: '业务ID', prop: 'bid' },
          { label: '套餐', prop: 'meal' },
          { label: 'IP', prop: 'ip' },
          { label: '业务类型', prop: 'btype' },
          { label: '状态', prop: 'status' },
          { label: '是否手动', prop: 'is_hand' },
          { label: '线路', prop: 'line' },
          { label: '标签', prop: 'tags' }
        ]
      }
    }
  },
  methods: {
    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'status') {
        val = this.option.status.find(i => { return Number(i.value) === Number(val) }) ? this.option.status.find(i => { return Number(i.value) === Number(val) }).label : val || ''
      } else if (prop === 'is_hand') {
        val = Number(val) === 1 ? '是' : '否'
      } else if (prop === 'tags') {
        val = val && Array.isArray(val) ? val.join('、') : val
      } else if (prop === 'btype') {
        val = this.option.btype.find(i => { return i.value === val }) ? this.option.btype.find(i => { return i.value === val }).label : val || ''
      }
      return val || ''
    }
  }
}
</script>
