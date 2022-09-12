<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="e =>{ $refs.addedit.handleOpen({}, 'Create') }"
      >新 增</el-button>
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
        <el-table :data="list">
          <el-table-column
            v-for="(item, index) in column"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{row}">
              <div v-if="item.prop === 'status' ">
                {{ row.status === 1 ? '启用': '禁用' }}
              </div>
              <div v-else-if="item.prop === 'remarks'">
                <span>
                  {{ row.remarks }}
                </span>
              </div>
              <div v-else>
                {{ formartValue(row, item.prop) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
          >
            <template slot-scope="{row}">
              <el-button
                type="text"
                @click="$refs.addedit.handleOpen(row, 'Edit')"
              >编 辑</el-button>
              <el-button
                type="text"
                @click="Del(row)"
              >删 除</el-button>
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
import AddEdit from './components/add-edit-channer-suffix'
export default {
  components: { AddEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/zero.trust.suffix.manage.list',
      bindParams: {},
      selRow: [],
      column: [
        { label: '渠道商', prop: 'channel_name', width: 160 },
        { label: '渠道商邮箱', prop: 'channel_email' },
        { label: '后缀', prop: 'suffix' },
        // { label: '状态', prop: 'status' },
        { label: '备注', prop: 'remarks', width: 300 }
      ]
    }
  },
  methods: {
    formartValue(data, prop) {
      return data[prop]
    },
    Del(data) {
      this.$confirm('确认删除吗, 此操作不可恢复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const params = {
            id: data.id
          }
          await this.Fetch.delete('/fd/V4/zero.trust.suffix.manage.del', params)
          this.Message('ACTION_SUCCESS')
          await this.$refs.DmData.initPage()
        } catch (error) {
          return
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.table-sass {
  padding: 12px;
}
</style>
