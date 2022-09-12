<template>
  <DmTable min-height>
    <el-table :data="list">
      <el-table-column type="index"/>
      <el-table-column v-for="(tab, index) in column" :key="index" :label="tab.label">
        <template slot-scope="scope">
          {{ formartValue(scope.row, tab.prop) }}
        </template>
      </el-table-column>
    </el-table>
  </DmTable>
</template>
<script>
export default {
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
      list: []
    }
  },
  methods: {
    formartValue(data, prop) {
      return data[prop] || ''
    }
  }
}
</script>
