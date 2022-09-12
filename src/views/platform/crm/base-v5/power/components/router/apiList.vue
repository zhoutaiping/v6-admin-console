<template>
  <DmData
    ref="DmData"
    :auto-init="false"
    @init="fetchList"
  >
    <el-form :model="form" @submit.native.prevent>
      <el-form-item >
        <InputSearch
          v-model="bindParams.keyword"
          placeholder="关键字"
          style="width:250px;"
          @submit="$refs.DmData.initPage()"
        />
        <el-button type="primary" icon="el-icon-search" @click="$refs.DmData.initPage()"/>
      </el-form-item>
    </el-form>
    <DmTable :loading="loading" min-height>
      <el-table
        :data="router"
        @selection-change="e =>{
          check = e
          $emit('check', e)
        }"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="(tab, index) in column"
          :key="index"
          :width="tab.width"
          :label="tab.label"
        >
          <template slot-scope="scope">
            {{ formartValue(scope.row, tab.prop) }}
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </DmData>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    column: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {},
      API_INDEX: '',
      bindParams: {},
      check: [],
      router: []
    }
  },
  watch: {
    list(val) {
      if (this.API_INDEX) {
        this.router = val
      }
    }
  },
  created() {
    this.check = []
  },
  methods: {
    init(API_INDEX = '', bindParams = {}) {
      this.check = []
      if (API_INDEX) {
        this.API_INDEX = API_INDEX
        this.bindParams = { ...bindParams }
        this.$refs.DmData.initPage()
      } else {
        this.router = this.data
      }
    },
    formartValue(data, prop) {
      return data[prop] || ''
    }
  }
}
</script>
