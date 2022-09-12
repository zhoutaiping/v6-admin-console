<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="e =>{ $refs.addedit.handleOpen({}, 'Create') }"
      >新 增</el-button>
      <el-button
        :disabled="!selRow.length"
        @click="Del"
      >删 除</el-button>
      <el-button @click="e =>{ $refs.DmData.initPage() }">刷 新</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
          @selection-change="e =>{ selRow = e}"
        >
          <el-table-column
            type="selection"
            width="50"
          />
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{row}">
              <div v-if="item.prop === 'status' ">
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="e =>{ changeStatus({
                    version_id:row.version_id,
                    status: row.status
                  }) }"
                />
                {{ row.status === 1 ? '启用': '禁用' }}
              </div>
              <div v-else-if="item.prop === 'remarks'">
                <span>
                  {{ row.remarks }}
                </span>
                <el-button
                  type="text"
                  class="el-icon-edit-outline"
                  @click="$refs.addedit.handleOpen(row, 'Edit')"
                />
              </div>
              <div v-else>
                {{ formartValue(row, item.prop) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEdit
      ref="addedit"
      @init="$refs.DmData.initPage()"
    />
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import AddEdit from './components/add-edit-connector-version'
export default {
  components: { AddEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/zero.trust.connector.version.list',
      bindParams: {},
      selRow: [],
      column: [
        { label: '版本号', prop: 'version', width: 160 },
        // { label: 'Openresty', prop: 'openresty' },
        // { label: 'Web Terminal', prop: 'webTerminal' },
        { label: 'Connector Client', prop: 'connector' },
        { label: '备注', prop: 'remarks', width: 300 },
        { label: '状态', prop: 'status' }
      ]
    }
  },
  methods: {
    formartValue(data, prop) {
      return data[prop]
    },
    Del() {
      this.$confirm('确认删除吗, 此操作不可恢复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const params = {
            version_ids: this.selRow.map(i => i.version_id)
          }
          await this.Fetch.post('/fd/V4/zero.trust.connector.version.del', params)
          this.Message('ACTION_SUCCESS')
          await this.$refs.DmData.initPage()
        } catch (error) {
          return
        }
      })
    },
    async changeStatus(params = {}) {
      try {
        await this.Fetch.post('/fd/V4/zero.trust.connector.version.change.status', params)
        this.Message('ACTION_SUCCESS')
        await this.$refs.DmData.initPage()
      } catch (error) {
        return
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.table-sass {
  padding: 12px;
}
</style>
