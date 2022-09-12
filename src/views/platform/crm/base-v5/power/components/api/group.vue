<style lang="scss" scoped>
.input-box {
  width: 300px;
}
</style>
<template>
  <DmDialog
    ref="dialog"
    title="分组"
    width="800px"
    @fetchSubmit="fetchSubmit"
  >
    <el-form :model="form">
      <el-form-item label="" style="text-align:center">
        <el-input
          v-model="form.keys"
          placeholder="名称、路由、系统、所属产品"
          clearable
          class="input-box"
        />
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSubmit"
        >搜 索</el-button>
      </el-form-item>
      <el-form-item label="">
        <DmTable min-height>
          <el-table :data="[]">
            <el-table-column v-for="(tab, index) in column" :key="index" :label="tab.label">
              <template slot-scope="scope">
                {{ formartValue(scope.row, tab.prop) }}
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        keys: ''
      },
      column: [
        { label: 'API名称', prop: 'name' },
        { label: '路由', prop: 'router' },
        { label: '系统', prop: 'system' },
        { label: '所属模块名称', prop: 'model' }
      ]
    }
  },
  methods: {
    handleOpen(data, option) {
      this.$nextTick(() => {
        this.$refs.dialog.handleOpen()
      })
    },
    formartValue(data, prop) {
      return data[prop] || ''
    },
    handleSubmit() { },
    fetchSubmit() { }
  }
}
</script>
