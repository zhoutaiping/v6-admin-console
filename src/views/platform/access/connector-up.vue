<template>
  <console-page-layout>
    <DmToolbar>
      <!-- <div slot="right">
        <InputSearch
          v-model="bindParams.app_type"
          placeholder="应用类型"
          class="input-box"
          @submit="$refs.DmData.initPage()"
        />
      </div> -->
      <el-button
        type="primary"
        @click="e =>{ $refs.addedit.handleOpen({}, 'Create') }"
      >新 增</el-button>
      <el-button
        :disabled="!selRow.length"
        @click="Del"
      >删 除</el-button>
      <el-button @click="$refs.DmData.initPage()">刷 新</el-button>
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
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              <div>
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
              >编辑</el-button>
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
import AddEdit from './components/add-edit-sass-connector'
export default {
  components: { AddEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/fd/V4/zero.trust.connector.image.list',
      selRow: [],
      column: [
        { label: '版本号', prop: 'version' },
        { label: '类型', prop: 'image_type' },
        { label: '下载链接', prop: 'image_url' },
        { label: '备注', prop: 'remarks' }
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
            image_ids: this.selRow.map(i => i.image_id)
          }
          await this.Fetch.post('/fd/V4/zero.trust.connector.image.del', params)
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
